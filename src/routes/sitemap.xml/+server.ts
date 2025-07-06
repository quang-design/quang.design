import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	// 1. grab every +page.svelte under src/routes
	const modules = import.meta.glob('../../**/+page.svelte', { eager: false });

	// 2. turn filenames into clean slugs
	const pages = Object.keys(modules)
		.map(
			(file) =>
				file
					.replace('../../routes', '') // drop the src/routes prefix
					.replace(/\/\+page\.svelte$/, '') // drop the +page.svelte suffix
					.replace(/\/index$/, '') // turn /foo/index → /foo
		)
		.filter((route) => route !== '/404') // (optional) filter out any you don’t want
		.filter((route) => !route.includes('[')); // strip dynamic routes

	// now `pages` is exactly ['', '/design', '/blog', '/engineer', '/dev/telescopic', …]
	// …you can serialize these into your sitemap XML
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
			.map(
				(slug) => `<url>
      <loc>${new URL(slug || '/', 'https://quang.design').href}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`
			)
			.join('')}
  </urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
