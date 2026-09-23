import { create } from 'fontkit';
import sharp from 'sharp';
import { SHARE_HEIGHT, SHARE_WIDTH } from '$lib/og/size';
import type { ShareCard } from './share-card';

const PAPER = '#120b00';
const INK = '#d5cbb5';
const INK_60 = '#7f7662';
const INK_25 = '#3c3422';
const INK_10 = '#221a09';

const G = 48;
const PAD = 48;
const MEASURE = 1000;

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
	return d;
}

function wrap(font: ShareFont, text: string, size: number, maxWidth: number) {
	const words = text.split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let line = '';
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (measure(font, next, size) <= maxWidth) {
			line = next;
			continue;
		}
		if (line) lines.push(line);
		line = word;
	}
	if (line) lines.push(line);
	return lines;
}

function bodyLines(font: ShareFont, text: string) {
	const wrapped = wrap(font, text, 24, MEASURE);
	if (wrapped.length <= 4) return wrapped;
	const cropped = wrapped.slice(0, 4).join(' ');
	const end = Math.max(cropped.lastIndexOf('. '), cropped.lastIndexOf('! '), cropped.lastIndexOf('? '));
	const sentence = end === -1 ? cropped : cropped.slice(0, end + 1);
	return wrap(font, sentence, 24, MEASURE);
}

function grid() {
	const parts: string[] = [];
	for (let x = G; x < SHARE_WIDTH; x += G) {
		parts.push(`<line x1="${x}" y1="0" x2="${x}" y2="${SHARE_HEIGHT}"/>`);
	}
	for (let y = G; y < SHARE_HEIGHT; y += G) {
		parts.push(`<line x1="0" y1="${y}" x2="${SHARE_WIDTH}" y2="${y}"/>`);
	}
	return `<g stroke="${INK_10}" stroke-width="1" fill="none">${parts.join('')}</g>`;
}

function shareCardSvg(card: ShareCard, fonts: ShareFonts) {
	let headingSize = 36;
	let heading = wrap(fonts.bold, card.heading, headingSize, MEASURE);
	if (heading.length > 2) {
		headingSize = 28;
		heading = wrap(fonts.bold, card.heading, headingSize, MEASURE);
	}
	const body = bodyLines(fonts.regular, card.body);
	const lastBaseline = SHARE_HEIGHT - G;
	const bodyStart = body.length ? lastBaseline - (body.length - 1) * G : lastBaseline;
	const headingY = bodyStart - heading.length * G;
	const labelTracking = 20 * 0.08;
	const headingPaths = heading
		.map(
			(line, i) =>
				`<path d="${draw(fonts.bold, line, PAD, headingY + i * G, headingSize)}" fill="${INK}"/>`
		)
		.join('');
	const bodyPaths = body
		.map(
			(line, i) =>
				`<path d="${draw(fonts.regular, line, PAD, bodyStart + i * G, 24)}" fill="${INK}"/>`
		)
		.join('');
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SHARE_WIDTH}" height="${SHARE_HEIGHT}" viewBox="0 0 ${SHARE_WIDTH} ${SHARE_HEIGHT}">
<rect width="${SHARE_WIDTH}" height="${SHARE_HEIGHT}" fill="${PAPER}"/>
${grid()}
<line x1="0" y1="${G * 3}" x2="${SHARE_WIDTH}" y2="${G * 3}" stroke="${INK_25}" stroke-width="1"/>
<path d="${draw(fonts.regular, 'WELCOME TO', PAD, G, 20, labelTracking)}" fill="${INK_60}"/>
<path d="${draw(fonts.regular, 'quang.design', PAD, G * 2, 24)}" fill="${INK}"/>
${headingPaths}
${bodyPaths}
</svg>`;
}

export async function renderShareCard(card: ShareCard, fonts: ShareFonts) {
	const png = await sharp(Buffer.from(shareCardSvg(card, fonts)))
		.png()
		.toBuffer();
	return png;
}
