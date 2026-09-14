const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

export function safeHref(href: unknown): string | undefined {
	if (typeof href !== 'string') return undefined;

	const trimmed = href.trim();
	if (!trimmed || trimmed.length > 2_048) return undefined;
	if (trimmed.startsWith('//') || trimmed.startsWith('\\')) return undefined;

	if (
		trimmed.startsWith('/') ||
		trimmed.startsWith('#') ||
		trimmed.startsWith('./') ||
		trimmed.startsWith('../')
	) {
		return trimmed;
	}

	try {
		const url = new URL(trimmed);
		if (ALLOWED_PROTOCOLS.has(url.protocol)) return trimmed;
	} catch {
		return undefined;
	}

	return undefined;
}

export function safeSrc(src: unknown): string | undefined {
	const href = safeHref(src);
	if (!href || href.startsWith('mailto:') || href.startsWith('#')) return undefined;
	return href;
}
