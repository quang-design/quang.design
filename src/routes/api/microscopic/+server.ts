import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

export async function POST({ request }) {
	const { context, selection } = await request.json();

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
                    You are a semantic word zipper.
                    Zip up the text "${selection}" into a significantly shorter version while preserving these rules in order:
                    1. Zipped text must be shorter than selection text
                    2. Always keep the subject of the sentence
                    3. Maintain grammatical structure
                    4. If it's a paragraph -> zip into one short sentence
                    5. If it's a sentence -> zip into a shorter sentence with fewer words
                    6. If it's a phrase -> zip into a shorter phrase with fewer words
                    7. Keep core meaning only, remove descriptive details
                    8. Keep only essential punctuation
                    9. The output must seamlessly replace the original text
                    
                    Context: "${context}"
                    Only respond with the zipped text.
							`
					}
				]
			}
		]
	});

	return new Response(JSON.stringify(response));
}
