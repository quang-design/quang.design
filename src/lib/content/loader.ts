import { error } from '@sveltejs/kit';
import matter from 'gray-matter';
import { comparePublishedDesc } from './published-date';
import { designHref } from './slug';

export interface PostMetadata {
	slug: string;
	title: string;
	description: string;
	thumbnail: string;
	date: string;
}

type Frontmatter = {
	title?: unknown;
	description?: unknown;
	thumbnail?: unknown;
	date?: unknown;
	published?: unknown;
	unlisted?: unknown;
};

function slugFromKey(key: string, section: string) {
	const regex = new RegExp(`/content/${section}/([^/]+)/post\\.md$`);
	const match = key.match(regex);
	return match ? match[1] : null;
}

function toAssetUrl(urlPrefix: string, slug: string, filename: string) {
	const normalized = filename.replace(/^\.\//, '');
	return `${urlPrefix}/${slug}/${normalized}`;
}

function normalizeThumbnail(urlPrefix: string, slug: string, thumbnail: unknown) {
	if (!thumbnail) return '';
	const value = String(thumbnail);
	if (value.startsWith(`${urlPrefix}/`)) return value;
	if (value.startsWith('./')) return toAssetUrl(urlPrefix, slug, value);
	return value;
}

function rewriteRelativeAssetLinks(md: string, urlPrefix: string, slug: string) {
	return md.replace(/\(\.\//g, `(${urlPrefix}/${slug}/`);
}

const imageFile = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;

export function absoluteImageLinks(
	markdown: string,
	urlPrefix: string,
	slug: string,
	origin: string
) {
	const host = origin.replace(/\/$/, '');
	const rewritten = rewriteRelativeAssetLinks(markdown, urlPrefix, slug);
	return rewritten.replace(
		/(!\[[^\]]*\]\()(\/[^)\s]+)(\s[^)]*)?\)/g,
		(full, open: string, dest: string, title?: string) => {
			if (!imageFile.test(dest.split(/[?#]/)[0])) return full;
			return `${open}${host}${dest}${title ?? ''})`;
		}
	);
}

/**
 * Higher-level factory: pass the static glob result once and get ready-to-use
 * getAllPosts / getPost / getPostMatter functions back. Each content file only
 * needs the glob import (which must be static for Vite) and this one-liner.
 */
export function createSection(section: string, urlPrefix: string, modules: Record<string, string>) {
	const parser = createContentParser(section, urlPrefix);
	return {
		getAllPosts: () => parser.getAllPosts(modules),
		getPost: (slug: string) => parser.getPost(modules, slug),
		getPostMatter: (slug: string) => parser.getPostMatter(modules, slug)
	};
}

function createContentParser(section: string, urlPrefix: string) {
	return {
		getAllPosts(modules: Record<string, string>): PostMetadata[] {
			const posts: Array<PostMetadata & { published: boolean; unlisted: boolean }> = Object.entries(
				modules
			)
				.map(([key, md]) => {
					const slug = slugFromKey(key, section);
					if (!slug) return null;
					if (section === 'design' && !designHref(slug)) return null;

					const { data } = matter(md);
					const frontmatter = data as Frontmatter;
					const published =
						frontmatter.published === undefined ? true : Boolean(frontmatter.published);
					const unlisted =
						frontmatter.unlisted === undefined ? false : Boolean(frontmatter.unlisted);

					return {
						slug,
						title:
							typeof frontmatter.title === 'string' ? frontmatter.title : slug.replace(/-/g, ' '),
						description: typeof frontmatter.description === 'string' ? frontmatter.description : '',
						thumbnail: normalizeThumbnail(urlPrefix, slug, frontmatter.thumbnail),
						date: typeof frontmatter.date === 'string' ? frontmatter.date : '',
						published,
						unlisted
					};
				})
				.filter((p): p is PostMetadata & { published: boolean; unlisted: boolean } => p !== null)
				.filter((p) => p.published && !p.unlisted);

			if (posts.every((post) => post.date)) {
				posts.sort(comparePublishedDesc);
			}

			return posts;
		},

		getPost(modules: Record<string, string>, slug: string) {
			const match = Object.entries(modules).find(([key]) =>
				key.endsWith(`/content/${section}/${slug}/post.md`)
			);
			if (!match) throw error(404, 'Post not found');

			const md = match[1];
			const { content, data } = matter(md);
			const frontmatter = data as Frontmatter;

			return {
				md: rewriteRelativeAssetLinks(content, urlPrefix, slug),
				meta: {
					title: typeof frontmatter.title === 'string' ? frontmatter.title : slug,
					description: typeof frontmatter.description === 'string' ? frontmatter.description : '',
					thumbnail: normalizeThumbnail(urlPrefix, slug, frontmatter.thumbnail),
					date: typeof frontmatter.date === 'string' ? frontmatter.date : ''
				}
			};
		},

		getPostMatter(modules: Record<string, string>, slug: string) {
			const match = Object.entries(modules).find(([key]) =>
				key.endsWith(`/content/${section}/${slug}/post.md`)
			);
			if (!match) throw error(404, 'Post not found');

			return matter(match[1]);
		}
	};
}
