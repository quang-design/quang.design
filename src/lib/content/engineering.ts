import { createSection, type PostMetadata } from './loader';

export type { PostMetadata };

const modules = import.meta.glob('/src/content/engineering/*/post.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export const { getAllPosts, getPost, getPostMatter } = createSection(
	'engineering',
	'/engineering/posts',
	modules
);
