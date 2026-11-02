import { error } from '@sveltejs/kit';
import { getPost, getPostMatter } from '$lib/content/design';
import { parseDesignFlags } from '$lib/content/design-flags';
import { designHref } from '$lib/content/slug';

export async function load({ params }) {
	if (!designHref(params.slug)) throw error(404, 'Post not found');
	const post = getPost(params.slug);
	const { data } = getPostMatter(params.slug);
	return { ...post, flags: parseDesignFlags(data as Record<string, unknown>) };
}
