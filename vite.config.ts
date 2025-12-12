import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy, type Target } from 'vite-plugin-static-copy';
import fs from 'node:fs';
import path from 'node:path';

const blogContentDir = path.resolve('src/content/blog');
const blogSlugs = fs.existsSync(blogContentDir)
	? fs
			.readdirSync(blogContentDir, { withFileTypes: true })
			.filter((d) => d.isDirectory())
			.map((d) => d.name)
	: [];

const blogAssetCopyTargets: Target[] = blogSlugs.map((slug) => ({
	src: `src/content/blog/${slug}/**/*.*`,
	dest: `blog/posts/${slug}`,
	transform: {
		encoding: 'buffer' as const,
		handler: (content: Buffer, filename: string) => {
			if (filename.endsWith(`${path.sep}post.md`)) return null;
			return content;
		}
	}
}));

const blogStaticCopyPlugins = viteStaticCopy({
	targets: blogAssetCopyTargets,
	watch: {
		reloadPageOnChange: true
	}
}) as unknown as any[];

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), ...blogStaticCopyPlugins],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
