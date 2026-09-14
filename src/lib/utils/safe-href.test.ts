import { describe, expect, it } from 'vitest';
import { safeHref, safeSrc } from './safe-href';

describe('safeHref', () => {
	it('allows http, https, mailto, and site-relative paths', () => {
		expect(safeHref('https://quang.design/blog')).toBe('https://quang.design/blog');
		expect(safeHref('http://example.com')).toBe('http://example.com');
		expect(safeHref('mailto:xinchao@quang.design')).toBe('mailto:xinchao@quang.design');
		expect(safeHref('/blog/posts/security-headers-sveltekit')).toBe(
			'/blog/posts/security-headers-sveltekit'
		);
		expect(safeHref('#section')).toBe('#section');
		expect(safeHref('./image.png')).toBe('./image.png');
	});

	it('rejects javascript, data, and protocol-relative URLs', () => {
		expect(safeHref('javascript:alert(1)')).toBeUndefined();
		expect(safeHref('data:text/html,hi')).toBeUndefined();
		expect(safeHref('//evil.example/steal')).toBeUndefined();
		expect(safeHref('vbscript:msgbox(1)')).toBeUndefined();
		expect(safeHref('')).toBeUndefined();
		expect(safeHref(null)).toBeUndefined();
	});
});

describe('safeSrc', () => {
	it('allows http(s) and relative image paths', () => {
		expect(safeSrc('/anh-nhi/duck.webp')).toBe('/anh-nhi/duck.webp');
		expect(safeSrc('./DSC03005.avif')).toBe('./DSC03005.avif');
		expect(safeSrc('https://quang.design/og.png')).toBe('https://quang.design/og.png');
	});

	it('rejects javascript, mailto, and hash-only values', () => {
		expect(safeSrc('javascript:alert(1)')).toBeUndefined();
		expect(safeSrc('mailto:xinchao@quang.design')).toBeUndefined();
		expect(safeSrc('#section')).toBeUndefined();
	});
});
