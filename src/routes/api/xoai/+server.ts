import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

export async function POST({ request }) {
	const { board, isAiTurn, message } = await request.json();

	let prompt;
	if (isAiTurn) {
		prompt = `
			You are a witty AI playing Tic-tac-toe (you: O, human: X).
			Board state: ${JSON.stringify(board)}
			
			Quick personality analysis:
			- Aggressive = confident/competitive
			- Defensive = cautious
			- Center = strategic
			- Edges = creative
			
			Reply format:
			{
				"move": (0-8 for empty position),
				"comment": (one short, sassy line about their personality/strategy)
			}
		`;
	} else {
		prompt = `
			You are a perceptive AI friend playing Tic-tac-toe.
			Board: ${JSON.stringify(board)}
			Human: "${message}"
			
			If they want to restart, reply: "new game", "start", or "play again"
			
			Otherwise: Give ONE short, witty response that reflects their gameplay personality or mood.
			Be supportive but playfully challenging.
		`;
	}

	const response = await anthropic.messages.create({
		model: 'claude-3-5-sonnet-20241022',
		max_tokens: 150,
		temperature: 0.7,
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: prompt
					}
				]
			}
		]
	});

	return new Response(JSON.stringify(response.content[0].text));
}
