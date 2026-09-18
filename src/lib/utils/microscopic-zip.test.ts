import { describe, expect, it } from 'vitest';
import {
	clipZipToGap,
	replaceSlice,
	shiftRanges,
	splitAround,
	toSegments,
	zipWordBudget,
	type ZipRange
} from './microscopic-zip';

describe('replaceSlice', () => {
	it('replaces the selected span with shorter text', () => {
		const source =
			'Yawning, and smearing my eyes with my fingers, I walked bleary eyed into the kitchen.';
		expect(replaceSlice(source, 0, 45, 'Yawning and rubbing my eyes')).toBe(
			'Yawning and rubbing my eyes, I walked bleary eyed into the kitchen.'
		);
	});
});

describe('shiftRanges', () => {
	it('drops overlapping marks and shifts later ones', () => {
		const ranges: ZipRange[] = [
			{ id: 'a', start: 0, end: 7, original: 'Yawning, and smearing my eyes with my fingers' },
			{ id: 'b', start: 20, end: 28, original: 'kitchen' }
		];

		expect(shiftRanges(ranges, 0, 10, 3)).toEqual([
			{ id: 'b', start: 13, end: 21, original: 'kitchen' }
		]);
	});
});

describe('zipWordBudget', () => {
	it('caps an 8-word clause at 5 words', () => {
		expect(zipWordBudget('Yawning, and smearing my eyes with my fingers')).toBe(5);
	});

	it('caps a long parenthetical clause at 8 words', () => {
		expect(
			zipWordBudget(
				'checking with my hands to make sure it was cold enough (The best tea comes from the coldest water)'
			)
		).toBe(8);
	});
});

describe('splitAround', () => {
	it('splits a passage into before, selection, and after', () => {
		expect(
			splitAround(
				'Yawning, and smearing my eyes with my fingers, I walked bleary eyed into the kitchen.',
				'Yawning, and smearing my eyes with my fingers'
			)
		).toEqual({
			left: '',
			selection: 'Yawning, and smearing my eyes with my fingers',
			right: ', I walked bleary eyed into the kitchen.'
		});
	});
});

describe('clipZipToGap', () => {
	it('keeps a replacement that already fits between neighbors', () => {
		const left = '';
		const zip = 'Yawning and rubbing my eyes';
		const right = ', I walked bleary eyed into the kitchen and filled the kettle';
		expect(clipZipToGap(left, zip, right)).toBe('Yawning and rubbing my eyes');
		expect(left + clipZipToGap(left, zip, right) + right).toBe(
			'Yawning and rubbing my eyes, I walked bleary eyed into the kitchen and filled the kettle'
		);
	});

	it('drops replacement text that already sits after the selection', () => {
		expect(
			clipZipToGap(
				'',
				'Yawning, I walked bleary eyed into the kitchen',
				', I walked bleary eyed into the kitchen and filled the kettle'
			)
		).toBe('Yawning');
	});

	it('drops a copied neighbor when punctuation sits between them', () => {
		expect(
			clipZipToGap(
				'from the tap, ',
				'I glanced outside',
				'. I glanced outside for a minute at the city mist.'
			)
		).toBe('');
	});

	it('drops a period that already sits after the selection', () => {
		const left =
			'Yawning, and smearing my eyes with my fingers, I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap, ';
		const zip = 'checking the water was cold enough.';
		const right = '. I glanced outside for a minute at the city mist.';
		expect(clipZipToGap(left, zip, right)).toBe('checking the water was cold enough');
		expect(left + clipZipToGap(left, zip, right) + right).toBe(
			'Yawning, and smearing my eyes with my fingers, I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap, checking the water was cold enough. I glanced outside for a minute at the city mist.'
		);
	});

	it('keeps a zip that does not overlap the surrounding text', () => {
		expect(
			clipZipToGap(
				'Yawning, and smearing my eyes with my fingers, I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap, ',
				'checking the water was cold enough',
				'. I glanced outside for a minute at the city mist.'
			)
		).toBe('checking the water was cold enough');
	});
});

describe('toSegments', () => {
	it('renders zipped spans as collapsed marks', () => {
		const text = 'Yawning and rubbing my eyes, I walked bleary eyed into the kitchen.';
		const segments = toSegments(text, [
			{
				id: 'zip-1',
				start: 0,
				end: 27,
				original: 'Yawning, and smearing my eyes with my fingers'
			}
		]);

		expect(segments).toEqual([
			{
				id: 'zip-1',
				text: 'Yawning and rubbing my eyes',
				zipped: true,
				original: 'Yawning, and smearing my eyes with my fingers',
				pending: undefined
			},
			{
				id: 'text-27',
				text: ', I walked bleary eyed into the kitchen.',
				zipped: false
			}
		]);
	});
});
