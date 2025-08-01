import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
	const slug = params.slug;
	const postDir = path.resolve('src/routes/blog/posts', slug);

	let md: string;
	try {
		md = await fs.readFile(path.join(postDir, 'post.md'), 'utf-8');
	} catch {
		throw error(404, 'Post not found');
	}

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
