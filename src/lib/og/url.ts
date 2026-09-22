import { SITE_ORIGIN, absUrl } from '$lib/config/site';

export function shareImageUrl(canonical: string) {
	let url: URL;
	try {
		url = new URL(canonical);
	} catch {
		return undefined;
	}
	if (url.origin !== new URL(SITE_ORIGIN).origin) return undefined;
	const path = url.pathname.replace(/\/+$/, '') || '/';
	return absUrl(path === '/' ? '/og' : `/og${path}`);
}
