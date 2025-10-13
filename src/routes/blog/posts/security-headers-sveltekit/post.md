---
title: 'security headers in sveltekit'
description: >
  Getting from a D to an A+ on securityheaders.com, learning about CSP,
  nonces, and why sometimes you need both hooks.server.ts AND vercel.json
  to make things work.
date: '2025-10-12'
published: true
thumbnail: '/blog/posts/security-headers-sveltekit/security-headers-sveltekit.webp'
---

![security headers in sveltekit](/blog/posts/security-headers-sveltekit/security-headers-sveltekit.webp)

## why bother?

So I'm learning full-stack at Codecademy and hit the security-related HTTP headers module. They mentioned something interesting:

> "Having security headers configured well also increases a website's trustworthiness, which in turn makes it rank higher in web searches (SEO)."

If you care about SEO or in the future AEO (Answer Engine Optimization), this could become a good practice.

You can use https://securityheaders.com/ to check which headers are active on your web address.

## the reality check

Let's try it. Tested quang.design and got a D. Not bad? I guess.

![my initial score - a solid D](/blog/posts/security-headers-sveltekit/initial-score.png)

Here's the distribution of total scores - most sites are F anyway, so D feels kinda okay.

![distribution of security header scores](/blog/posts/security-headers-sveltekit/score-distribution.png)

But what's Apple's score? Good benchmark to see how far we are from the top.

![apple's security headers - learn from the best](/blog/posts/security-headers-sveltekit/apple-headers.png)

You can learn a lot from how they write their security headers. Time to fix mine.

## attempt #1: hooks.server.ts

So let's fix it. It's pretty simple. I'm using SvelteKit so I found this short and sweet article, [Adding security headers to your SvelteKit application](https://edoverflow.com/2023/sveltekit-security-headers/), to follow. Tried to follow it and then added it to _hooks.server.ts_:

```typescript
// hooks.server.ts
import { randomBytes } from 'node:crypto';
import type { Handle } from '@sveltejs/kit';

const SITE_URL = 'https://quang.design';

const STATIC_SECURITY_HEADERS = {
	'X-Frame-Options': 'SAMEORIGIN',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'no-referrer',
	'Permissions-Policy':
		'accelerometer=(), \
        camera=(), \
        geolocation=(), \
        gyroscope=(), \
        magnetometer=(), \
        microphone=(), \
        payment=(), \
        usb=()',
	'Cross-Origin-Embedder-Policy': 'require-corp',
	'Cross-Origin-Opener-Policy': 'same-origin',
	'Cross-Origin-Resource-Policy': 'same-origin',
	'Origin-Agent-Cluster': '?1',
	'X-DNS-Prefetch-Control': 'off',
	'X-Download-Options': 'noopen',
	'X-Permitted-Cross-Domain-Policies': 'none',
	'X-XSS-Protection': '0'
};

function buildCSP(nonce: string): string {
	return [
		"default-src 'self'",
		`script-src 'self' 'nonce-${nonce}'`,
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: https:",
		"font-src 'self' data:",
		"connect-src 'self'",
		"frame-ancestors 'self'",
		"base-uri 'self'",
		"form-action 'self'"
	].join('; ');
}

function addNonceToScripts(html: string, nonce: string): string {
	return html.replaceAll(/<script\b(?![^>]*nonce=)/g, `<script nonce="${nonce}"`);
}

export const handle: Handle = async ({ event, resolve }) => {
	const nonce = randomBytes(16).toString('base64');

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => addNonceToScripts(html, nonce)
	});

	response.headers.set('Content-Security-Policy', buildCSP(nonce));
	response.headers.set('Access-Control-Allow-Origin', SITE_URL);

	Object.entries(STATIC_SECURITY_HEADERS).forEach(([header, value]) => {
		response.headers.set(header, value);
	});

	return response;
};
```

Done. Commit and deploy. Check again. Nope. Still D.

## the waiting game

Hmm. Maybe there's cache everywhere. Let's wait for another day.

Next morning, check again. Still D. Nothing's changed.

Oh boy, that's messed up. I followed the steps!

## attempt #2: vercel.json

Do another quick Google search and found this [vercel.json docs](https://vercel.com/docs/project-configuration). You can add those headers to this file instead of adding to hooks. Let's do it again.

```json
// vercel.json
{
	"$schema": "https://openapi.vercel.sh/vercel.json",
	"buildCommand": "vite build",
	"devCommand": "vite dev",
	"headers": [
		{
			"source": "/(.*)",
			"headers": [
				{
					"key": "X-Frame-Options",
					"value": "SAMEORIGIN"
				},
				{
					"key": "X-Content-Type-Options",
					"value": "nosniff"
				},
				{
					"key": "Referrer-Policy",
					"value": "no-referrer"
				},
				{
					"key": "Permissions-Policy",
					"value": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
				},
				{
					"key": "Cross-Origin-Embedder-Policy",
					"value": "require-corp"
				},
				{
					"key": "Cross-Origin-Opener-Policy",
					"value": "same-origin"
				},
				{
					"key": "Cross-Origin-Resource-Policy",
					"value": "same-origin"
				},
				{
					"key": "Origin-Agent-Cluster",
					"value": "?1"
				},
				{
					"key": "X-DNS-Prefetch-Control",
					"value": "off"
				},
				{
					"key": "X-Download-Options",
					"value": "noopen"
				},
				{
					"key": "X-Permitted-Cross-Domain-Policies",
					"value": "none"
				},
				{
					"key": "X-XSS-Protection",
					"value": "0"
				},
				{
					"key": "Access-Control-Allow-Origin",
					"value": "https://quang.design"
				}
			]
		}
	]
}
```

And updated _hooks.server.ts_:

```typescript
// hooks.server.ts
import { randomBytes } from 'node:crypto';
import type { Handle } from '@sveltejs/kit';

function buildCSP(nonce: string): string {
	return [
		"default-src 'self'",
		`script-src 'self' 'nonce-${nonce}'`,
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: https:",
		"font-src 'self' data:",
		"connect-src 'self'",
		"frame-ancestors 'self'",
		"base-uri 'self'",
		"form-action 'self'"
	].join('; ');
}

function addNonceToScripts(html: string, nonce: string): string {
	return html.replaceAll(/<script\b(?![^>]*nonce=)/g, `<script nonce="${nonce}"`);
}

export const handle: Handle = async ({ event, resolve }) => {
	const nonce = randomBytes(16).toString('base64');

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => addNonceToScripts(html, nonce)
	});

	// CSP requires dynamic nonce generation, so it stays in hooks.server.ts
	// All other static security headers are configured in vercel.json
	response.headers.set('Content-Security-Policy', buildCSP(nonce));

	return response;
};
```

## the moment of truth

Anddddddd voila!

![A+ rating - we made it!](/blog/posts/security-headers-sveltekit/final-score.png)

A+ rating! We made it!

## what i learned

This is my dev diary to keep track of my learning in public. This is no mean to be completed and subjected to failures since I'm pretty new to all of this. Bare with me till next issue. Cheers!
