import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateText } from '$lib/server/llm';
import { createMicroscopicPrompt } from '$lib/server/llm/prompts';

type MicroscopicRequest = {
	context?: unknown;
	selection?: unknown;
};

export const POST: RequestHandler = async ({ request }) => {
	const { context, selection } = (await request.json()) as MicroscopicRequest;

	if (typeof context !== 'string' || typeof selection !== 'string') {
		throw error(400, 'Expected context and selection strings');
	}

	return json(
		await generateText({
			prompt: createMicroscopicPrompt(context, selection),
			maxTokens: 24,
			temperature: 0
		})
	);
};
