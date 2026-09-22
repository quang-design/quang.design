import { describe, expect, it } from 'vitest';
import { SITE_ORIGIN } from '$lib/config/site';
import { shareImageUrl } from './url';

describe('shareImageUrl', () => {
	it('points each site route at its own image', () => {
		expect(shareImageUrl(`${SITE_ORIGIN}`)).toBe(`${SITE_ORIGIN}/og`);
		expect(shareImageUrl(`${SITE_ORIGIN}/`)).toBe(`${SITE_ORIGIN}/og`);
		expect(shareImageUrl(`${SITE_ORIGIN}/design`)).toBe(`${SITE_ORIGIN}/og/design`);
		expect(shareImageUrl(`${SITE_ORIGIN}/design/simplex`)).toBe(`${SITE_ORIGIN}/og/design/simplex`);
		expect(shareImageUrl(`${SITE_ORIGIN}/blog/posts/dev-is-strange`)).toBe(
			`${SITE_ORIGIN}/og/blog/posts/dev-is-strange`
		);
	});

	it('ignores a canonical off this site', () => {
		expect(shareImageUrl('https://example.com/design')).toBeUndefined();
		expect(shareImageUrl('not a url')).toBeUndefined();
	});
});
