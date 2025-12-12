import { error } from '@sveltejs/kit';
import matter from 'gray-matter';

export interface PostMetadata {
	slug: string;
	title: string;
	description: string;
	thumbnail: string;
	date: string;
}

type Frontmatter = {
	title?: unknown;
	description?: unknown;
	thumbnail?: unknown;
	date?: unknown;
	published?: unknown;
};

function slugFromKey(key: string) {
	const match = key.match(/\/content\/blog\/([^/]+)\/post\.md$/);
	return match ? match[1] : null;
}

function toAssetUrl(slug: string, filename: string) {
	const normalized = filename.replace(/^\.\//, '');
	return `/blog/posts/${slug}/${normalized}`;
}

function normalizeThumbnail(slug: string, thumbnail: unknown) {
	if (!thumbnail) return '';
	const value = String(thumbnail);
	if (value.startsWith('/blog/posts/')) return value;
	if (value.startsWith('./')) return toAssetUrl(slug, value);
	return value;
}

function rewriteRelativeAssetLinks(md: string, slug: string) {
	return md.replace(/\(\.\//g, `(/blog/posts/${slug}/`);
}

function getAllPostModules() {
	return import.meta.glob('/src/content/blog/*/post.md', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>;
}

export function getAllPosts() {
	const modules = getAllPostModules();

	const posts: Array<PostMetadata & { published: boolean }> = Object.entries(modules)
		.map(([key, md]) => {
			const slug = slugFromKey(key);
			if (!slug) return null;

			const { data } = matter(md);
			const frontmatter = data as Frontmatter;
			const published = frontmatter.published === undefined ? true : Boolean(frontmatter.published);

			return {
				slug,
				title: typeof frontmatter.title === 'string' ? frontmatter.title : slug.replace(/-/g, ' '),
				description: typeof frontmatter.description === 'string' ? frontmatter.description : '',
				thumbnail: normalizeThumbnail(slug, frontmatter.thumbnail),
				date: typeof frontmatter.date === 'string' ? frontmatter.date : '',
				published
			};
		})
		.filter((p): p is PostMetadata & { published: boolean } => p !== null)
		.filter((p) => p.published);

	if (posts.every((post) => post.date)) {
		posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}

	return posts;
}

export function getPost(slug: string) {
	const modules = getAllPostModules();
	const match = Object.entries(modules).find(([key]) =>
		key.endsWith(`/content/blog/${slug}/post.md`)
	);
	if (!match) throw error(404, 'Post not found');

	const md = match[1];
	const { content, data } = matter(md);
	const frontmatter = data as Frontmatter;

	return {
		md: rewriteRelativeAssetLinks(content, slug),
		meta: {
			title: typeof frontmatter.title === 'string' ? frontmatter.title : slug,
			description: typeof frontmatter.description === 'string' ? frontmatter.description : '',
			thumbnail: normalizeThumbnail(slug, frontmatter.thumbnail),
			date: typeof frontmatter.date === 'string' ? frontmatter.date : ''
		}
	};
}

export function getPostMatter(slug: string) {
	const modules = getAllPostModules();
	const match = Object.entries(modules).find(([key]) =>
		key.endsWith(`/content/blog/${slug}/post.md`)
	);
	if (!match) throw error(404, 'Post not found');

	const md = match[1];
	return matter(md);
}
