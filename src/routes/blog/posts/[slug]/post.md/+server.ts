import { error } from '@sveltejs/kit';
import matter from 'gray-matter';
import type { RequestHandler } from './$types';

// Must run at runtime (serverless) and not be prerendered
export const prerender = false;

export const GET: RequestHandler = async ({ params }) => {
	const slug = params.slug;

	// Bundle markdown at build-time for deployment safety
	const posts = import.meta.glob('/src/routes/blog/posts/*/post.md', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>;

	const match = Object.entries(posts).find(([key]) => key.includes(`/blog/posts/${slug}/post.md`));

	if (!match) throw error(404, 'Post not found');
	const md = match[1];

	const { content, data } = matter(md);

	// Create a clean markdown version for LLMs
	const cleanMarkdown = `# ${data.title || slug}

${data.description ? `> ${data.description}` : ''}

${data.date ? `*Published: ${data.date}*` : ''}

${content}`;

	return new Response(cleanMarkdown, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8'
		}
	});
};
