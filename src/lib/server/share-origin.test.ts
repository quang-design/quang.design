import { afterEach, describe, expect, it } from 'vitest';
import { SITE_ORIGIN } from '$lib/config/site';
import { shareOrigin } from './share-origin';

const keys = ['VERCEL_ENV', 'VERCEL_BRANCH_URL', 'VERCEL_URL'] as const;
const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

afterEach(() => {
	for (const key of keys) {
		const value = previous[key];
		if (value === undefined) delete process.env[key];
		else process.env[key] = value;
	}
});

describe('shareOrigin', () => {
	it('uses the site origin outside preview', () => {
		delete process.env.VERCEL_ENV;
		expect(shareOrigin()).toBe(SITE_ORIGIN);
	});

	it('uses the preview host', () => {
		process.env.VERCEL_ENV = 'preview';
		process.env.VERCEL_BRANCH_URL = 'quang-design-git-branch-quang-project.vercel.app';
		expect(shareOrigin()).toBe('https://quang-design-git-branch-quang-project.vercel.app');
	});

	it('falls back to the deployment url', () => {
		process.env.VERCEL_ENV = 'preview';
		delete process.env.VERCEL_BRANCH_URL;
		process.env.VERCEL_URL = 'quang-design-abc123.vercel.app';
		expect(shareOrigin()).toBe('https://quang-design-abc123.vercel.app');
	});

	it('uses the site origin when preview has no host', () => {
		process.env.VERCEL_ENV = 'preview';
		delete process.env.VERCEL_BRANCH_URL;
		delete process.env.VERCEL_URL;
		expect(shareOrigin()).toBe(SITE_ORIGIN);
	});
});
