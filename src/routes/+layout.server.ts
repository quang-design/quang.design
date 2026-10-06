import { getAllPosts as getDesignPosts } from '$lib/content/design';
import { getAllPosts as getBlogPosts } from '$lib/content/blog';
import { engineerProjects } from '$lib/content/engineer';
import { shareOrigin } from '$lib/server/share-origin';

export function load() {
	return {
		shareOrigin: shareOrigin(),
		nav: {
			design: getDesignPosts(),
			blog: getBlogPosts(),
			engineer: engineerProjects
		}
	};
}
