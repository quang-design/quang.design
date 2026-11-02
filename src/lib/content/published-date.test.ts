import { describe, expect, it } from 'vitest';
import { getAllPosts } from './design';
import {
	comparePublishedDesc,
	publishedDateValue,
	publishedMillis,
	publishedYear
} from './published-date';

describe('publishedDateValue', () => {
	it('keeps a four-digit year unchanged', () => {
		expect(publishedDateValue('2018')).toBe('2018');
		expect(publishedDateValue('2020')).toBe('2020');
	});

	it('turns a calendar day into that UTC day', () => {
		expect(publishedDateValue('2019-08-19')).toBe('2019-08-19T00:00:00.000Z');
		expect(publishedDateValue('2024-09-12')).toBe(new Date('2024-09-12').toISOString());
	});

	it('returns an empty or garbage string as given', () => {
		expect(publishedDateValue('')).toBe('');
		expect(publishedDateValue('not-a-date')).toBe('not-a-date');
	});

	it('reads a list label as the year and leaves the stored day intact', () => {
		expect(publishedYear('2019-12-26')).toBe('2019');
		expect(publishedYear('2018')).toBe('2018');
		expect(publishedYear('')).toBe('');
		const faceMask = getAllPosts().find((post) => post.slug === 'face-mask');
		expect(faceMask?.date).toBe('2021-06-20');
		expect(publishedYear(faceMask?.date ?? '')).toBe('2021');
	});

	it('sorts a year as January 1 and a later calendar day ahead of it', () => {
		expect(publishedMillis('2020')).toBe(publishedMillis('2020-01-01'));
		expect(publishedMillis('2020-03-29')).toBeGreaterThan(publishedMillis('2020'));
	});

	it('orders newest first and breaks ties by slug', () => {
		const posts = [
			{ slug: 'powder-therapy', date: '2020-01-01' },
			{ slug: 'face-mask', date: '2021-06-20' },
			{ slug: 'dream-sweets', date: '2021-07-19' },
			{ slug: 'peanut-planner', date: '2021-09-14' },
			{ slug: 'suda', date: '2021-04-25' },
			{ slug: 'her-kind', date: '2022-01-01' },
			{ slug: 'dawg', date: '2020-03-29' },
			{ slug: 'namka', date: '2018' },
			{ slug: 'monsieur-luxe', date: '2018' }
		];
		expect([...posts].sort(comparePublishedDesc).map((post) => post.slug)).toEqual([
			'her-kind',
			'peanut-planner',
			'dream-sweets',
			'face-mask',
			'suda',
			'dawg',
			'powder-therapy',
			'monsieur-luxe',
			'namka'
		]);
	});

	it('lists the design catalog newest first', () => {
		expect(getAllPosts().map((post) => post.slug)).toEqual([
			'her-kind',
			'metanoia',
			'peanut-planner',
			'dream-sweets',
			'face-mask',
			'suda',
			'dawg',
			'powder-therapy',
			'wedding',
			'717',
			'simplex',
			'doppio',
			'fuck-go',
			'alluvia',
			'monsieur-luxe',
			'namka',
			'xuan-loc-farm'
		]);
	});
});
