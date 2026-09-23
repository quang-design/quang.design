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

function lightRows(data: Buffer, width: number, channels: number) {
	const rows: number[] = [];
	for (let y = 0; y < data.length / (width * channels); y++) {
		let n = 0;
		for (let x = 48; x < 280; x++) {
			if ((data[(y * width + x) * channels] ?? 0) > 160) n++;
		}
		if (n > 8) rows.push(y);
	}
	return rows;
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

		const { data, info } = await sharp(design).raw().toBuffer({ resolveWithObject: true });
		const rows = lightRows(data, info.width, info.channels);
		let label = 0;
		for (let x = 48; x < 280; x++) {
			if ((data[(47 * info.width + x) * info.channels] ?? 0) > 100) label++;
		}
		expect(label).toBeGreaterThan(8);
		expect(rows).toContain(95);
		expect(rows.some((y) => y >= 574 && y <= 576)).toBe(true);
	});
});
