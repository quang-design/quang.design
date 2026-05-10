import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateText } from '$lib/server/llm';
import { createTelescopicPrompt } from '$lib/server/llm/prompts';

type TelescopicRequest = {
	context?: unknown;
};

export const POST: RequestHandler = async ({ request, url }) => {
	const { context } = (await request.json()) as TelescopicRequest;
	const word = url.searchParams.get('expand');

	if (typeof context !== 'string' || !word) {
		throw error(400, 'Expected context body and expand query parameter');
	}

	return json(
		await generateText({
			prompt: createTelescopicPrompt(context, word),
			maxTokens: 24,
			temperature: 0
		})
	);
};
