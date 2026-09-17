import { describe, expect, it } from 'vitest';
import { buildChatCompletionBody, usesMaxCompletionTokens } from './openai-compatible';

describe('usesMaxCompletionTokens', () => {
	it('detects gpt-5, gpt-6, and o-series models', () => {
		expect(usesMaxCompletionTokens('gpt-5.4-nano')).toBe(true);
		expect(usesMaxCompletionTokens('gpt-5.4-mini')).toBe(true);
		expect(usesMaxCompletionTokens('gpt-6-astra')).toBe(true);
		expect(usesMaxCompletionTokens('o3-mini')).toBe(true);
		expect(usesMaxCompletionTokens('gpt-4o-mini')).toBe(false);
	});
});

describe('buildChatCompletionBody', () => {
	it('uses max_completion_tokens and disables reasoning for gpt-5.4-nano', () => {
		expect(
			buildChatCompletionBody({
				model: 'gpt-5.4-nano',
				prompt: 'expand tea',
				maxTokens: 64
			})
		).toEqual({
			model: 'gpt-5.4-nano',
			messages: [{ role: 'user', content: 'expand tea' }],
			max_completion_tokens: 64,
			reasoning_effort: 'none',
			temperature: 0
		});
	});

	it('keeps max_tokens for older chat models', () => {
		expect(
			buildChatCompletionBody({
				model: 'gpt-4o-mini',
				prompt: 'zip this',
				maxTokens: 24,
				temperature: 0.2
			})
		).toEqual({
			model: 'gpt-4o-mini',
			messages: [{ role: 'user', content: 'zip this' }],
			max_tokens: 24,
			temperature: 0.2
		});
	});
});
