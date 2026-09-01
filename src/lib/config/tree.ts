import { designHeadline } from '$lib/content/headline';
import type { EngineerProject } from '$lib/content/engineer';
import type { PostMetadata } from '$lib/content/loader';
import type { Preview } from '$lib/preview.svelte';

export type TreeRow = {
	code: string;
	label: string;
	href: string;
	count?: number;
	nested?: boolean;
	external?: boolean;
	preview?: Preview;
};

export type TreeGroup = { label: string; rows: TreeRow[] };

export type NavData = {
	design: PostMetadata[];
	blog: PostMetadata[];
	engineer: EngineerProject[];
};

export function buildIndexTree(nav: NavData, pathname: string) {
	const designRows: TreeRow[] = nav.design.map((post, i) => {
		const { brand, line } = designHeadline(post.title, post.slug);
		return {
			code: `D${i + 1}`,
			label: brand,
			href: `/design/${post.slug}`,
			nested: true,
			preview: {
				eyebrow: 'Design',
				title: brand,
				subtitle: line,
				description: post.description,
				date: post.date,
				thumbnail: post.thumbnail,
				href: `/design/${post.slug}`
			}
		};
	});

	const blogRows: TreeRow[] = nav.blog.map((post, i) => ({
		code: `B${i + 1}`,
		label: post.title,
		href: `/blog/posts/${post.slug}`,
		nested: true,
		preview: {
			eyebrow: 'Blog',
			title: post.title,
			subtitle: post.date,
			description: post.description,
			date: post.date,
			thumbnail: post.thumbnail,
			href: `/blog/posts/${post.slug}`
		}
	}));

	const groups: TreeGroup[] = [
		{
			label: 'Index',
			rows: [
				{ code: 'H', label: 'Home', href: '/' },
				{
					code: 'D',
					label: 'Design',
					href: '/design',
					count: nav.design.length
				},
				...designRows,
				{
					code: 'E',
					label: 'Engineer',
					href: '/engineer',
					count: nav.engineer.length
				},
				{
					code: 'B',
					label: 'Blog',
					href: '/blog',
					count: nav.blog.length
				},
				...blogRows
			]
		},
		{
			label: 'Reference',
			rows: [{ code: 'S', label: 'Styles', href: '/styles' }]
		}
	];

	const rows = groups.flatMap((group) => group.rows);
	const matches = rows.filter(
		(row) => pathname === row.href || (row.href !== '/' && pathname.startsWith(`${row.href}/`))
	);
	matches.sort((a, b) => b.href.length - a.href.length);
	const active = matches[0]?.code ?? (pathname === '/' ? 'H' : undefined);

	return { groups, active };
}

export function engineerCode(href: string, index: number) {
	const codes: Record<string, string> = {
		'/engineer/telescopic': 'E1',
		'/engineer/microscopic': 'E2',
		'/engineer/animation-vocabulary': 'E3',
		'/engineer/minesweeper': 'E4'
	};
	return codes[href] ?? `E${index + 1}`;
}
