import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { SHARE_HEIGHT, SHARE_WIDTH } from '$lib/og/size';
import { shareCard } from './share-card';
import { loadShareFonts, renderShareCard } from './share-image';

const fonts = loadShareFonts(
	readFileSync('static/fonts/CommitMono-400-Regular.woff2'),
	readFileSync('static/fonts/CommitMono-700-Regular.woff2')
);

async function inkPixels(png: Buffer) {
	const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
	let dark = 0;
	for (let i = 0; i < data.length; i += info.channels) {
		if ((data[i] ?? 255) < 40 && (data[i + 1] ?? 255) < 40 && (data[i + 2] ?? 255) < 40) dark++;
	}
	return dark;
}

describe('renderShareCard', () => {
	it('renders a png whose pixels change with the route', async () => {
		const homeCard = shareCard('/');
		const designCard = shareCard('/design');
		const studyCard = shareCard('/design/simplex');
		if (!homeCard || !designCard || !studyCard) throw new Error('missing card');

		const home = await renderShareCard(homeCard, fonts);
		const design = await renderShareCard(designCard, fonts);
		const study = await renderShareCard(studyCard, fonts);

		expect(home.subarray(0, 8)).toEqual(
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
		);
		expect(await sharp(home).metadata()).toMatchObject({
			width: SHARE_WIDTH,
			height: SHARE_HEIGHT,
			format: 'png'
		});
		expect(Buffer.compare(home, design)).not.toBe(0);
		expect(Buffer.compare(design, study)).not.toBe(0);
		expect(await inkPixels(home)).toBeGreaterThan(500);
		expect(await inkPixels(study)).toBeGreaterThan(500);
	});
});
