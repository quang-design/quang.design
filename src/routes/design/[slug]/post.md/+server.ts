import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { designAgentMarkdown } from '$lib/content/design';

export const prerender = false;

export const GET: RequestHandler = async ({ params, url }) => {
	const slug = params.slug;

	let markdown: string;
	let data: Record<string, unknown>;
	try {
		({ markdown, data } = designAgentMarkdown(slug, url.origin));
	} catch {
		throw error(404, 'Post not found');
	}

	const cleanMarkdown = `# ${String(data.title || slug)}

${data.description ? `> ${data.description}` : ''}

${data.date ? `*Published: ${data.date}*` : ''}

${markdown}`;

	return new Response(cleanMarkdown, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8'
		}
	});
};
