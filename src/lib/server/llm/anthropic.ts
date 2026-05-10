import Anthropic from '@anthropic-ai/sdk';
import type { Message, TextBlock } from '@anthropic-ai/sdk/resources/messages';
import type {
	GenerateTextOptions,
	GenerateTextResult,
	LlmProvider,
	LlmProviderConfig
} from './types';

function isTextBlock(block: Message['content'][number]): block is TextBlock {
	return block.type === 'text';
}

function extractText(response: Message) {
	return response.content
		.filter(isTextBlock)
		.map((block) => block.text)
		.join('\n')
		.trim();
}

export function createAnthropicProvider(config: LlmProviderConfig): LlmProvider {
	const client = new Anthropic({ apiKey: config.apiKey });

	return {
		name: 'anthropic',
		model: config.model,
		async generateText({
			prompt,
			maxTokens,
			temperature = 0
		}: GenerateTextOptions): Promise<GenerateTextResult> {
			const response = await client.messages.create({
				model: config.model,
				max_tokens: maxTokens,
				temperature,
				messages: [
					{
						role: 'user',
						content: prompt
					}
				]
			});

			return {
				content: [{ text: extractText(response) }],
				model: config.model,
				provider: 'anthropic'
			};
		}
	};
}
