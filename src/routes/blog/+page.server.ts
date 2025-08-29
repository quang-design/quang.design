import matter from 'gray-matter';

export interface PostMetadata {
	slug: string;
	title: string;
	description: string;
	thumbnail: string;
	date: string; // Required to match mapped object shape
}

export async function load() {
	// Bundle all post markdown files at build-time (deployment-safe and avoids [slug] dir)
	const modules = import.meta.glob('/src/routes/blog/posts/*/post.md', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>;

	const posts: PostMetadata[] = Object.entries(modules)
		.map(([key, md]) => {
			// Extract slug from file path
			const match = key.match(/\/blog\/posts\/([^/]+)\/post\.md$/);
			if (!match) return null;
			const slug = match[1];
			const { data } = matter(md);
			const assetUrl = (filename: string) => `/blog/posts/${slug}/${filename}`;
			return {
				slug,
				title: data.title ?? slug.replace(/-/g, ' '),
				description: data.description ?? '',
				thumbnail: data.thumbnail
					? data.thumbnail.startsWith('/blog/posts/')
						? data.thumbnail
						: assetUrl(String(data.thumbnail).replace(/^\.\//, ''))
					: '',
				date: data.date ?? ''
			};
		})
		.filter((p): p is PostMetadata => p !== null);

	// Optional: Sort posts by date if available, newest first
	if (posts.every((post) => post.date)) {
		posts.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
	}

	return { posts };
}
