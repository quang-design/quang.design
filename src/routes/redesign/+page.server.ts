import { getAllPosts as getDesignPosts } from '$lib/content/design';
import { getAllPosts as getBlogPosts } from '$lib/content/blog';
import { engineerProjects } from '$lib/content/engineer';

export function load() {
	return {
		design: getDesignPosts(),
		blog: getBlogPosts(),
		engineer: engineerProjects
	};
}
