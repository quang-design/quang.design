import { getAllPosts as getBlogPosts } from '$lib/content/blog';
import { getAllPosts as getDesignPosts } from '$lib/content/design';
import { engineerProjects } from '$lib/content/engineer';
import { designHeadline } from '$lib/content/headline';
import { pages } from '$lib/seo/copy';
import homeContent from '../../routes/content.md?raw';

export type ShareCard = {
	path: string;
	heading: string;
	body: string;
};

function homeBody(md: string) {
	const blocks = md.split(/\n\s*\n/);
	const para = blocks.find((block) => {
		const line = block.trim();
		return line.length > 0 && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('**');
	});
	return (para ?? '').replace(/👋/g, '').replace(/\s+/g, ' ').trim();
}

const indexes: Record<string, { heading: string; body: string }> = {
	'/': { heading: 'Xin Chào!', body: homeBody(homeContent) },
	'/design': { heading: 'Design', body: pages.design.description },
	'/engineer': { heading: 'Engineer', body: pages.engineer.description },
	'/blog': { heading: 'Blog', body: pages.blog.description }
};

const toolBody: Record<string, string> = {
	'/engineer/minesweeper': pages.minesweeper.description,
	'/engineer/telescopic': pages.telescopic.description,
	'/engineer/microscopic': pages.microscopic.description,
	'/engineer/animation-vocabulary': pages.animation.description
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
	if (index) return { path, ...index };

	const project = engineerProjects.find((item) => item.href === path && !item.external);
	if (project) return { path, heading: project.title, body: toolBody[path] ?? project.description };

	if (path.startsWith('/design/')) {
		const slug = path.slice('/design/'.length);
		if (!slug || slug.includes('/')) return null;
		const post = getDesignPosts().find((item) => item.slug === slug);
		if (!post) return null;
		return { path, heading: designHeadline(post.title, slug).brand, body: post.description };
	}

	if (path.startsWith('/blog/posts/')) {
		const slug = path.slice('/blog/posts/'.length);
		if (!slug || slug.includes('/')) return null;
		const post = getBlogPosts().find((item) => item.slug === slug);
		if (!post) return null;
		return { path, heading: post.title, body: post.description };
	}

	return null;
}
