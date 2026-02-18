import { createContentParser, type PostMetadata } from './loader';

export type { PostMetadata };

const parser = createContentParser('engineering', '/engineering/posts');

function getAllPostModules() {
	return import.meta.glob('/src/content/engineering/*/post.md', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>;
}

export function getAllPosts() {
	return parser.getAllPosts(getAllPostModules());
}

export function getPost(slug: string) {
	return parser.getPost(getAllPostModules(), slug);
}

export function getPostMatter(slug: string) {
	return parser.getPostMatter(getAllPostModules(), slug);
}
