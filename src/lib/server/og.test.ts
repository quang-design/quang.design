import { describe, expect, it } from 'vitest';
import { assertPublicHttpUrl, parseOg } from './og';

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
