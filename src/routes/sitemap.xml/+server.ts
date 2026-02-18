import type { RequestHandler } from './$types';
import { getAllPosts as getAllBlogPosts } from '$lib/content/blog';
import { getAllPosts as getAllDesignPosts } from '$lib/content/design';
import { getAllPosts as getAllEngineeringPosts } from '$lib/content/engineering';

export const GET: RequestHandler = async () => {
	const noindex = ['/404', '/styles'];

	// 1. grab every +page.svelte under src/routes
	const modules = import.meta.glob('../../**/+page.svelte', { eager: false });

	// 2. turn filenames into clean slugs
	const staticPages = Object.keys(modules)
		.map(
			(file) =>
				file
					.replace(/\.{2}/g, '') // remove all occurrences of the relative path prefix
					.replace(/\/\([^)]+\)/g, '') // remove layout groups
					.replace(/\/\+page\.svelte$/, '') // drop the +page.svelte suffix
					.replace(/\/index$/, '') // turn /foo/index → /foo
					.replace(/\/\/+/g, '/') // collapse multiple slashes
		)
		.filter((route) => !noindex.includes(route)) // filter out no-indexed routes
		.filter((route) => !route.includes('[')); // strip dynamic routes

	// 3. Get content posts with metadata
	const contentPosts = [
		...getAllBlogPosts().map((post) => ({ ...post, urlPrefix: '/blog/posts' })),
		...getAllDesignPosts().map((post) => ({ ...post, urlPrefix: '/design' })),
		...getAllEngineeringPosts().map((post) => ({ ...post, urlPrefix: '/engineering' }))
	].map((post) => {
		const lastmod = post.date ? new Date(post.date).toISOString() : new Date().toISOString();
		return {
			url: `${post.urlPrefix}/${post.slug}`,
			lastmod: Number.isNaN(new Date(lastmod).getTime()) ? new Date().toISOString() : lastmod,
			priority: '0.8'
		};
	});

	// 4. Combine static pages and content posts
	const allPages = [
		...staticPages.map((slug) => ({
			url: slug || '/',
			lastmod: new Date().toISOString(),
			priority: slug === '' ? '1.0' : '0.6'
		})),
		...contentPosts
	];

	// 5. Generate sitemap XML
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		(page) => `  <url>
    <loc>${new URL(page.url, 'https://quang.design').href}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
