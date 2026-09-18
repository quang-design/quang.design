import { describe, expect, it } from 'vitest';
import { replaceSlice, shiftRanges, toSegments, type ZipRange } from './microscopic-zip';

describe('replaceSlice', () => {
	it('replaces the selected span with shorter text', () => {
		const source =
			'Yawning, and smearing my eyes with my fingers, I walked bleary eyed into the kitchen.';
		expect(replaceSlice(source, 0, 46, 'Yawning')).toBe(
			'Yawning I walked bleary eyed into the kitchen.'
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

describe('toSegments', () => {
	it('renders zipped spans as collapsed marks', () => {
		const text = 'Yawning I walked bleary eyed into the kitchen.';
		const segments = toSegments(text, [
			{
				id: 'zip-1',
				start: 0,
				end: 7,
				original: 'Yawning, and smearing my eyes with my fingers'
			}
		]);

		expect(segments).toEqual([
			{
				id: 'zip-1',
				text: 'Yawning',
				zipped: true,
				original: 'Yawning, and smearing my eyes with my fingers',
				pending: undefined
			},
			{
				id: 'text-7',
				text: ' I walked bleary eyed into the kitchen.',
				zipped: false
			}
		]);
	});
});
