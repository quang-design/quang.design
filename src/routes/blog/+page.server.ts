import { promises as fs } from 'fs';
import path from 'path';

// Define post metadata interface
interface PostMetadata {
	slug: string;
	title: string;
	description?: string | null;
	date: string;
	published?: boolean;
	thumbnail?: string;
	[key: string]: string | null | boolean | undefined; // For any other frontmatter fields
}

// This function generates the entry points for prerendering
export const prerender = true;

export const entries = async () => {
	try {
		// Get all markdown files from the posts directory
		const postsDir = path.join(process.cwd(), 'src/lib/posts');
		const files = await fs.readdir(postsDir);

		// Filter for markdown files and extract the slug (filename without extension)
		const slugs = files
			.filter((file) => file.endsWith('.md'))
			.map((file) => ({ posts: file.replace('.md', '') }));

		return slugs;
	} catch (error) {
		console.error('Error generating blog entries:', error);
		return [];
	}
};

// Load blog post metadata for the index page
export const load = async () => {
	try {
		const postsDir = path.join(process.cwd(), 'src/lib/posts');
		const files = await fs.readdir(postsDir);

		// Get metadata from each post
		const posts = await Promise.all(
			files
				.filter((file) => file.endsWith('.md'))
				.map(async (file) => {
					const slug = file.replace('.md', '');
					const filePath = path.join(postsDir, file);
					const content = await fs.readFile(filePath, 'utf-8');

					// Extract frontmatter (simple implementation)
					const metaMatch = content.match(/---\s*([\s\S]*?)\s*---/);
					const meta = metaMatch ? metaMatch[1] : '';

					// Parse the metadata (basic implementation)
					const metadata: Record<string, string> = {};
					meta.split('\n').forEach((line) => {
						const [key, ...valueParts] = line.split(':');
						if (key && valueParts.length) {
							metadata[key.trim()] = valueParts
								.join(':')
								.trim()
								.replace(/['"](.*)['"]/g, '$1');
						}
					});

					return {
						slug,
						title: metadata.title || slug,
						description: metadata.description || '',
						date: metadata.date || new Date().toISOString().split('T')[0],
						thumbnail: metadata.thumbnail || '',
						published:
							metadata.published === 'true' || metadata.published === 'false'
								? metadata.published === 'true'
								: true
					} as PostMetadata;
				})
		);

		// Filter published posts and sort by date (newest first)
		const publishedPosts = posts.filter((post) => post.published !== false);
		return {
			posts: publishedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		};
	} catch (error) {
		console.error('Error loading blog posts:', error);
		return { posts: [] };
	}
};
