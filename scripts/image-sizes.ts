import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import type { Plugin } from 'vite';

type ImageSize = { w: number; h: number };

const IMAGE_EXT = new Set(['.avif', '.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg']);

const SECTIONS = [
	{ dir: 'design', prefix: '/design/posts' },
	{ dir: 'blog', prefix: '/blog/posts' }
] as const;

function walk(dir: string): string[] {
	const out: string[] = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...walk(full));
		else out.push(full);
	}
	return out;
}

export async function collectImageSizes(root: string) {
	const sizes: Record<string, ImageSize> = {};
	const files: string[] = [];

	for (const section of SECTIONS) {
		const contentDir = path.join(root, 'src/content', section.dir);
		const slugs = readdirSync(contentDir, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name);

		for (const slug of slugs) {
			const slugDir = path.join(contentDir, slug);
			for (const file of walk(slugDir)) {
				const ext = path.extname(file).toLowerCase();
				if (!IMAGE_EXT.has(ext)) continue;
				files.push(file);
				const rel = path.relative(slugDir, file).split(path.sep).join('/');
				const url = `${section.prefix}/${slug}/${rel}`;
				try {
					const meta = await sharp(file).metadata();
					if (!meta.width || !meta.height) continue;
					sizes[url] = { w: meta.width, h: meta.height };
				} catch (error) {
					if (ext === '.svg') continue;
					const message = error instanceof Error ? error.message : String(error);
					console.warn(`image-sizes: ${url}: ${message}`);
				}
			}
		}
	}

	const ordered = Object.fromEntries(Object.entries(sizes).sort(([a], [b]) => a.localeCompare(b)));
	return { sizes: ordered, files };
}

export function imageSizesPlugin(
	root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
): Plugin {
	const id = 'virtual:image-sizes';
	const resolved = `\0${id}`;
	let cache: { sizes: Record<string, ImageSize>; files: string[] } | null = null;

	return {
		name: 'image-sizes',
		configureServer(server) {
			const content = path.join(root, 'src/content');
			server.watcher.add(content);
			const invalidate = (file: string) => {
				const rel = path.relative(root, file);
				if (!rel.startsWith(`src${path.sep}content${path.sep}`)) return;
				if (!IMAGE_EXT.has(path.extname(file).toLowerCase())) return;
				cache = null;
				const mod = server.moduleGraph.getModuleById(resolved);
				if (!mod) return;
				server.moduleGraph.invalidateModule(mod);
				server.ws.send({ type: 'full-reload' });
			};
			server.watcher.on('add', invalidate);
			server.watcher.on('unlink', invalidate);
		},
		resolveId(source) {
			if (source === id) return resolved;
		},
		async load(source) {
			if (source !== resolved) return null;
			cache ??= await collectImageSizes(root);
			for (const file of cache.files) this.addWatchFile(file);
			return `export default ${JSON.stringify(cache.sizes)};\n`;
		},
		watchChange(file) {
			const rel = path.relative(root, file);
			if (rel.startsWith(`src${path.sep}content${path.sep}`)) cache = null;
		}
	};
}
