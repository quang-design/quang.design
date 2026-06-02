export type EngineeringProject = {
	title: string;
	description: string;
	href: string;
	external?: boolean;
};

export const engineeringProjects: EngineeringProject[] = [
	{
		title: 'AI Telescopic Text',
		description:
			'AI-powered tool that progressively expands simple sentences into more detailed narratives.',
		href: '/engineer/telescopic'
	},
	{
		title: 'AI Microscopic Text',
		description: 'AI-powered tool that zips up long texts into short, concise words.',
		href: '/engineer/microscopic'
	},
	{
		title: 'Minesweeper',
		description: 'A classic minesweeper game built with SvelteKit and TailwindCSS.',
		href: '/engineer/minesweeper'
	},
	{
		title: 'Animation Vocabulary',
		description:
			'Interactive visual glossary of animation terms with anime.js — Entrances & Exits.',
		href: '/engineer/animation-vocabulary'
	},
	{
		title: 'User Agent Poetry Generator',
		description: 'Generates poetry from your browser user agent string.',
		href: 'https://user-info.quang.design/',
		external: true
	},
	{
		title: 'Bluesky Client (WIP)',
		description: 'A custom Bluesky social media client.',
		href: 'https://bluesky.quang.design/',
		external: true
	}
];
