export const SITE_ORIGIN = 'https://quang.design';

export function absUrl(path: string) {
	if (path.startsWith('http://') || path.startsWith('https://')) return path;
	return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
