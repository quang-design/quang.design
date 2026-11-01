import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { layoutGallery, splitDesignContent } from './design-content';

const dreamSweets = readFileSync('src/content/design/dream-sweets/post.md', 'utf8');

describe('layoutGallery', () => {
	it('keeps a lone section in one column and pairs the next two', () => {
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
			{
				kind: 'text',
				cells: [
					{ heading: 'Audience', body: 'Ages.', side: 0 },
					{ heading: 'Applications', body: 'Feed.', side: 1 }
				]
			}
		]);
	});

	it('places Dream Sweets audience beside applications', () => {
		const { galleryMd } = splitDesignContent(dreamSweets);
		const rows = layoutGallery(galleryMd);
		const band = rows.find(
			(row) => row.kind === 'text' && row.cells.some((cell) => cell.heading === 'Audience')
		);

		expect(band).toEqual({
			kind: 'text',
			cells: [
				{
					heading: 'Audience',
					body: 'Regular gummy bears are mostly for kids. Dream Sweets is for ages 16 to 30, with a grown-up design. The packs use rounded type and periwinkle. The candy is sugar-free, at 60 calories per bag.',
					side: 0
				},
				{
					heading: 'Applications',
					body: 'The Instagram profile is dream.sweets. The avatar is the eye. The posts show the box, the bag, and the wordmark. The bio reads Zero Sugar. Low Calories. A nice semblance of food and aesthetic.',
					side: 1
				}
			]
		});
		expect(galleryMd).not.toContain('Have a nice day');
		expect(galleryMd).not.toContain('DREAM SWEETS');
	});
});
