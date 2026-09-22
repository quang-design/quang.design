import { create } from 'fontkit';
import sharp from 'sharp';
import { SHARE_HEIGHT, SHARE_WIDTH } from '$lib/og/size';
import type { ShareCard } from './share-card';

const PAPER = '#d5cbb5';
const INK = '#120b00';
const INK_60 = '#584f3c';
const INK_25 = '#9f9580';
const INK_10 = '#bfb59f';

const GRID = 24;
const PAD = GRID * 2;
const HEADER = GRID * 2;

type DrawnPath = {
	scale(x: number, y: number): DrawnPath;
	translate(x: number, y: number): DrawnPath;
	toSVG(): string;
};

type ShareGlyph = {
	advanceWidth: number;
	path: DrawnPath;
};

export type ShareFont = {
	unitsPerEm: number;
	layout(text: string): { glyphs: ShareGlyph[] };
};

export type ShareFonts = {
	regular: ShareFont;
	bold: ShareFont;
};

function isShareFont(font: unknown): font is ShareFont {
	if (typeof font !== 'object' || font === null) return false;
	if (!('unitsPerEm' in font) || typeof font.unitsPerEm !== 'number') return false;
	if (!('layout' in font) || typeof font.layout !== 'function') return false;
	return true;
}

function openFont(bytes: Uint8Array): ShareFont {
	const font = create(Buffer.from(bytes));
	if (!isShareFont(font)) throw new Error('Unreadable font');
	return font;
}

export function loadShareFonts(regular: Uint8Array, bold: Uint8Array): ShareFonts {
	return { regular: openFont(regular), bold: openFont(bold) };
}

function measure(font: ShareFont, text: string, size: number, tracking = 0) {
	if (!text) return 0;
	const scale = size / font.unitsPerEm;
	const glyphs = font.layout(text).glyphs;
	let width = 0;
	for (let i = 0; i < glyphs.length; i++) {
		width += glyphs[i].advanceWidth * scale;
		if (i < glyphs.length - 1) width += tracking;
	}
	return width;
}

function draw(font: ShareFont, text: string, x: number, y: number, size: number, tracking = 0) {
	const scale = size / font.unitsPerEm;
	const glyphs = font.layout(text).glyphs;
	let cursor = x;
	let d = '';
	for (let i = 0; i < glyphs.length; i++) {
		const glyph = glyphs[i];
		d += glyph.path.scale(scale, -scale).translate(cursor, y).toSVG();
		cursor += glyph.advanceWidth * scale;
		if (i < glyphs.length - 1) cursor += tracking;
	}
	return { d, width: cursor - x };
}

function wrap(font: ShareFont, text: string, size: number, maxWidth: number) {
	const words = text.split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let line = '';
	const pushWord = (word: string) => {
		if (measure(font, word, size) <= maxWidth) {
			line = word;
			return;
		}
		let chunk = '';
		for (const char of word) {
			const trial = chunk + char;
			if (measure(font, trial, size) > maxWidth && chunk) {
				lines.push(chunk);
				chunk = char;
			} else {
				chunk = trial;
			}
		}
		line = chunk;
	};
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (measure(font, next, size) <= maxWidth) {
			line = next;
			continue;
		}
		if (line) lines.push(line);
		pushWord(word);
	}
	if (line) lines.push(line);
	return lines.length ? lines : [''];
}

function ellipsis(font: ShareFont, line: string, size: number, maxWidth: number) {
	const mark = '…';
	let text = line;
	while (text && measure(font, `${text}${mark}`, size) > maxWidth) {
		text = text.slice(0, -1);
	}
	return text ? `${text}${mark}` : mark;
}

function fit(font: ShareFont, text: string, maxWidth: number, sizes: number[], maxLines: number) {
	for (const size of sizes) {
		const lines = wrap(font, text, size, maxWidth);
		if (lines.length <= maxLines) return { size, lines };
	}
	const size = sizes[sizes.length - 1] ?? 32;
	const wrapped = wrap(font, text, size, maxWidth);
	const lines = wrapped.slice(0, maxLines);
	if (wrapped.length > maxLines && lines.length) {
		lines[lines.length - 1] = ellipsis(font, lines[lines.length - 1] ?? '', size, maxWidth);
	}
	return { size, lines };
}

