import { describe, expect, it } from 'vitest';
import { applyExpansion } from './telescopic-expand';

describe('applyExpansion', () => {
	it('keeps a sentence when made expands into a pot of tea', () => {
		expect(applyExpansion('I made tea.', 1, 'a fresh pot of hot tea')).toBe(
			'I made a fresh pot of hot tea.'
		);
	});

	it('keeps a sentence when made expands into a small cup of tea', () => {
		expect(applyExpansion('I made tea.', 1, 'a small cup of hot tea')).toBe(
			'I made a small cup of hot tea.'
		);
	});

	it('uses a verb phrase that already fits beside tea', () => {
		expect(applyExpansion('I made tea.', 1, 'made a fresh pot of')).toBe(
			'I made a fresh pot of tea.'
		);
	});

	it('expands tea into a longer noun phrase and keeps the period', () => {
		expect(applyExpansion('I made tea.', 2, 'a soothing cup of herbal tea')).toBe(
			'I made a soothing cup of herbal tea.'
		);
	});

	it('keeps the clicked word when a neighbor word sits inside the phrase', () => {
		expect(applyExpansion('I made tea.', 1, 'a cup of tea with honey')).toBe('I made tea.');
		expect(applyExpansion('I made tea.', 1, 'made tea in a chipped mug')).toBe('I made tea.');
		expect(applyExpansion('I made tea.', 2, 'the strongest tea I could manage.')).toBe(
			'I made tea.'
		);
	});

	it('does not repeat tea when that word is already in the sentence', () => {
		expect(applyExpansion('I made tea.', 1, 'tea')).toBe('I made tea.');
		expect(applyExpansion('I made tea.', 1, 'I a fresh pot of hot tea tea.')).toBe(
			'I made a fresh pot of hot tea.'
		);
	});
});
