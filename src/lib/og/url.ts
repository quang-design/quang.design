import { SITE_ORIGIN } from '$lib/config/site';

function imageOrigin() {
	if (process.env.VERCEL_ENV === 'preview') {
		const host = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
		if (host) return `https://${host}`;
	}
	return SITE_ORIGIN;
}

export function shareImageUrl(canonical: string) {
	let url: URL;
	try {
		url = new URL(canonical);
	} catch {
		return undefined;
	}
	if (url.origin !== new URL(SITE_ORIGIN).origin) return undefined;
	const path = url.pathname.replace(/\/+$/, '') || '/';
	return `${imageOrigin()}${path === '/' ? '/og' : `/og${path}`}`;
}
