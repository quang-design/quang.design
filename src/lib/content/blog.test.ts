import { describe, expect, it } from 'vitest';
import { getAllPosts, getPost } from './blog';

describe('getAllPosts', () => {
	it('omits unlisted security-headers-sveltekit while keeping other blog posts', () => {
		const slugs = getAllPosts().map((post) => post.slug);

		expect(slugs).not.toContain('security-headers-sveltekit');
		expect(slugs).toEqual(expect.arrayContaining(['dev-is-strange', 'this-design-look-sad']));
	});
});

describe('getPost', () => {
	it('still loads an unlisted post by slug', () => {
		const post = getPost('security-headers-sveltekit');
		expect(post.meta.title).toContain('security headers');
		expect(post.md.length).toBeGreaterThan(0);
	});
});
