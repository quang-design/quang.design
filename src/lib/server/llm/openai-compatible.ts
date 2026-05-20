import { error } from '@sveltejs/kit';
import type {
	GenerateTextOptions,
	GenerateTextResult,
	LlmProvider,
	LlmProviderConfig,
	LlmProviderName
} from './types';

type ChatCompletionResponse = {
	choices?: Array<{
		message?: {
			content?: string | null;
		};
	}>;
	error?: {
		message?: string;
	};
};

const defaultBaseUrl = 'https://api.openai.com/v1';

export function createOpenAICompatibleProvider(
	config: LlmProviderConfig,
	name: LlmProviderName = 'openai-compatible'
): LlmProvider {
	const baseUrl = (config.baseUrl || defaultBaseUrl).replace(/\/$/, '');

	return {
		name,
		model: config.model,
		async generateText({
			prompt,
			maxTokens,
			temperature = 0
		}: GenerateTextOptions): Promise<GenerateTextResult> {
			const response = await fetch(`${baseUrl}/chat/completions`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${config.apiKey}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: config.model,
					messages: [{ role: 'user', content: prompt }],
					max_tokens: maxTokens,
					temperature
				})
			});

			const data = (await response.json().catch(() => null)) as ChatCompletionResponse | null;

			if (!response.ok) {
				throw error(response.status, data?.error?.message || 'LLM provider request failed');
			}

			return {
				content: [{ text: data?.choices?.[0]?.message?.content?.trim() ?? '' }],
				model: config.model,
				provider: name
			};
		}
	};
}

export function createOpenAIProvider(config: LlmProviderConfig): LlmProvider {
	return createOpenAICompatibleProvider(
		{ ...config, baseUrl: config.baseUrl || defaultBaseUrl },
		'openai'
	);
}
