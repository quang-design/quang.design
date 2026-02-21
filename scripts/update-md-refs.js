#!/usr/bin/env node
/**
 * Updates image references in markdown files to use .avif instead of .png/.jpg/.jpeg/.webp.
 * Only rewrites references where a corresponding .avif file exists.
 *
 * Usage: node scripts/update-md-refs.js
 */

import fs from 'node:fs';
import path from 'node:path';

const CONTENT_DIRS = [
	'src/content/blog',
	'src/content/design',
	'src/content/engineering'
];

function findMarkdownFiles(dir) {
	if (!fs.existsSync(dir)) return [];
	const results = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) results.push(...findMarkdownFiles(full));
		else if (entry.name.endsWith('.md')) results.push(full);
	}
	return results;
}

function updateMarkdown(mdPath) {
	const dir = path.dirname(mdPath);
	let content = fs.readFileSync(mdPath, 'utf8');
	let changed = false;

	const updated = content.replace(/([\w./-]+)\.(png|jpg|jpeg|webp)/gi, (match, base, _ext) => {
		const avifPath = path.join(dir, base + '.avif');
		if (fs.existsSync(avifPath)) {
			changed = true;
			return base + '.avif';
		}
		return match;
	});

	if (changed) {
		fs.writeFileSync(mdPath, updated, 'utf8');
		console.log(`updated  ${path.relative(process.cwd(), mdPath)}`);
	} else {
		console.log(`skipped  ${path.relative(process.cwd(), mdPath)}`);
	}
}

const files = CONTENT_DIRS.flatMap(findMarkdownFiles);
console.log(`Found ${files.length} markdown file(s)\n`);
for (const f of files) updateMarkdown(f);
console.log('\nDone.');
