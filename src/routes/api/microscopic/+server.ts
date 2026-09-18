import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateText } from '$lib/server/llm';
import { createMicroscopicPrompt } from '$lib/server/llm/prompts';
import { clipZipToGap, splitAround, zipWordBudget } from '$lib/utils/microscopic-zip';

type MicroscopicRequest = {
	context?: unknown;
	selection?: unknown;
};

export const POST: RequestHandler = async ({ request }) => {
	const { context, selection } = (await request.json()) as MicroscopicRequest;

	if (typeof context !== 'string' || typeof selection !== 'string') {
		throw error(400, 'Expected context and selection strings');
	}

	const { left, right } = splitAround(context, selection);
	const maxWords = zipWordBudget(selection);
	const result = await generateText({
		prompt: createMicroscopicPrompt(left, selection, right, maxWords),
		maxTokens: 40,
		temperature: 0
	});
	const zipped = clipZipToGap(left, result.content[0]?.text ?? '', right);

	return json({
		...result,
		content: [{ text: zipped }]
	});
};
