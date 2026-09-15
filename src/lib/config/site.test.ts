import { describe, expect, it } from 'vitest';
import { SITE_ORIGIN, absUrl, isExternalHref } from './site';

describe('absUrl', () => {
	it('prefixes a site path', () => {
		expect(absUrl('/design/posts/doppio/doppio_1.avif')).toBe(
			`${SITE_ORIGIN}/design/posts/doppio/doppio_1.avif`
		);
	});

	it('keeps an absolute url', () => {
		expect(absUrl('https://cdn.example/x.jpg')).toBe('https://cdn.example/x.jpg');
	});
});

describe('isExternalHref', () => {
	it('treats site paths as internal', () => {
		expect(isExternalHref('/blog/posts/dev-is-strange')).toBe(false);
		expect(isExternalHref('#main-content')).toBe(false);
		expect(isExternalHref('./CD-Cover-1.avif')).toBe(false);
		expect(isExternalHref(`${SITE_ORIGIN}/design`)).toBe(false);
	});

	it('treats http(s) off-site links as external', () => {
		expect(isExternalHref('https://animations.dev/vocabulary')).toBe(true);
		expect(isExternalHref('http://quang.urbanup.com/9858947')).toBe(true);
	});

	it('ignores empty and non-http schemes', () => {
		expect(isExternalHref(undefined)).toBe(false);
		expect(isExternalHref('mailto:hi@quang.design')).toBe(false);
		expect(isExternalHref('javascript:void(0)')).toBe(false);
	});
});
