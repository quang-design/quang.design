import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateText } from '$lib/server/llm';
import { createTelescopicPrompt } from '$lib/server/llm/prompts';
import { applyExpansion, gapAt } from '$lib/utils/telescopic-expand';

type TelescopicRequest = {
	context?: unknown;
	index?: unknown;
};

export const POST: RequestHandler = async ({ request }) => {
	const { context, index } = (await request.json()) as TelescopicRequest;

	if (typeof context !== 'string' || typeof index !== 'number') {
		throw error(400, 'Expected a sentence and a word index');
	}

	const gap = gapAt(context, index);
	if (!gap) {
		throw error(400, 'Expected a sentence and a word index');
	}

	const result = await generateText({
		prompt: createTelescopicPrompt(gap.left, gap.word, gap.right),
		maxTokens: 64,
		temperature: 0
	});
	const sentence = applyExpansion(context, index, result.content[0]?.text ?? '');

	return json({
		...result,
		content: [{ text: sentence }]
	});
};
