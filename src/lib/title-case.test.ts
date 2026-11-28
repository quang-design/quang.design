import { describe, expect, it } from 'vitest';
import { titleCase, titleCaseHeadings } from './title-case';

const samples = [
	['a tale of two cities', 'A Tale of Two Cities'],
	['dev is strange', 'Dev Is Strange'],
	['to', 'To'],
	['Welcome to AI Telescopic Text', 'Welcome to AI Telescopic Text'],
	[
		'Why SvelteKit security headers failed on Vercel (and the 2-file fix that works)',
		'Why SvelteKit Security Headers Failed on Vercel (and the 2-File Fix That Works)'
	],
	['TL;DR (the working solution)', 'TL;DR (the Working Solution)'],
	['quang.design', 'quang.design'],
	['hooks.server.ts', 'hooks.server.ts'],
	['Fuck+Go', 'Fuck+Go'],
	['Simplex Caffè', 'Simplex Caffè'],
	['iPhone and the CSS of quang.design', 'iPhone and the CSS of quang.design'],
	['Her Kind - The Making of a Name', 'Her Kind - The Making of a Name'],
	[
		'Metanoia© - Design a Plus-Size Clothing Brand Identity that Supports Good Change',
		'Metanoia© - Design a Plus-Size Clothing Brand Identity That Supports Good Change'
	]
] as const;

describe('titleCase', () => {
	it('formats headings and leaves protected words alone', () => {
		for (const [input, expected] of samples) {
			expect(titleCase(input)).toBe(expected);
		}
	});

	it('is idempotent', () => {
		for (const [input] of samples) {
			expect(titleCase(titleCase(input))).toBe(titleCase(input));
		}
	});
});

describe('titleCaseHeadings', () => {
	it('changes a heading and leaves a paragraph alone', () => {
		const heading = {
			type: 'heading',
			children: [
				{ type: 'text', value: 'dev is ' },
				{ type: 'text', value: 'strange' }
			]
		};
		const paragraph = {
			type: 'paragraph',
			children: [{ type: 'text', value: 'dev is strange' }]
		};
		titleCaseHeadings()({ type: 'root', children: [heading, paragraph] });
		expect(heading.children).toEqual([{ type: 'text', value: 'Dev Is Strange' }]);
		expect(paragraph.children).toEqual([{ type: 'text', value: 'dev is strange' }]);
	});
});
