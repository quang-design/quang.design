import { getPost } from '$lib/content/design';

export async function load({ params }) {
	return getPost(params.slug);
}
