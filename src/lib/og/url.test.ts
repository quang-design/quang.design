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

	it('points a preview deploy at the preview host', () => {
		const previous = {
			VERCEL_ENV: process.env.VERCEL_ENV,
			VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL
		};
		process.env.VERCEL_ENV = 'preview';
		process.env.VERCEL_BRANCH_URL = 'quang-design-git-branch-quang-project.vercel.app';
		expect(shareImageUrl(`${SITE_ORIGIN}/design`)).toBe(
			'https://quang-design-git-branch-quang-project.vercel.app/og/design'
		);
		if (previous.VERCEL_ENV === undefined) delete process.env.VERCEL_ENV;
		else process.env.VERCEL_ENV = previous.VERCEL_ENV;
		if (previous.VERCEL_BRANCH_URL === undefined) delete process.env.VERCEL_BRANCH_URL;
		else process.env.VERCEL_BRANCH_URL = previous.VERCEL_BRANCH_URL;
	});
});
