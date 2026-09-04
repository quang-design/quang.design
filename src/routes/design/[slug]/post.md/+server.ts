import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPostMatter } from '$lib/content/design';

export const prerender = false;

export const GET: RequestHandler = async ({ params }) => {
	const slug = params.slug;

	let content: string;
	let data: Record<string, unknown>;
	try {
		({ content, data } = getPostMatter(slug));
	} catch {
		throw error(404, 'Post not found');
	}

	const cleanMarkdown = `# ${String(data.title || slug)}

${data.description ? `> ${data.description}` : ''}

${data.date ? `*Published: ${data.date}*` : ''}

${content}`;

	return new Response(cleanMarkdown, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8'
		}
	});
};
