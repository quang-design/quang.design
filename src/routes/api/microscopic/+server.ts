import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateText } from '$lib/server/llm';
import { createMicroscopicPrompt } from '$lib/server/llm/prompts';
import { clipZipToGap, splitAround, splitAt, zipWordBudget } from '$lib/utils/microscopic-zip';

type MicroscopicRequest = {
	context?: unknown;
	selection?: unknown;
	start?: unknown;
	end?: unknown;
};

function gapFromRequest(context: string, selection: string, start: unknown, end: unknown) {
	if (
		typeof start === 'number' &&
		typeof end === 'number' &&
		start >= 0 &&
		end <= context.length &&
		start < end
	) {
		return splitAt(context, start, end);
	}

	return splitAround(context, selection);
}

export const POST: RequestHandler = async ({ request }) => {
	const { context, selection, start, end } = (await request.json()) as MicroscopicRequest;

	if (typeof context !== 'string' || typeof selection !== 'string') {
		throw error(400, 'Expected context and selection strings');
	}

	const { left, right, selection: span } = gapFromRequest(context, selection, start, end);
	const maxWords = zipWordBudget(span);
	const result = await generateText({
		prompt: createMicroscopicPrompt(left, span, right, maxWords),
		maxTokens: 40,
		temperature: 0
	});
	const zipped = clipZipToGap(left, result.content[0]?.text ?? '', right, span);

	return json({
		...result,
		content: [{ text: zipped }]
	});
};
