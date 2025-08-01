import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const slug = params.slug;
	const postDir = path.resolve('src/routes/blog/posts', slug);

	let md: string;
	try {
		md = await fs.readFile(path.join(postDir, 'post.md'), 'utf-8');
	} catch {
		throw error(404, 'Post not found');
	}

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
