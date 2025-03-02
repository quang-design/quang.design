import { promises as fs } from 'fs';
import path from 'path';

// This function generates the entry points for prerendering
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
					const metadata = {};
					meta.split('\n').forEach((line) => {
						const [key, ...valueParts] = line.split(':');
						if (key && valueParts.length) {
							metadata[key.trim()] = valueParts.join(':').trim();
						}
					});

					return {
						slug,
						...metadata,
						// Add a default date if none exists
						date: metadata.date || new Date().toISOString().split('T')[0]
					};
				})
		);

		// Sort posts by date (newest first)
		return {
			posts: posts.sort((a, b) => new Date(b.date) - new Date(a.date))
		};
	} catch (error) {
		console.error('Error loading blog posts:', error);
		return { posts: [] };
	}
};
