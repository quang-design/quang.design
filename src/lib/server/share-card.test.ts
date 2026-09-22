import { describe, expect, it } from 'vitest';
import { shareCard } from './share-card';

const titles = [
	['/', 'Home'],
	['/design', 'Design'],
	['/engineer', 'Engineer'],
	['/blog', 'Blog'],
	['/design/simplex', 'SIMPLEX CAFFÈ'],
	['/blog/posts/dev-is-strange', 'dev is strange'],
	['/engineer/telescopic', 'AI Telescopic Text'],
	['/engineer/microscopic', 'AI Microscopic Text'],
	['/engineer/minesweeper', 'Minesweeper'],
	['/engineer/animation-vocabulary', 'Animation Vocabulary']
] as const;

describe('shareCard', () => {
	it('names each published route', () => {
		for (const [path, title] of titles) {
			expect(shareCard(path)?.title).toBe(title);
		}
		expect(shareCard('/')?.kicker).toBe('Welcome to');
		expect(shareCard('/design')?.kicker).toBe('Index');
		expect(shareCard('/engineer/minesweeper')?.kicker).toBe('Engineer');
	});

	it('uses the design headline split on a case study', () => {
		expect(shareCard('/design/simplex')).toEqual({
			kicker: 'Design',
			title: 'SIMPLEX CAFFÈ',
			line: "Crafting an Identity for Vietnam's Café Culture",
			path: '/design/simplex'
		});
	});

	it('names a blog post from its title', () => {
		expect(shareCard('/blog/posts/dev-is-strange')).toEqual({
			kicker: 'Blog',
			title: 'dev is strange',
			path: '/blog/posts/dev-is-strange'
		});
	});

	it('rejects a route the site does not publish', () => {
		expect(shareCard('/nope')).toBeNull();
		expect(shareCard('/design/not-a-project')).toBeNull();
		expect(shareCard('/blog/posts/missing')).toBeNull();
		expect(shareCard('/design/../blog')).toBeNull();
		expect(shareCard('https://quang.design/design')).toBeNull();
	});
});
