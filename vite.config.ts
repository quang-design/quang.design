import { defineConfig, type UserConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy, type Target } from 'vite-plugin-static-copy';
import fs from 'node:fs';
import path from 'node:path';

function buildAssetCopyTargets(section: string, urlPrefix: string): Target[] {
	const contentDir = path.resolve(`src/content/${section}`);
	const slugs = fs.existsSync(contentDir)
		? fs
				.readdirSync(contentDir, { withFileTypes: true })
				.filter((d) => d.isDirectory())
				.map((d) => d.name)
		: [];

	return slugs.map((slug) => ({
		src: `src/content/${section}/${slug}/**/*.*`,
		dest: `${urlPrefix}/${slug}`,
		transform: {
			encoding: 'buffer' as const,
			handler: (content: Buffer, filename: string) => {
				if (filename.endsWith(`${path.sep}post.md`)) return null;
				return content;
			}
		}
	}));
}

const assetCopyTargets: Target[] = [
	...buildAssetCopyTargets('blog', 'blog/posts'),
	...buildAssetCopyTargets('design', 'design/posts'),
	...buildAssetCopyTargets('engineering', 'engineering/posts')
];

const staticCopyPlugins = viteStaticCopy({
	targets: assetCopyTargets,
	watch: {
		reloadPageOnChange: true
	}
});

const config: UserConfig & {
	test?: {
		include: string[];
	};
} = {
	plugins: [enhancedImages(), sveltekit(), tailwindcss(), ...staticCopyPlugins],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default defineConfig(config);
