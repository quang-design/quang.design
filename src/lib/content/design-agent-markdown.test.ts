import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getPost } from './design';
import { GET as postLlms } from '../../routes/design/[slug]/llms.txt/+server';
import { GET as postMarkdown } from '../../routes/design/[slug]/post.md/+server';
import { GET as siteLlms } from '../../routes/llms.txt/+server';

const origin = 'https://quang.design';
const contentRoot = path.resolve('src/content/design');

function slugs() {
	return readdirSync(contentRoot, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name);
}

function imageDestinations(markdown: string) {
	return [...markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((match) => match[1]);
}

function staticFile(url: URL) {
	const prefix = '/design/posts/';
	if (!url.pathname.startsWith(prefix)) return null;
	const rel = decodeURIComponent(url.pathname.slice(prefix.length));
	const file = path.resolve(contentRoot, rel);
	if (!file.startsWith(contentRoot + path.sep)) return null;
	return file;
}

function event(slug: string, kind: 'post.md' | 'llms.txt') {
	return {
		params: { slug },
		url: new URL(`${origin}/design/${slug}/${kind}`)
	};
}

describe('design agent markdown images', () => {
	it('points every image in post.md and llms output at a static file', async () => {
		const broken: string[] = [];
		let seen = 0;

		for (const slug of slugs()) {
			const source = imageDestinations(
				readFileSync(path.join(contentRoot, slug, 'post.md'), 'utf8')
			);
			for (const kind of ['post.md', 'llms.txt'] as const) {
				const request = event(slug, kind);
				const response =
					kind === 'post.md'
						? await postMarkdown(request as Parameters<typeof postMarkdown>[0])
						: await postLlms(request as Parameters<typeof postLlms>[0]);
				expect(response.status).toBe(200);
				const dests = imageDestinations(await response.text());
				seen += dests.length;
				if (dests.length !== source.length) {
					broken.push(
						`${slug} ${kind} emitted ${dests.length} images, source has ${source.length}`
					);
				}
				for (const dest of dests) {
					let url: URL;
					try {
						url = new URL(dest);
					} catch {
						broken.push(`${slug} ${kind} ${dest}`);
						continue;
					}
					if (url.origin !== origin) {
						broken.push(`${slug} ${kind} ${dest}`);
						continue;
					}
					const file = staticFile(url);
					if (!file) {
						broken.push(`${slug} ${kind} ${url.href}`);
						continue;
					}
					try {
						statSync(file);
					} catch {
						broken.push(`${slug} ${kind} ${url.href}`);
					}
				}
			}
		}

		const site = await siteLlms({} as Parameters<typeof siteLlms>[0]);
		expect(site.status).toBe(200);
		for (const dest of imageDestinations(await site.text())) {
			seen += 1;
			let url: URL;
			try {
				url = new URL(dest);
			} catch {
				broken.push(`llms.txt ${dest}`);
				continue;
			}
			const file = staticFile(url);
			if (url.origin !== origin || !file) {
				broken.push(`llms.txt ${dest}`);
				continue;
			}
			try {
				statSync(file);
			} catch {
				broken.push(`llms.txt ${url.href}`);
			}
		}

		expect(seen).toBeGreaterThan(0);
		expect(broken).toEqual([]);
	});

	it('keeps the design page image sources on /design/posts', () => {
		const post = getPost('doppio');
		expect(post.md).toContain('](/design/posts/doppio/doppio_1.avif)');
		expect(post.md).not.toContain('https://');
	});
});
