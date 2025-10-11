import { randomBytes } from 'node:crypto';
import type { Handle } from '@sveltejs/kit';

const SITE_URL = 'https://quang.design';

const STATIC_SECURITY_HEADERS = {
	'X-Frame-Options': 'SAMEORIGIN',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'no-referrer',
	'Permissions-Policy':
		'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
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
