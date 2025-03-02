import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../lib/posts/${params.posts}.md`);

		// Only return serializable data
		return {
			meta: { ...post.metadata, slug: params.posts },
			// The content will be rendered by mdsvex through the layout
			PostContent: post.default
		};
	} catch (err) {
		console.error('Failed to load post:', err);
		error(404, `Post '${params.posts}' not found`);
	}
};
