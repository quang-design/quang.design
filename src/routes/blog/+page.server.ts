import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { error } from '@sveltejs/kit';

export interface PostMetadata {
	slug: string;
	title: string;
	description: string;
	thumbnail: string;
	date?: string; // Optional, but good to include if available
}

export async function load() {
	const postsBaseDir = path.resolve('src/routes/blog/posts');
	let postSlugs: string[];

	try {
		postSlugs = await fs.readdir(postsBaseDir);
	} catch (e) {
		console.error('Error reading posts directory:', e);
		throw error(500, 'Could not list blog posts.');
	}

	const posts: (PostMetadata | null)[] = await Promise.all(
		postSlugs.map(async (slug) => {
			const postDir = path.join(postsBaseDir, slug);
			const filePath = path.join(postDir, 'post.md');
			let mdContent: string;

			try {
				mdContent = await fs.readFile(filePath, 'utf-8');
			} catch {
				// Skip this entry if post.md is not found or not readable
				console.warn(`Could not read post.md in ${postDir}, skipping.`);
				return null;
			}

			const { data } = matter(mdContent);
			const assetUrl = (filename: string) => `/blog/posts/${slug}/${filename}`;

			return {
				slug,
				title: data.title ?? slug.replace(/-/g, ' '), // Use slug as fallback title
				description: data.description ?? '',
				thumbnail: data.thumbnail ? assetUrl(data.thumbnail.replace(/^\.\//, '')) : '', // Ensure './' is removed
				date: data.date ?? ''
			};
		})
	);

	// Filter out any null entries (posts that couldn't be read)
	const validPosts = posts.filter((post) => post !== null) as PostMetadata[];

	// Optional: Sort posts by date if available, newest first
	if (validPosts.every((post) => post.date)) {
		validPosts.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
	}

	return {
		posts: validPosts
	};
}
