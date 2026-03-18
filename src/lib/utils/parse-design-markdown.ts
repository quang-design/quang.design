export type LayoutBlock =
	| { type: 'text'; content: string }
	| { type: 'meta'; parts: string[] }
	| { type: 'img'; src: string }
	| { type: '2col'; left: string; right: string }
	| { type: 'heading'; content: string };

export function parseDesignMarkdown(md: string): LayoutBlock[] {
	const lines = md.split('\n');
	const result: LayoutBlock[] = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (line.startsWith('<!-- 2col -->')) {
			const imgLines: string[] = [];
			let j = i + 1;
			while (j < lines.length && imgLines.length < 2) {
				if (lines[j].startsWith('![')) imgLines.push(lines[j]);
				else if (lines[j].trim()) break;
				j++;
			}
			const left = imgLines[0]?.match(/!\[.*?\]\((.*?)\)/)?.[1] ?? '';
			const right = imgLines[1]?.match(/!\[.*?\]\((.*?)\)/)?.[1] ?? '';
			if (left || right) result.push({ type: '2col', left, right });
			i = j;
		} else if (line.startsWith('![')) {
			const src = line.match(/!\[.*?\]\((.*?)\)/)?.[1];
			if (src) result.push({ type: 'img', src });
			i++;
		} else if ((line.startsWith('*') || line.startsWith('_')) && line.includes('Client:')) {
			const text = line.replace(/^[*_]|[*_]$/g, '');
			const parts = text
				.split('·')
				.map((p) => p.trim())
				.filter(Boolean);
			result.push({ type: 'meta', parts });
			i++;
		} else if (line.startsWith('**') && line.endsWith('**')) {
			result.push({ type: 'heading', content: line.slice(2, -2) });
			i++;
		} else if (line.trim()) {
			result.push({ type: 'text', content: line });
			i++;
		} else {
			i++;
		}
	}
	return result;
}

export function splitDesignBlocks(blocks: LayoutBlock[]) {
	const metaIndex = blocks.findIndex((b) => b.type === 'meta');

	const metaBlock =
		metaIndex >= 0 ? (blocks[metaIndex] as { type: 'meta'; parts: string[] }) : undefined;

	const textBlocks = blocks
		.slice(0, metaIndex >= 0 ? metaIndex : undefined)
		.filter((b) => b.type === 'text') as { type: 'text'; content: string }[];

	const galleryBlocks = blocks
		.slice(metaIndex >= 0 ? metaIndex + 1 : 0)
		.filter(
			(b) => b.type === 'img' || b.type === '2col' || b.type === 'heading' || b.type === 'text'
		) as (
		| { type: 'img'; src: string }
		| { type: '2col'; left: string; right: string }
		| { type: 'heading'; content: string }
		| { type: 'text'; content: string }
	)[];

	return { metaBlock, textBlocks, galleryBlocks };
}
