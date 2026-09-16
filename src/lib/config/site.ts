export const SITE_ORIGIN = 'https://quang.design';

export function absUrl(path: string) {
	if (path.startsWith('http://') || path.startsWith('https://')) return path;
	return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

export function isExternalHref(href: string | undefined | null) {
	if (!href) return false;
	const value = href.trim();
	if (
		value.startsWith('/') ||
		value.startsWith('#') ||
		value.startsWith('.') ||
		value.startsWith('mailto:') ||
		value.startsWith('tel:')
	) {
		return false;
	}
	try {
		const url = new URL(value, SITE_ORIGIN);
		return (
			(url.protocol === 'http:' || url.protocol === 'https:') &&
			url.origin !== new URL(SITE_ORIGIN).origin
		);
	} catch {
		return false;
	}
}
