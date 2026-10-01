import { describe, expect, it } from 'vitest';
import { shareCard } from './share-card';

const titles = [
	['/', 'Xin Chào!'],
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
		for (const [path, heading] of titles) {
			expect(shareCard(path)?.heading).toBe(heading);
			expect(shareCard(path)?.body.length).toBeGreaterThan(40);
		}
	});

	it('uses the design brand and the post description', () => {
		expect(shareCard('/design/simplex')).toMatchObject({
			heading: 'SIMPLEX CAFFÈ',
			path: '/design/simplex'
		});
		expect(shareCard('/design/simplex')?.body).toContain('Simplex');
	});

	it('names a blog post from its title', () => {
		expect(shareCard('/blog/posts/dev-is-strange')).toMatchObject({
			heading: 'dev is strange',
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
