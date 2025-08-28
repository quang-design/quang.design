import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

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

	// 3. Get blog posts with metadata
	const postsBaseDir = path.resolve('src/routes/blog/posts');
	let blogPosts: Array<{ url: string; lastmod: string; priority: string }> = [];

	try {
		const postSlugs = await fs.readdir(postsBaseDir);

		const posts = await Promise.all(
			postSlugs.map(async (slug) => {
				const postDir = path.join(postsBaseDir, slug);
				const filePath = path.join(postDir, 'post.md');

				try {
					const mdContent = await fs.readFile(filePath, 'utf-8');
					const { data } = matter(mdContent);

					return {
						url: `/blog/${slug}`,
						lastmod: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
						priority: '0.8' // Higher priority for blog posts
					};
				} catch {
					return null;
				}
			})
		);

		blogPosts = posts.filter((post) => post !== null);
	} catch (e) {
		console.error('Error reading blog posts for sitemap:', e);
	}

	// 4. Combine static pages and blog posts
	const allPages = [
		...staticPages.map((slug) => ({
			url: slug || '/',
			lastmod: new Date().toISOString(),
			priority: slug === '' ? '1.0' : '0.6'
		})),
		...blogPosts
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
