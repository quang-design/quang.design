import { SITE_ORIGIN } from '$lib/config/site';

export function shareOrigin() {
	if (process.env.VERCEL_ENV !== 'preview') return SITE_ORIGIN;
	const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
	return host ? `https://${host}` : SITE_ORIGIN;
}
