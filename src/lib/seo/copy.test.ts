import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { documentTitle, pages, searchDescription } from './copy';

function posts() {
	const found: { title: string; description: string }[] = [];
	const walk = (dir: string) => {
		for (const name of readdirSync(dir)) {
			const path = join(dir, name);
			if (name === 'post.md') {
				const { data } = matter(readFileSync(path, 'utf8'));
				found.push({
					title: typeof data.title === 'string' ? data.title : '',
					description: typeof data.description === 'string' ? data.description : ''
				});
			} else if (!name.includes('.')) {
				walk(path);
			}
		}
	};
	walk('src/content');
	return found;
}

describe('search copy', () => {
	it('keeps index titles and descriptions in the search range', () => {
		for (const page of Object.values(pages)) {
			expect(page.title.length).toBeGreaterThanOrEqual(50);
			expect(page.title.length).toBeLessThanOrEqual(60);
			expect(page.description.length).toBeGreaterThanOrEqual(120);
			expect(page.description.length).toBeLessThanOrEqual(128);
		}
	});

	it('lifts short content titles and descriptions into range', () => {
		for (const post of posts()) {
			const title = documentTitle(post.title);
			const description = searchDescription(post.description);
			expect(title.length).toBeGreaterThanOrEqual(50);
			if (post.title.length < 50) expect(title.length).toBeLessThanOrEqual(60);
			expect(description.length).toBeGreaterThanOrEqual(120);
			expect(description.length).toBeLessThanOrEqual(128);
		}
	});
});
