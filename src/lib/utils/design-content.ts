/**
 * Pre-processes design post markdown so it can be rendered by svelte-exmarkdown.
 *
 * Transforms `<!-- 2col -->` directives: marks the following two images with
 * alt="2col" and keeps them on consecutive lines (same paragraph in remark).
 */
export function preprocessDesignMd(md: string): string {
	return md.replace(
		/<!-- 2col -->\s*\n\s*!\[([^\]]*)\]\(([^)]+)\)\s*\n\s*!\[([^\]]*)\]\(([^)]+)\)/g,
		'![2col]($2)\n![2col]($4)'
	);
}

/**
 * Splits design post markdown into structural sections:
 * - introMd: paragraphs before the meta line
 * - metaParts: parsed metadata (Client, Project, Location, Time)
 * - galleryMd: everything after the meta line (images, headings, text)
 */
export function splitDesignContent(md: string) {
	const lines = md.split('\n');
	const metaLineIndex = lines.findIndex(
		(l) => (l.startsWith('*') || l.startsWith('_')) && l.includes('Client:')
	);

	if (metaLineIndex < 0) {
		return { introMd: '', metaParts: [] as string[], galleryMd: preprocessDesignMd(md) };
	}

	const introMd = lines.slice(0, metaLineIndex).join('\n').trim();
	const metaLine = lines[metaLineIndex].replace(/^[*_]+|[*_]+$/g, '');
	const metaParts = metaLine
		.split('·')
		.map((p) => p.trim())
		.filter(Boolean);
	const galleryMd = preprocessDesignMd(
		lines
			.slice(metaLineIndex + 1)
			.join('\n')
			.trim()
	);

	return { introMd, metaParts, galleryMd };
}

export type GalleryCell = { heading: string; body: string; side: 0 | 1 };

export type GalleryRow = { kind: 'text'; cells: GalleryCell[] } | { kind: 'media'; md: string };

const sectionHeading = /^\*\*([^*]+)\*\*$/;

export function layoutGallery(md: string): GalleryRow[] {
	const chunks = md
		.split(/\n\n+/)
		.map((chunk) => chunk.trim())
		.filter(Boolean);

	type TextItem = { kind: 'text'; heading: string; body: string };
	type MediaItem = { kind: 'media'; md: string };
	const items: Array<TextItem | MediaItem> = [];
	let open: { heading: string; paras: string[] } | null = null;

	const close = () => {
		if (!open) return;
		items.push({ kind: 'text', heading: open.heading, body: open.paras.join('\n\n') });
		open = null;
	};

	for (const chunk of chunks) {
		const heading = chunk.match(sectionHeading);
		if (heading) {
			close();
			open = { heading: heading[1].trim(), paras: [] };
			continue;
		}
		if (chunk.startsWith('![')) {
			close();
			items.push({ kind: 'media', md: chunk });
			continue;
		}
		if (open) open.paras.push(chunk);
	}
	close();

	const rows: GalleryRow[] = [];
	let side = 0;

	for (const item of items) {
		if (item.kind === 'media') {
			rows.push(item);
			continue;
		}
		const cell: GalleryCell = { heading: item.heading, body: item.body, side: (side % 2) as 0 | 1 };
		side += 1;
		rows.push({ kind: 'text', cells: [cell] });
	}

	return rows;
}
