import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { collectImageSizes } from '../../../scripts/image-sizes';

const root = process.cwd();

describe('image size registry', () => {
	it('records pixel size for every markdown image the design and blog pages serve', async () => {
		const { sizes } = await collectImageSizes(root);
		const missing: string[] = [];

		for (const section of [
			{ dir: 'design', prefix: '/design/posts' },
			{ dir: 'blog', prefix: '/blog/posts' }
		]) {
			const contentDir = path.join(root, 'src/content', section.dir);
			const slugs = readdirSync(contentDir, { withFileTypes: true })
				.filter((entry) => entry.isDirectory())
				.map((entry) => entry.name);
			for (const slug of slugs) {
				const post = path.join(contentDir, slug, 'post.md');
				const text = readFileSync(post, 'utf8');
				for (const match of text.matchAll(/\]\((\.[^)\s]+)\)/g)) {
					const rel = match[1].replace(/^\.\//, '');
					const url = `${section.prefix}/${slug}/${rel}`;
					const size = sizes[url];
					if (!size || size.w < 1 || size.h < 1) missing.push(url);
				}
			}
		}

		expect(missing).toEqual([]);
		expect(Object.keys(sizes).length).toBeGreaterThan(100);
	});

	it('matches sharp metadata for a known asset', async () => {
		const { sizes } = await collectImageSizes(root);
		const meta = await sharp(path.join(root, 'src/content/design/alluvia/logo.avif')).metadata();
		expect(sizes['/design/posts/alluvia/logo.avif']).toEqual({ w: meta.width, h: meta.height });
	});
});
