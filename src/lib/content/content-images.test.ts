import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const contentRoot = path.join(root, 'src/content');
const imageExt = new Set(['.avif', '.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg']);
const textExt = new Set(['.md', '.svelte', '.ts', '.js', '.mjs', '.css', '.html', '.json', '.txt']);
const skipDir = new Set(['node_modules', '.git', '.svelte-kit', 'build', 'dist', '.vercel']);

function walk(dir: string, acc: string[] = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (skipDir.has(entry.name)) continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(full, acc);
		else acc.push(full);
	}
	return acc;
}

function referenced(corpus: string, file: string) {
	const base = path.basename(file);
	let from = 0;
	while (from < corpus.length) {
		const at = corpus.indexOf(base, from);
		if (at < 0) return false;
		const after = corpus[at + base.length] ?? '';
		if (!/[A-Za-z0-9._-]/.test(after)) return true;
		from = at + base.length;
	}
	return false;
}

describe('content images', () => {
	const files = walk(root);
	const images = files.filter(
		(file) =>
			file.startsWith(contentRoot + path.sep) && imageExt.has(path.extname(file).toLowerCase())
	);
	const corpus = files
		.filter((file) => textExt.has(path.extname(file).toLowerCase()))
		.filter((file) => !imageExt.has(path.extname(file).toLowerCase()))
		.map((file) => readFileSync(file, 'utf8'))
		.join('\n');

	it('keeps only images named by a page, a post, or meta', () => {
		const orphans = images.filter((file) => !referenced(corpus, file));
		expect(orphans.map((file) => path.relative(root, file))).toEqual([]);
	});

	it('resolves every markdown image and thumbnail', () => {
		const posts = files.filter((file) => file.endsWith(`${path.sep}post.md`));
		const missing: string[] = [];
		for (const post of posts) {
			const text = readFileSync(post, 'utf8');
			const dir = path.dirname(post);
			for (const match of text.matchAll(/\]\((\.[^)]+)\)|thumbnail:\s*['"]?(\.[^'"\n]+)/g)) {
				const raw = (match[1] ?? match[2]).replace(/['"]$/, '');
				const rel = path.relative(root, path.resolve(dir, raw));
				try {
					statSync(path.join(root, rel));
				} catch {
					missing.push(rel);
				}
			}
		}
		expect(missing).toEqual([]);
	});
});
