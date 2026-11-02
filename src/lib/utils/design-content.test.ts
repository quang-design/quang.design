import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { layoutGallery, splitDesignContent } from './design-content';

const dreamSweets = readFileSync('src/content/design/dream-sweets/post.md', 'utf8');

describe('layoutGallery', () => {
	it('stacks each text section on its own row, alternating sides', () => {
		const md = [
			'**Logo**',
			'',
			'Mark.',
			'',
			'![logo](./a.avif)',
			'',
			'**Packaging**',
			'',
			'Pack.',
			'',
			'![pack](./b.avif)',
			'',
			'**Audience**',
			'',
			'Ages.',
			'',
			'**Applications**',
			'',
			'Feed.'
		].join('\n');

		expect(layoutGallery(md)).toEqual([
			{ kind: 'text', cells: [{ heading: 'Logo', body: 'Mark.', side: 0 }] },
			{ kind: 'media', md: '![logo](./a.avif)' },
			{ kind: 'text', cells: [{ heading: 'Packaging', body: 'Pack.', side: 1 }] },
			{ kind: 'media', md: '![pack](./b.avif)' },
			{ kind: 'text', cells: [{ heading: 'Audience', body: 'Ages.', side: 0 }] },
			{ kind: 'text', cells: [{ heading: 'Applications', body: 'Feed.', side: 1 }] }
		]);
	});

	it('places Dream Sweets audience and applications on separate rows', () => {
		const { galleryMd } = splitDesignContent(dreamSweets);
		const rows = layoutGallery(galleryMd);
		const text = rows.filter((row) => row.kind === 'text');

		expect(text.map((row) => row.cells.map((cell) => `${cell.heading}:${cell.side}`))).toEqual([
			['Logo:0'],
			['Packaging:1'],
			['Audience:0'],
			['Applications:1']
		]);
		expect(text.every((row) => row.cells.length === 1)).toBe(true);
		const audience = text.find((row) => row.cells[0]?.heading === 'Audience');
		const applications = text.find((row) => row.cells[0]?.heading === 'Applications');
		expect(audience?.cells[0]?.body).toBe(
			"Dream Sweets is for ages 16 to 30. It is for people who don't want to give up their sweet tooth. Traditional gummy bears are sugar-filled. This one is the healthier, zero sugar, low calorie alternative."
		);
		expect(applications?.cells[0]?.body).toBe(
			'The Instagram profile is dream.sweets. The avatar is the eye. The posts show the box, the bag, and the wordmark. The bio reads Zero Sugar. Low Calories. A nice semblance of food and aesthetic.'
		);
		expect(galleryMd).not.toContain('Have a nice day');
		expect(galleryMd).not.toContain('DREAM SWEETS');
	});

	it('credits Luong Doo only in the intro', () => {
		const { introMd, galleryMd } = splitDesignContent(dreamSweets);
		expect(introMd).toContain('Illustration by Luong Doo');
		expect(introMd).not.toContain('health, wellness, and joy');
		expect(galleryMd).not.toContain('Luong Doo');
	});
});
