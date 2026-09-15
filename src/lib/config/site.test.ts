import { describe, expect, it } from 'vitest';
import { SITE_ORIGIN, absUrl } from './site';

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
