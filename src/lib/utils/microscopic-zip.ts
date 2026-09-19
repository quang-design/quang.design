export type ZipRange = {
	id: string;
	start: number;
	end: number;
	original: string;
	pending?: boolean;
};

export type TextSegment = {
	id: string;
	text: string;
	zipped: boolean;
	original?: string;
	pending?: boolean;
};

export function replaceSlice(text: string, start: number, end: number, next: string) {
	return text.slice(0, start) + next + text.slice(end);
}

export function zipWordBudget(selection: string) {
	const words = selection.trim().split(/\s+/).filter(Boolean).length;
	if (words <= 4) return Math.max(2, words - 1);
	return Math.min(8, Math.max(5, Math.round(words * 0.65)));
}

export function splitAround(text: string, selection: string) {
	const start = text.indexOf(selection);
	if (start < 0) {
		return { left: '', selection, right: '' };
	}

	return splitAt(text, start, start + selection.length);
}

export function splitAt(text: string, start: number, end: number) {
	return {
		left: text.slice(0, start),
		selection: text.slice(start, end),
		right: text.slice(end)
	};
}

const MIN_EDGE_OVERLAP = 8;

function edgeOverlap(a: string, b: string) {
	const max = Math.min(a.length, b.length);
	for (let n = max; n >= MIN_EDGE_OVERLAP; n--) {
		if (a.slice(-n) === b.slice(0, n)) return n;
	}
	return 0;
}

function stripEdgePunct(text: string, side: 'left' | 'right') {
	return side === 'right' ? text.replace(/^[\s,.;:!?]+/, '') : text.replace(/[\s,.;:!?]+$/, '');
}

