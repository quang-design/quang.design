import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../../routes/api/og/+server';
import { assertPublicHttpUrl, parseOg } from './og';

afterEach(() => {
	vi.unstubAllGlobals();
});

function ogEvent(href: string) {
	return {
		url: new URL(`https://quang.design/api/og?url=${encodeURIComponent(href)}`)
	} as Parameters<typeof GET>[0];
}

describe('assertPublicHttpUrl', () => {
	it('accepts https', () => {
		expect(assertPublicHttpUrl('https://www.brandsvietnam.com/x').hostname).toBe(
			'www.brandsvietnam.com'
		);
	});

	it('rejects localhost', () => {
		expect(() => assertPublicHttpUrl('http://127.0.0.1/secret')).toThrow(/public/);
	});

	it('rejects file urls', () => {
		expect(() => assertPublicHttpUrl('file:///etc/passwd')).toThrow(/http/);
	});
});

describe('parseOg', () => {
	it('reads og tags in either attribute order', () => {
		const html = `
			<meta content="Gold Winner" property="og:title" />
			<meta property="og:image" content="/img.jpg" />
			<meta name="og:description" content="Young Lions" />
			<title>Ignored</title>
		`;
		expect(parseOg(html, 'https://example.com/p')).toEqual({
			title: 'Gold Winner',
			image: 'https://example.com/img.jpg',
			description: 'Young Lions'
		});
	});

	it('falls back to title and description meta', () => {
		const html = `<title> Fallback </title><meta name="description" content="Hi">`;
		expect(parseOg(html, 'https://example.com')).toEqual({
			title: 'Fallback',
			description: 'Hi'
		});
	});

	it('unescapes a single entity level', () => {
		const html = `<meta property="og:title" content="A &amp; B" />`;
		expect(parseOg(html, 'https://example.com').title).toBe('A & B');
	});

	it('does not turn double-encoded tags into markup', () => {
		const html = `<meta property="og:title" content="&amp;lt;script&amp;gt;" />`;
		expect(parseOg(html, 'https://example.com').title).toBe('&lt;script&gt;');
	});
});

describe('GET /api/og', () => {
	it('returns a hostname card when the upstream host blocks the fetch', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(
				async () => new Response('<title>Attention Required! | Cloudflare</title>', { status: 403 })
			)
		);
		const href =
			'https://www.brandsvietnam.com/congdong/topic/28096-vietnam-young-lions-2020-2021-danh-sach-nhung-chu-su-tu-tre-tai-nang';
		const res = await GET(ogEvent(href));
		expect(res.status).toBe(200);
		await expect(res.json()).resolves.toEqual({
			eyebrow: 'Link',
			title: 'www.brandsvietnam.com',
			href
		});
		expect(res.headers.get('cache-control')).toBe('public, max-age=60');
	});

	it('returns a hostname card when the upstream fetch throws', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => {
				throw new Error('timeout');
			})
		);
		const href = 'https://www.brandsvietnam.com/blocked';
		const res = await GET(ogEvent(href));
		expect(res.status).toBe(200);
		await expect(res.json()).resolves.toEqual({
			eyebrow: 'Link',
			title: 'www.brandsvietnam.com',
			href
		});
	});
});
