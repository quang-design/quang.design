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

	if (!out) out = takeWords(selection, zipWordBudget(selection));

	return keepSelectionTail(out, selection, right);
}

function takeWords(text: string, maxWords: number) {
	const body = text
		.replace(/\([^)]*\)/g, ' ')
		.replace(/[,.;:!?]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	return body.split(' ').filter(Boolean).slice(0, maxWords).join(' ');
}

function keepSelectionTail(zip: string, selection: string, right: string) {
	if (!zip) return zip;
	const tail = selection.match(/([,.;:!?]+)(\s*)$/);
	if (!tail) return zip;

	let out = zip;
	const punct = tail[1];
	const space = tail[2];
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