export function clipZipToGap(left: string, zip: string, right: string, selection = '') {
	let out = zip.trim().replace(/^["'`]+|["'`]+$/g, '');
	const rightInner = stripEdgePunct(right, 'right');
	const leftInner = stripEdgePunct(left, 'left');

	const rightHit = edgeOverlap(out, rightInner);
	if (rightHit) out = out.slice(0, -rightHit).trim();

	const leftHit = edgeOverlap(leftInner, out);
	if (leftHit) out = out.slice(leftHit).trim();

	const rightP = right.trimStart().match(/^[,.;:!?]/)?.[0];
	if (rightP && out.endsWith(rightP)) out = out.slice(0, -1).trim();

	const leftP = left.trimEnd().match(/[,.;:!?]$/)?.[0];
	if (leftP && out.startsWith(leftP)) out = out.slice(1).trim();

	out = unglue(out, selection);
	out = dropCommaTail(out, right);

	const selWords = wordCount(selection);
	const budget = zipWordBudget(selection);

	if (selection.trim() && firstWord(out) !== firstWord(selection) && left.trim()) {
		out = takeWords(selection, budget);
	} else if (selWords && wordCount(out) > selWords) {
		out = takeWords(selection, selWords <= 4 ? selWords : budget);
	} else if (selection.trim() && wordCount(out) > budget) {
		out = takeWords(out, budget);
	}

	if (!out) out = takeWords(selection, budget);

	return ensureJoin(left, keepSelectionTail(out, selection, right), right);
}

function unwrap(text: string) {
	const trimmed = text.trim();
	const wrapped = /^\((.*)\)$/.exec(trimmed);
	return wrapped ? { inner: wrapped[1] ?? '', wrapped: true } : { inner: trimmed, wrapped: false };
}

function wordCount(text: string) {
	return takeWords(unwrap(text).inner, 99).split(' ').filter(Boolean).length;
}

function firstWord(text: string) {
	return takeWords(unwrap(text).inner, 1).toLowerCase();
}

function takeWords(text: string, maxWords: number) {
	const { inner, wrapped } = unwrap(text);
	const body = inner
		.replace(/\([^)]*\)/g, ' ')
		.replace(/[,.;:!?]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	const words = body.split(' ').filter(Boolean).slice(0, maxWords);
	while (
		words.length > 3 &&
		/^(and|or|but|the|a|an|to|with|from|of|in|on)$/i.test(words[words.length - 1] ?? '')
	) {
		words.pop();
	}
	const joined = words.join(' ');
	return wrapped && joined ? `(${joined})` : joined;
}

function unglue(zip: string, selection: string) {
	if (!zip || !selection) return zip;
	const words = takeWords(unwrap(selection).inner, 99).split(' ').filter(Boolean);
	let out = zip;
	for (let i = 0; i < words.length - 1; i++) {
		const glued = `${words[i]}${words[i + 1]}`;
		const re = new RegExp(glued.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
		out = out.replace(re, `${words[i]} ${words[i + 1]}`);
	}
	return out;
}

function dropCommaTail(zip: string, right: string) {
	const idx = zip.lastIndexOf(',');
	if (idx <= 0) return zip;
	const tail = zip.slice(idx + 1).trim();
	if (!tail) return zip;
	const rightWords = new Set(
		takeWords(unwrap(right).inner, 99).toLowerCase().split(' ').filter(Boolean)
	);
	const tailWords = takeWords(tail, 99)
		.toLowerCase()
		.split(' ')
		.filter((word) => word && !/^(and|or|but|the|a|an|to|with|into)$/i.test(word));
	if (tailWords.some((word) => rightWords.has(word))) {
		return zip.slice(0, idx).trimEnd();
	}
	return zip;
}

function needsGap(left: string, right: string) {
	return /[A-Za-z0-9)]$/.test(left) && /^[A-Za-z0-9(]/.test(right);
}

function ensureJoin(left: string, zip: string, right: string) {
	let out = zip;
	if (needsGap(left, out)) out = ` ${out}`;
	if (!out && needsGap(left, right)) out = ' ';
	if (needsGap(out, right)) out = `${out} `;
	else if (/[,.;:!?]$/.test(out) && /^[A-Za-z0-9(]/.test(right)) out = `${out} `;
	return out;
}

function keepSelectionTail(zip: string, selection: string, right: string) {
	if (!zip) return zip;
	const tail = selection.match(/([,.;:!?]+)(\s*)$/);
	if (!tail) return zip;

	const punct = tail[1];
	const space = tail[2];
	let out = zip.replace(/\s+$/, '');
	if (punct && !/^[\s]*[,.;:!?]/.test(right) && !out.endsWith(punct)) out += punct;
	if (space && !right.startsWith(space) && !out.endsWith(space)) out += space;
	return out;
}

export function shiftRanges(ranges: ZipRange[], cutStart: number, oldEnd: number, newEnd: number) {
	const delta = newEnd - oldEnd;
	return ranges
		.filter((range) => range.end <= cutStart || range.start >= oldEnd)
		.map((range) =>
			range.start >= oldEnd
				? { ...range, start: range.start + delta, end: range.end + delta }
				: range
		);
}

export function toSegments(text: string, ranges: ZipRange[]): TextSegment[] {
	const sorted = [...ranges].sort((a, b) => a.start - b.start);
	const segments: TextSegment[] = [];
	let cursor = 0;

	for (const range of sorted) {
		if (range.start > cursor) {
			segments.push({
				id: `text-${cursor}`,
				text: text.slice(cursor, range.start),
				zipped: false
			});
		}

		segments.push({
			id: range.id,
			text: text.slice(range.start, range.end),
			zipped: true,
			original: range.original,
			pending: range.pending
		});
		cursor = range.end;
	}

	if (cursor < text.length) {
		segments.push({
			id: `text-${cursor}`,
			text: text.slice(cursor),
			zipped: false
		});
	}

	return segments;
}

export function rangeFromSelection(root: HTMLElement, range: Range) {
	if (!root.contains(range.commonAncestorContainer)) return null;

	const prefix = document.createRange();
	prefix.selectNodeContents(root);
	prefix.setEnd(range.startContainer, range.startOffset);
	const start = prefix.toString().length;
	const end = start + range.toString().length;

	if (start === end) return null;
	return { start, end };
}
