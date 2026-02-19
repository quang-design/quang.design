import { error } from '@sveltejs/kit';
import matter from 'gray-matter';

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

export function createContentParser(section: string, urlPrefix: string) {
	return {
		getAllPosts(modules: Record<string, string>): PostMetadata[] {
			const posts: Array<PostMetadata & { published: boolean }> = Object.entries(modules)
				.map(([key, md]) => {
					const slug = slugFromKey(key, section);
					if (!slug) return null;

					const { data } = matter(md);
					const frontmatter = data as Frontmatter;
					const published =
						frontmatter.published === undefined ? true : Boolean(frontmatter.published);

					return {
						slug,
						title:
							typeof frontmatter.title === 'string' ? frontmatter.title : slug.replace(/-/g, ' '),
						description: typeof frontmatter.description === 'string' ? frontmatter.description : '',
						thumbnail: normalizeThumbnail(urlPrefix, slug, frontmatter.thumbnail),
						date: typeof frontmatter.date === 'string' ? frontmatter.date : '',
						published
					};
				})
				.filter((p): p is PostMetadata & { published: boolean } => p !== null)
				.filter((p) => p.published);

			if (posts.every((post) => post.date)) {
				posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
