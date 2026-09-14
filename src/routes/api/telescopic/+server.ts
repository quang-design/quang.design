import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateText } from '$lib/server/llm';
import { createTelescopicPrompt } from '$lib/server/llm/prompts';
import {
	LLM_MAX_CONTEXT_CHARS,
	LLM_MAX_JSON_BYTES,
	LLM_MAX_SELECTION_CHARS,
	llmLimiter,
	readJsonValue,
	rejectCrossOrigin,
	requireBoundedString
} from '$lib/server/http';

export const POST: RequestHandler = async ({ request, url, getClientAddress }) => {
	rejectCrossOrigin(request, url.origin);
	llmLimiter.check(getClientAddress());

	const body = await readJsonValue(request, LLM_MAX_JSON_BYTES);
	if (!body || typeof body !== 'object') {
		throw error(400, 'Expected context body and expand query parameter');
	}

	const context = requireBoundedString(
		(body as { context?: unknown }).context,
		LLM_MAX_CONTEXT_CHARS
	);
	const word = requireBoundedString(url.searchParams.get('expand'), LLM_MAX_SELECTION_CHARS);

	return json(
		await generateText({
			prompt: createTelescopicPrompt(context, word),
			maxTokens: 24,
			temperature: 0
		})
	);
};
