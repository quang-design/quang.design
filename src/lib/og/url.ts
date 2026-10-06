import { SITE_ORIGIN } from '$lib/config/site';

export function shareImageUrl(canonical: string, origin = SITE_ORIGIN) {
	let url: URL;
	try {
		url = new URL(canonical);
	} catch {
		return undefined;
	}
	if (url.origin !== new URL(SITE_ORIGIN).origin) return undefined;
	const path = url.pathname.replace(/\/+$/, '') || '/';
	return `${origin}${path === '/' ? '/og' : `/og${path}`}`;
}