function gridLines() {
	const parts: string[] = [];
	for (let x = GRID; x < SHARE_WIDTH; x += GRID) {
		parts.push(`<line x1="${x}" y1="0" x2="${x}" y2="${SHARE_HEIGHT}"/>`);
	}
	for (let y = GRID; y < SHARE_HEIGHT; y += GRID) {
		parts.push(`<line x1="0" y1="${y}" x2="${SHARE_WIDTH}" y2="${y}"/>`);
	}
	return parts.join('');
}

type BlockLine = {
	text: string;
	font: ShareFont;
	size: number;
	tracking: number;
	color: string;
	gap: number;
};

function shareCardSvg(card: ShareCard, fonts: ShareFonts) {
	const maxWidth = SHARE_WIDTH - PAD * 2;
	const title = fit(fonts.bold, card.title, maxWidth, [88, 64, 48, 36], 3);
	const subtitle = card.line ? fit(fonts.regular, card.line, maxWidth, [28, 22], 2) : undefined;
	const kickerSize = 16;
	const kickerTracking = kickerSize * 0.08;
	const lines: BlockLine[] = [
		{
			text: card.kicker.toUpperCase(),
			font: fonts.regular,
			size: kickerSize,
			tracking: kickerTracking,
			color: INK_60,
			gap: GRID * 2
		},
		...title.lines.map((text, index) => ({
			text,
			font: fonts.bold,
			size: title.size,
			tracking: 0,
			color: INK,
			gap: index === title.lines.length - 1 && subtitle ? GRID : title.size * 0.28
		}))
	];
	if (subtitle) {
		subtitle.lines.forEach((text, index) => {
			lines.push({
				text,
				font: fonts.regular,
				size: subtitle.size,
				tracking: 0,
				color: INK_60,
				gap: index === subtitle.lines.length - 1 ? 0 : subtitle.size * 0.35
			});
		});
	}

	const blockHeight = lines.reduce((sum, line) => sum + line.size + line.gap, 0);
	const areaTop = HEADER + GRID;
	const areaBottom = SHARE_HEIGHT - PAD;
	let y = areaTop + Math.max(0, (areaBottom - areaTop - blockHeight) / 2);

	const body = lines
		.map((line) => {
			const baseline = y + line.size * 0.78;
			const drawn = draw(line.font, line.text, PAD, baseline, line.size, line.tracking);
			y += line.size + line.gap;
			return `<path d="${drawn.d}" fill="${line.color}"/>`;
		})
		.join('');

	const mark = draw(fonts.bold, 'quang.design', PAD, HEADER * 0.68, 18);
	const path = draw(
		fonts.regular,
		card.path,
		SHARE_WIDTH - PAD - measure(fonts.regular, card.path, 16),
		HEADER * 0.68,
		16
	);

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SHARE_WIDTH}" height="${SHARE_HEIGHT}" viewBox="0 0 ${SHARE_WIDTH} ${SHARE_HEIGHT}">
<rect width="${SHARE_WIDTH}" height="${SHARE_HEIGHT}" fill="${PAPER}"/>
<g stroke="${INK_10}" stroke-width="1" fill="none">${gridLines()}</g>
<path d="${mark.d}" fill="${INK}"/>
<path d="${path.d}" fill="${INK_60}"/>
<line x1="0" y1="${HEADER}" x2="${SHARE_WIDTH}" y2="${HEADER}" stroke="${INK_25}" stroke-width="1"/>
${body}
<rect x="0.5" y="0.5" width="${SHARE_WIDTH - 1}" height="${SHARE_HEIGHT - 1}" fill="none" stroke="${INK_25}" stroke-width="1"/>
</svg>`;
}

export async function renderShareCard(card: ShareCard, fonts: ShareFonts) {
	const png = await sharp(Buffer.from(shareCardSvg(card, fonts)))
		.png()
		.toBuffer();
	return png;
}
