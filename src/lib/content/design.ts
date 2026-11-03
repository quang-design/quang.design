import { absoluteImageLinks, createSection, type PostMetadata } from './loader';

export type { PostMetadata };

const DESIGN_POSTS = '/design/posts';

const modules = import.meta.glob('/src/content/design/*/post.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export const { getAllPosts, getPost, getPostMatter } = createSection(
	'design',
	DESIGN_POSTS,
	modules
);

export function designAgentMarkdown(slug: string, origin: string) {
	const { content, data } = getPostMatter(slug);
	return {
		data,
		markdown: absoluteImageLinks(content, DESIGN_POSTS, slug, origin)
	};
}
