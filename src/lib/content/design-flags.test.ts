import { readFileSync } from 'node:fs';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { creditLink, parseDesignFlags } from './design-flags';

function flagsFrom(slug: string) {
	const md = readFileSync(`src/content/design/${slug}/post.md`, 'utf8');
	return parseDesignFlags(matter(md).data as Record<string, unknown>);
}

describe('parseDesignFlags', () => {
	it('reads Powder Therapy as a split gallery', () => {
		expect(flagsFrom('powder-therapy')).toEqual({ layout: 'split', credit: undefined });
	});

	it('reads Dream Sweets as a flat gallery with an illustration credit', () => {
		expect(flagsFrom('dream-sweets')).toEqual({
			layout: 'flat',
			credit: {
				paragraph: 'Illustration by Luong Doo',
				label: 'Luong Doo',
				href: 'https://luongdoo.com'
			}
		});
	});

	it('leaves a stacked project without a layout', () => {
		expect(flagsFrom('doppio')).toEqual({ layout: undefined, credit: undefined });
	});

	it('rejects an unknown layout', () => {
		expect(() => parseDesignFlags({ layout: 'grid' })).toThrow('Unknown design layout');
	});

	it('rejects a credit that cannot name its link', () => {
		expect(() =>
			parseDesignFlags({
				credit: {
					paragraph: 'Illustration by Luong Doo',
					label: 'Someone',
					href: 'https://example.com'
				}
			})
		).toThrow('label must appear');
	});
});

describe('creditLink', () => {
	const credit = {
		paragraph: 'Illustration by Luong Doo',
		label: 'Luong Doo',
		href: 'https://luongdoo.com'
	};

	it('splits the credit sentence around the linked name', () => {
		expect(creditLink(credit.paragraph, credit)).toEqual({
			before: 'Illustration by ',
			label: 'Luong Doo',
			href: 'https://luongdoo.com',
			after: ''
		});
	});

	it('leaves other paragraphs as plain text', () => {
		expect(creditLink('Dream Sweets is a gummy bear.', credit)).toBeNull();
	});
});
