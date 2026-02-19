import { getAllPosts, type PostMetadata } from '$lib/content/design';

export type { PostMetadata };

export async function load() {
	const posts: PostMetadata[] = getAllPosts();
	return { posts };
}
