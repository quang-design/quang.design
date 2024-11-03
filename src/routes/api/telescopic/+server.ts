import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

export async function POST({ request, url }) {
	const { context } = await request.json();
	const word = url.searchParams.get('expand');

	const response = await anthropic.messages.create({
		model: 'claude-3-5-sonnet-20241022',
		max_tokens: 24,
		temperature: 0,
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `
                            You are a word expander.
                            Expand the word "${word}" into a longer phrase in the context of the following text: "${context}".
                            Keep the period at the end of the sentence.
                            Use the period as a way to divide the context into sentences if the sentence is too long.
                            Only respond with the expanded phrase.
						`
					}
				]
			}
		]
	});

	return new Response(JSON.stringify(response));
}
