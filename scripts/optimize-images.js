#!/usr/bin/env node
/**
 * Converts blog/design/engineering PNG and JPG images to AVIF (with WebP fallback).
 * Originals are kept as-is. Optimized files are written alongside them.
 *
 * Usage: node scripts/optimize-images.js
 */

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const CONTENT_DIRS = [
	'src/content/blog',
	'src/content/design',
	'src/content/engineering'
];

const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

// Quality settings — high enough to stay crisp on Retina/HiDPI displays
const AVIF_QUALITY = 80;
const WEBP_QUALITY = 85;

function findImages(dir) {
	if (!fs.existsSync(dir)) return [];
	const results = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...findImages(full));
		} else if (EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
			results.push(full);
		}
	}
	return results;
}

async function optimizeImage(src) {
	const ext = path.extname(src).toLowerCase();
	const base = src.slice(0, -ext.length);
	const avifOut = base + '.avif';
	const webpOut = base + '.webp';

	const img = sharp(src);
	const meta = await img.metadata();
	const label = path.relative(process.cwd(), src);

	if (fs.existsSync(avifOut)) {
		console.log(`  skip  ${path.relative(process.cwd(), avifOut)} (exists)`);
	} else {
		await img.clone().avif({ quality: AVIF_QUALITY, effort: 6 }).toFile(avifOut);
		const avifSize = fs.statSync(avifOut).size;
		console.log(`  avif  ${path.relative(process.cwd(), avifOut)} (${(avifSize / 1024).toFixed(0)}KB)`);
	}

	if (ext !== '.webp') {
		if (fs.existsSync(webpOut)) {
			console.log(`  skip  ${path.relative(process.cwd(), webpOut)} (exists)`);
		} else {
			await img.clone().webp({ quality: WEBP_QUALITY }).toFile(webpOut);
			const webpSize = fs.statSync(webpOut).size;
			console.log(`  webp  ${path.relative(process.cwd(), webpOut)} (${(webpSize / 1024).toFixed(0)}KB)`);
		}
	}

	const srcSize = fs.statSync(src).size;
	console.log(`  src   ${label} (${(srcSize / 1024).toFixed(0)}KB, ${meta.width}x${meta.height})`);
}

async function main() {
	const images = CONTENT_DIRS.flatMap(findImages);

	if (images.length === 0) {
		console.log('No images found.');
		return;
	}

	console.log(`Found ${images.length} image(s) to process:\n`);
	for (const img of images) {
		console.log(`→ ${path.relative(process.cwd(), img)}`);
		await optimizeImage(img);
		console.log('');
	}

	console.log('Done.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
