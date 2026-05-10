export type LlmProviderName = 'anthropic' | 'openai' | 'openai-compatible';

export type GenerateTextOptions = {
	prompt: string;
	maxTokens: number;
	temperature?: number;
};

export type GenerateTextResult = {
	content: Array<{ text: string }>;
	model: string;
	provider: LlmProviderName;
};

export type LlmProvider = {
	name: LlmProviderName;
	model: string;
	generateText(options: GenerateTextOptions): Promise<GenerateTextResult>;
};

export type LlmProviderConfig = {
	apiKey: string;
	model: string;
	baseUrl?: string;
};
