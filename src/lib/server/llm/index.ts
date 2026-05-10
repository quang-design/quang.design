import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createAnthropicProvider } from './anthropic';
import { createOpenAICompatibleProvider, createOpenAIProvider } from './openai-compatible';
import type {
	GenerateTextOptions,
	GenerateTextResult,
	LlmProvider,
	LlmProviderName
} from './types';

const defaultProvider: LlmProviderName = 'anthropic';
const defaultModels: Record<LlmProviderName, string> = {
	anthropic: 'claude-sonnet-4-6',
	openai: 'gpt-4o-mini',
	'openai-compatible': 'gpt-4o-mini'
};

let provider: LlmProvider | null = null;
let providerCacheKey = '';

function getConfiguredProviderName(): LlmProviderName {
	const providerName = (env.LLM_PROVIDER || defaultProvider).toLowerCase();

	if (
		providerName === 'anthropic' ||
		providerName === 'openai' ||
		providerName === 'openai-compatible'
	) {
		return providerName;
	}

	throw error(500, `Unsupported LLM_PROVIDER "${providerName}"`);
}

function getProviderApiKey(providerName: LlmProviderName) {
	if (env.LLM_API_KEY) return env.LLM_API_KEY;
	if (providerName === 'anthropic') return env.ANTHROPIC_API_KEY;
	if (providerName === 'openai') return env.OPENAI_API_KEY;
	return env.OPENAI_API_KEY;
}

function getProviderModel(providerName: LlmProviderName) {
	if (env.LLM_MODEL) return env.LLM_MODEL;
	if (providerName === 'anthropic' && env.ANTHROPIC_MODEL) return env.ANTHROPIC_MODEL;
	if ((providerName === 'openai' || providerName === 'openai-compatible') && env.OPENAI_MODEL) {
		return env.OPENAI_MODEL;
	}
	return defaultModels[providerName];
}

function createProvider(providerName: LlmProviderName) {
	const apiKey = getProviderApiKey(providerName);
	const model = getProviderModel(providerName);

	if (!apiKey) {
		throw error(500, `Missing API key for ${providerName} provider`);
	}

	if (providerName === 'anthropic') {
		return createAnthropicProvider({ apiKey, model });
	}

	if (providerName === 'openai') {
		return createOpenAIProvider({ apiKey, model, baseUrl: env.LLM_BASE_URL });
	}

	return createOpenAICompatibleProvider({ apiKey, model, baseUrl: env.LLM_BASE_URL });
}

export function getLlmProvider() {
	const providerName = getConfiguredProviderName();
	const cacheKey = [providerName, getProviderModel(providerName), env.LLM_BASE_URL || ''].join(':');

	if (!provider || providerCacheKey !== cacheKey) {
		provider = createProvider(providerName);
		providerCacheKey = cacheKey;
	}

	return provider;
}

export async function generateText(options: GenerateTextOptions): Promise<GenerateTextResult> {
	return getLlmProvider().generateText(options);
}
