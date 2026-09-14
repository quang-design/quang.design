import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateText } from '$lib/server/llm';
import { createMicroscopicPrompt } from '$lib/server/llm/prompts';
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
		throw error(400, 'Expected context and selection strings');
	}

	const payload = body as { context?: unknown; selection?: unknown };
	const context = requireBoundedString(payload.context, LLM_MAX_CONTEXT_CHARS);
	const selection = requireBoundedString(payload.selection, LLM_MAX_SELECTION_CHARS);

	return json(
		await generateText({
			prompt: createMicroscopicPrompt(context, selection),
			maxTokens: 24,
			temperature: 0
		})
	);
};
