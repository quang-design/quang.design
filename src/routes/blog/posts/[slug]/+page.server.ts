import { getPost } from '$lib/content/blog';

export async function load({ params }) {
	return getPost(params.slug);
}
