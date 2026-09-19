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

	it('keeps a trailing comma and space that belong to the selection', () => {
		const left = '';
		const zip = 'rubbing my eyes';
		const right = 'I walked bleary eyed into the kitchen';
		const selection = 'Yawning, and smearing my eyes with my fingers, ';
		expect(clipZipToGap(left, zip, right, selection)).toBe('rubbing my eyes, ');
		expect(left + clipZipToGap(left, zip, right, selection) + right).toBe(
			'rubbing my eyes, I walked bleary eyed into the kitchen'
		);
	});

	it('shortens the selection when the model copies the after clause', () => {
		const selection = 'Yawning, and smearing my eyes with my fingers, ';
		const right =
			'I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap';
		expect(clipZipToGap('', right, right, selection)).toBe('Smearing my eyes, ');
		expect(clipZipToGap('', right, right, selection) + right).toBe(
			'Smearing my eyes, I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap'
		);
	});

	it('does not duplicate a comma that already sits after the selection', () => {
		expect(
			clipZipToGap(
				'',
				'rubbing my eyes',
				', I walked bleary eyed into the kitchen',
				'Yawning, and smearing my eyes with my fingers'
			)
		).toBe('rubbing my eyes');
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

	it('keeps the selection head so the sentence still has its object', () => {
		const left = 'I walked bleary eyed into the kitchen and filled the ';
		const selection =
			'kettle with fresh water from the tap, checking with my hands to make sure it was cold enough (The best tea comes from the coldest water)';
		const zip = 'checking it was cold enough';
		const right = '. I glanced outside for a minute at the city mist.';
		expect(clipZipToGap(left, zip, right, selection)).toBe(
			'kettle with fresh water from the tap checking'
		);
		expect(left + clipZipToGap(left, zip, right, selection) + right).toBe(
			'I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap checking. I glanced outside for a minute at the city mist.'
		);
	});

	it('does not add words to a short clause', () => {
		const left = 'Thankfully I found some fusty digestives. ';
		const selection = 'For some reason,';
		const zip = "For some reason, I couldn't find the,";
		const right = "biscuits are always nicer when they've gone a bit dry and stale.";
		expect(clipZipToGap(left, zip, right, selection)).toBe('For some reason, ');
		expect(left + clipZipToGap(left, zip, right, selection) + right).toBe(
			"Thankfully I found some fusty digestives. For some reason, biscuits are always nicer when they've gone a bit dry and stale."
		);
	});

	it('splits glued words and puts a space after a sentence period', () => {
		const left = 'Thankfully I found some fusty digestives. ';
		const selection =
			"I took the milk out of the fridge and poured some into a cup that I'd left out from having used earlier. ";
		const zip = 'outof from the fridge and poured some into a cup.';
		const right = 'The kettle began grumbling fiercely';
		expect(clipZipToGap(left, zip, right, selection)).toBe('I took the milk out of the fridge. ');
		expect(left + clipZipToGap(left, zip, right, selection) + right).toBe(
			'Thankfully I found some fusty digestives. I took the milk out of the fridge. The kettle began grumbling fiercely'
		);
	});

	it('does not glue neighboring words when the selection ate the spaces', () => {
		const left = 'I walked bleary';
		const selection = ' eyed into the kitchen and filled the kettle with fresh water ';
		const zip = 'checking the water was cold enough';
		const right = 'from the tap, checking with my hands';
		const out = clipZipToGap(left, zip, right, selection);
		expect(left + out + right).toBe(
			'I walked bleary eyed into the kitchen and filled from the tap, checking with my hands'
		);
		expect(left + out + right).not.toContain('blearyfrom');
		expect(left + out + right).not.toContain('blearyeyed');
		expect(left + out + right).not.toContain('filledfrom');
	});

	it('compresses a parenthetical instead of deleting it', () => {
		const left = 'it was cold enough ';
		const selection = '(The best tea comes from the coldest water)';
		const zip = 'checking the water was cold enough';
		const right = '. I glanced outside for a minute';
		expect(clipZipToGap(left, zip, right, selection)).toBe('(The best tea comes)');
		expect(left + clipZipToGap(left, zip, right, selection) + right).toBe(
			'it was cold enough (The best tea comes). I glanced outside for a minute'
		);
	});

	it('keeps a shorter paraphrase instead of echoing the opener', () => {
		const selection = 'Yawning, and smearing my eyes with my fingers, ';
		const zip = 'rubbing my eyes, walking into the kitchen';
		const right = 'I walked bleary eyed into the kitchen';
		expect(clipZipToGap('', zip, right, selection)).toBe('rubbing my eyes, ');
		expect(clipZipToGap('', zip, right, selection) + right).toBe(
			'rubbing my eyes, I walked bleary eyed into the kitchen'
		);
	});

	it('shortens a prefix copy of the opener instead of echoing it', () => {
		const selection = 'Yawning, and smearing my eyes with my fingers, ';
		const zip = 'Yawning and smearing my eyes';
		const right = 'I walked bleary eyed into the kitchen';
		expect(clipZipToGap('', zip, right, selection)).toBe('Smearing my eyes, ');
		expect(clipZipToGap('', zip, right, selection) + right).toBe(
			'Smearing my eyes, I walked bleary eyed into the kitchen'
		);
	});

	it('does not copy AFTER when BEFORE is empty', () => {
		const selection = 'Yawning, and smearing my eyes with my fingers, ';
		const zip = 'I walked into the kitchen';
		const right = 'I walked bleary eyed into the kitchen';
		expect(clipZipToGap('', zip, right, selection)).toBe('Smearing my eyes, ');
		expect(clipZipToGap('', zip, right, selection) + right).toBe(
			'Smearing my eyes, I walked bleary eyed into the kitchen'
		);
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
