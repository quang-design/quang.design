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
							Expand the word "${word}" into a longer phrase.
							If the context is long, you may use your expanded phrase along with periods, semicolons, or em dashes to break it into multiple parts.
							Context: "${context}"
							Keep any final punctuation from the original context.
							Only respond with the expanded phrase.
						`
					}
				]
			}
		]
	});

	return new Response(JSON.stringify(response));
}
