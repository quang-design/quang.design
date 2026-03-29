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
	const galleryMd = preprocessDesignMd(lines.slice(metaLineIndex + 1).join('\n').trim());

	return { introMd, metaParts, galleryMd };
}
