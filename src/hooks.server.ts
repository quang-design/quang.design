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
