const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function designHref(slug: string | null | undefined) {
	if (typeof slug !== 'string' || slug === 'null' || slug === 'undefined') return null;
	if (!SLUG.test(slug)) return null;
	return `/design/${slug}`;
}
