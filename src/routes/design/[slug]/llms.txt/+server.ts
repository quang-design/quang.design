import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPostMatter } from '$lib/content/design';

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

	const baseUrl = url.origin;
	const postUrl = `${baseUrl}/design/${slug}`;
	const postMdUrl = `${baseUrl}/design/${slug}/post.md`;

	const llmsTxt = `# ${String(data.title || slug)}

## About this content
This is a design project from quang.design.

**Title:** ${String(data.title || slug)}
**Description:** ${String(data.description || 'No description available')}
**Published:** ${String(data.date || 'Date not specified')}
**URL:** ${postUrl}

## Content
${content}

## Available formats
- Web page: ${postUrl}
- Raw markdown: ${postMdUrl}
`;

	return new Response(llmsTxt, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
};
