import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export async function load({ params }) {
	const slug = params.slug;
	const postDir = path.resolve('src/routes/blog/posts', slug);

	let md: string;
	try {
		md = await fs.readFile(path.join(postDir, 'post.md'), 'utf-8');
	} catch {
		throw error(404, 'Post not found');
	}

	const { content, data } = matter(md);

	const assetUrl = (filename: string) => `/blog/posts/${slug}/${filename}`;
	const processedContent = content.replace(/\(\.\//g, `(/blog/posts/${slug}/`);

	return {
		md: processedContent,
		meta: {
			title: data.title ?? slug,
			description: data.description ?? '',
			thumbnail: data.thumbnail ? assetUrl(data.thumbnail.replace('./', '')) : '',
			date: data.date ?? ''
		}
	};
}
