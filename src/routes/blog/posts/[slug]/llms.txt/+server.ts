import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPostMatter } from '$lib/content/blog';

// This endpoint must run at runtime (serverless) and not be prerendered
export const prerender = false;

export const GET: RequestHandler = async ({ params, url }) => {
	const slug = params.slug;

	let content: string;
	let data: Record<string, unknown>;
	try {
		({ content, data } = getPostMatter(slug));
	} catch {
		throw error(404, 'Post not found');
	}

	// Generate llms.txt content for this specific blog post
	const baseUrl = url.origin;
	const postUrl = `${baseUrl}/blog/posts/${slug}`;
	const postMdUrl = `${baseUrl}/blog/posts/${slug}/post.md`;

	const llmsTxt = `# ${String(data.title || slug)}

## About this content
This is a blog post from quang.design.

**Title:** ${String(data.title || slug)}
**Description:** ${String(data.description || 'No description available')}
**Published:** ${String(data.date || 'Date not specified')}
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
