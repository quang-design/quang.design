import { error } from '@sveltejs/kit';
import { getPost } from '$lib/content/design';
import { designHref } from '$lib/content/slug';

export async function load({ params }) {
	if (!designHref(params.slug)) throw error(404, 'Post not found');
	return getPost(params.slug);
}
