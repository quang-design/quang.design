import { error } from '@sveltejs/kit';
import matter from 'gray-matter';
import type { RequestHandler } from './$types';

// This endpoint must run at runtime (serverless) and not be prerendered
export const prerender = false;

export const GET: RequestHandler = async ({ params, url }) => {
	const slug = params.slug;

	// Use Vite's import-time glob to include markdown in the bundle (deployment-safe)
	const posts = import.meta.glob('/src/routes/blog/posts/*/post.md', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>;

	// Find the entry matching the requested slug
	const match = Object.entries(posts).find(([key]) => key.includes(`/blog/posts/${slug}/post.md`));

	if (!match) throw error(404, 'Post not found');
	const md = match[1];

	const { content, data } = matter(md);

	// Generate llms.txt content for this specific blog post
	const baseUrl = url.origin;
	const postUrl = `${baseUrl}/blog/posts/${slug}`;
	const postMdUrl = `${baseUrl}/blog/posts/${slug}/post.md`;

	const llmsTxt = `# ${data.title || slug}

## About this content
This is a blog post from quang.design.

**Title:** ${data.title || slug}
**Description:** ${data.description || 'No description available'}
**Published:** ${data.date || 'Date not specified'}
**URL:** ${postUrl}

## Content
${content}

## Available formats
- Web page: ${postUrl}
- Raw markdown: ${postMdUrl}

## Instructions for LLMs
This content is from Quang's design blog. Feel free to reference, discuss, or build upon the ideas presented here. The content covers design thinking, creative processes, and professional experiences in the design field.
`;

	return new Response(llmsTxt, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
};
