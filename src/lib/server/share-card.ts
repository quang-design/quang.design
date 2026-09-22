import { getAllPosts as getBlogPosts } from '$lib/content/blog';
import { getAllPosts as getDesignPosts } from '$lib/content/design';
import { engineerProjects } from '$lib/content/engineer';
import { designHeadline } from '$lib/content/headline';

export type ShareCard = {
	kicker: string;
	title: string;
	path: string;
	line?: string;
};

const indexes: Record<string, { kicker: string; title: string }> = {
	'/': { kicker: 'Welcome to', title: 'Home' },
	'/design': { kicker: 'Index', title: 'Design' },
	'/engineer': { kicker: 'Index', title: 'Engineer' },
	'/blog': { kicker: 'Index', title: 'Blog' }
};

export function normalizeSharePath(input: string) {
	const bare = input.split('?')[0]?.split('#')[0] ?? '';
	if (!bare.startsWith('/')) return null;
	const parts = bare.split('/').filter(Boolean);
	if (parts.some((part) => part === '.' || part === '..')) return null;
	let decoded: string[];
	try {
		decoded = parts.map((part) => decodeURIComponent(part));
	} catch {
		return null;
	}
	if (decoded.some((part) => part.includes('/') || part === '.' || part === '..')) return null;
	return decoded.length ? `/${decoded.join('/')}` : '/';
}

export function shareCard(pathname: string): ShareCard | null {
	const path = normalizeSharePath(pathname);
	if (!path) return null;

	const index = indexes[path];
	if (index) return { ...index, path };

	const project = engineerProjects.find((item) => item.href === path && !item.external);
	if (project) return { kicker: 'Engineer', title: project.title, path };

	if (path.startsWith('/design/')) {
		const slug = path.slice('/design/'.length);
		if (!slug || slug.includes('/')) return null;
		const post = getDesignPosts().find((item) => item.slug === slug);
		if (!post) return null;
		const headline = designHeadline(post.title, slug);
		const line = headline.line === headline.brand ? undefined : headline.line;
		return { kicker: 'Design', title: headline.brand, path, line };
	}

	if (path.startsWith('/blog/posts/')) {
		const slug = path.slice('/blog/posts/'.length);
		if (!slug || slug.includes('/')) return null;
		const post = getBlogPosts().find((item) => item.slug === slug);
		if (!post) return null;
		return { kicker: 'Blog', title: post.title, path };
	}

	return null;
}
