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
