---
title: 'Why SvelteKit security headers failed on Vercel (and the 2-file fix that works)'
description: >
  I went from D to A+ on securityheaders.com in 3 attempts. Here's what I learned 
  about why hooks.server.ts isn't enough on Vercel, and the exact two-file pattern 
  that actually works.
date: '2025-10-12'
published: true
thumbnail: '/blog/posts/security-headers-sveltekit/security-headers-sveltekit.avif'
---

![security headers in sveltekit](/blog/posts/security-headers-sveltekit/security-headers-sveltekit.avif)

I went from D to A+ on securityheaders.com in 3 attempts. Here's what I learned about SvelteKit, Vercel's edge network, and why you need BOTH svelte.config.js AND vercel.json to make security headers actually work.

## TL;DR (the working solution)

Two files. That's it:

**svelte.config.js**: CSP with auto-generated nonces

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter(),
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'wasm-unsafe-eval'],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https:'],
				'font-src': ['self', 'data:'],
				'connect-src': ['self'],
				'frame-ancestors': ['self'],
				'base-uri': ['self'],
				'form-action': ['self']
			}
		}
	}
};
export default config;
```

**vercel.json**: All other static security headers

```json
{
	"headers": [
		{
			"source": "/(.*)",
			"headers": [
				{ "key": "X-Frame-Options", "value": "SAMEORIGIN" },
				{ "key": "X-Content-Type-Options", "value": "nosniff" },
				{ "key": "Referrer-Policy", "value": "no-referrer" },
				{
					"key": "Permissions-Policy",
					"value": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
				},
				{ "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" },
				{ "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
				{ "key": "Cross-Origin-Resource-Policy", "value": "same-origin" },
				{ "key": "X-DNS-Prefetch-Control", "value": "off" }
			]
		}
	]
}
```

Why two files? Keep reading.

## Why this matters

Security headers block 80% of XSS attacks. Most sites get an F on securityheaders.com. I was getting a D until I understood this split. Now I get an A+.

Check your own site: https://securityheaders.com/

## The problem: hooks.server.ts isn't enough on Vercel

Standard advice: "Just use hooks.server.ts for security headers!"

Doesn't work on Vercel. Here's why:

Vercel's edge network sits in front of your SvelteKit app. When you set headers in hooks.server.ts, they're added to the response AFTER it leaves Vercel's edge. For most headers, Vercel needs to set them at the CDN level, not at the application level.

CSP is the exception—it MUST stay in your app because nonces are generated per-request. Static CSP = useless CSP (no XSS protection).

This split confused me for 2 days.

## Attempt #1: hooks.server.ts (this won't work on Vercel)

I followed the standard SvelteKit security headers guide from [Adding security headers to your SvelteKit application](https://edoverflow.com/2023/sveltekit-security-headers/) and added everything to hooks.server.ts:

```typescript
// hooks.server.ts - this approach fails on Vercel
export const handle: Handle = async ({ event, resolve }) => {
	const nonce = randomBytes(16).toString('base64');
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => addNonceToScripts(html, nonce)
	});

	// Setting headers here doesn't reach Vercel's edge
	response.headers.set('Content-Security-Policy', buildCSP(nonce));
	Object.entries(STATIC_SECURITY_HEADERS).forEach(([header, value]) => {
		response.headers.set(header, value);
	});
	return response;
};
```

Deployed and checked. Still a D.

![my initial score - a solid D](/blog/posts/security-headers-sveltekit/initial-score.avif)

Waited a day for cache to clear. Still D. Nothing's changed.

Oh boy, that's messed up. I followed the steps!

**Why it failed:** Vercel's edge network sits in front of your SvelteKit app. When you set headers in hooks.server.ts, they're added to the response AFTER it leaves Vercel's edge. Vercel's edge doesn't see them, so static headers never get applied. They're being set too late in the response cycle.

## Attempt #2: vercel.json (half the solution)

I moved static headers to vercel.json so Vercel's edge can see them:

```json
{
	"headers": [
		{
			"source": "/(.*)",
			"headers": [
				{ "key": "X-Frame-Options", "value": "SAMEORIGIN" },
				{ "key": "X-Content-Type-Options", "value": "nosniff" },
				{ "key": "Referrer-Policy", "value": "no-referrer" }
			]
		}
	]
}
```

And kept CSP in hooks.server.ts with manual nonce injection:

```typescript
// hooks.server.ts - still manual nonce handling
export const handle: Handle = async ({ event, resolve }) => {
	const nonce = randomBytes(16).toString('base64');
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => addNonceToScripts(html, nonce)
	});
	response.headers.set('Content-Security-Policy', buildCSP(nonce));
	return response;
};
```

**Result: Better! Static headers now work. But CSP is still broken.**

**Why it failed:** Can't hardcode nonces in vercel.json—they need to be unique per request. Static CSP = no XSS protection. The manual nonce injection in hooks works, but it's verbose and error-prone.

## Attempt #3: Split the difference (the actual solution)

The next day, I asked for feedback and a friend who leads the [Svelte Vietnam](https://www.sveltevietnam.dev/) project showed me there's a cleaner approach. SvelteKit has built-in CSP support that handles nonce generation automatically!

Static headers → vercel.json  
CSP with nonces → svelte.config.js

Instead of manually managing CSP in hooks, you can configure it directly in svelte.config.js:

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter(),
		csp: {
			mode: 'auto', // SvelteKit generates unique nonces per request
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'wasm-unsafe-eval'],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https:'],
				'font-src': ['self', 'data:'],
				'connect-src': ['self'],
				'frame-ancestors': ['self'],
				'base-uri': ['self'],
				'form-action': ['self']
			}
		}
	}
};
export default config;
```

You can delete hooks.server.ts entirely. SvelteKit's `mode: 'auto'` automatically:

- Generates unique nonces for each request
- Injects nonces into script tags
- Sets the Content-Security-Policy header

This is much cleaner and follows SvelteKit's conventions. The static security headers stay in vercel.json since they're platform-specific.

**Result: A+ rating on securityheaders.com**

![A+ rating - we made it!](/blog/posts/security-headers-sveltekit/final-score.avif)

## What I learned

1. **Vercel's edge vs. app-level headers matter.** Static headers must be set at the CDN level (vercel.json), not in your app code.

2. **SvelteKit has CSP built-in.** Use `svelte.config.js` with `mode: 'auto'` instead of manually managing nonces in hooks.

3. **Security headers aren't one-size-fits-all.** Some headers belong to your platform (X-Frame-Options, HSTS). Others belong to your app (CSP with nonces). Split them accordingly.

## Takeaway

SvelteKit's CSP config (svelte.config.js) + Vercel's static headers (vercel.json) = A+ security score.

Check your own site: https://securityheaders.com/

If you're on Vercel + SvelteKit and getting a low score, this two-file pattern is probably what you're missing.

Took me 3 attempts. Now it'll take you one.
