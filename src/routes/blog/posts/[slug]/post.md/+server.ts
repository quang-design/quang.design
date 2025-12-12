import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPostMatter } from '$lib/content/blog';

// Must run at runtime (serverless) and not be prerendered
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

	// Create a clean markdown version for LLMs
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
