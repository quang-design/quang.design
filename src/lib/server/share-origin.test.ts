import { afterEach, describe, expect, it } from 'vitest';
import { SITE_ORIGIN } from '$lib/config/site';
import { shareOrigin } from './share-origin';

const keys = ['VERCEL_ENV', 'VERCEL_PROJECT_PRODUCTION_URL', 'VERCEL_BRANCH_URL', 'VERCEL_URL'] as const;
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
		process.env.VERCEL_PROJECT_PRODUCTION_URL = 'my-site.com';
		expect(shareOrigin()).toBe(SITE_ORIGIN);
	});

	it('uses the production host on preview', () => {
		process.env.VERCEL_ENV = 'preview';
		process.env.VERCEL_PROJECT_PRODUCTION_URL = 'my-site.com';
		process.env.VERCEL_BRANCH_URL = 'quang-design-git-branch-quang-project.vercel.app';
		process.env.VERCEL_URL = 'quang-design-abc123.vercel.app';
		expect(shareOrigin()).toBe('https://my-site.com');
	});

	it('uses the site origin when preview has no production host', () => {
		process.env.VERCEL_ENV = 'preview';
		delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
		process.env.VERCEL_BRANCH_URL = 'quang-design-git-branch-quang-project.vercel.app';
		expect(shareOrigin()).toBe(SITE_ORIGIN);
	});
});
