import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { designAgentMarkdown } from '$lib/content/design';
import { designHref } from '$lib/content/slug';

export const prerender = false;

export const GET: RequestHandler = async ({ params, url }) => {
	const slug = params.slug;
	const href = designHref(slug);
	if (!href) throw error(404, 'Post not found');

	const baseUrl = url.origin;
	let markdown: string;
	let data: Record<string, unknown>;
	try {
		({ markdown, data } = designAgentMarkdown(slug, baseUrl));
	} catch {
		throw error(404, 'Post not found');
	}
	const postUrl = `${baseUrl}${href}`;
	const postMdUrl = `${baseUrl}${href}/post.md`;

	const llmsTxt = `# ${String(data.title || slug)}

## About this content
This is a design project from quang.design.

**Title:** ${String(data.title || slug)}
**Description:** ${String(data.description || 'No description available')}
**Published:** ${String(data.date || 'Date not specified')}
**URL:** ${postUrl}

## Content
${markdown}

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
