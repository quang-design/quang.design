export function createMicroscopicPrompt(
	left: string,
	selection: string,
	right: string,
	maxWords: number
) {
	return `The finished sentence is BEFORE + replacement + AFTER.
Write only the replacement for SELECTION.

BEFORE: ${JSON.stringify(left)}
SELECTION: ${JSON.stringify(selection)}
AFTER: ${JSON.stringify(right)}

Rewrite SELECTION in at most ${maxWords} words.
Keep the actor and the main action or object.
Keep the claim. Do not drop the predicate that carries the meaning.
If SELECTION is a parenthetical, compress the claim inside it and keep the parentheses.
Otherwise drop asides and extra modifiers.
If a shorter rewrite would lose the claim, keep SELECTION.
Do not continue into AFTER. Do not copy BEFORE or AFTER.
If AFTER starts with a period, do not end the replacement with a period.

Example:
BEFORE: ""
SELECTION: "Yawning, and smearing my eyes with my fingers, "
AFTER: "I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap"
replacement: "Rubbing my eyes, "
finished: "Rubbing my eyes, I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap"

Example:
BEFORE: "I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap, "
SELECTION: "checking with my hands to make sure it was cold enough (The best tea comes from the coldest water)"
AFTER: ". I glanced outside for a minute at the city mist."
replacement: "checking the water was cold enough"
finished: "I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap, checking the water was cold enough. I glanced outside for a minute at the city mist."

Example:
BEFORE: "it was cold enough "
SELECTION: "(The best tea comes from the coldest water)"
AFTER: ". I glanced outside for a minute at the city mist."
replacement: "(The best tea comes from the coldest water)"
finished: "it was cold enough (The best tea comes from the coldest water). I glanced outside for a minute at the city mist."`;
}

export function createTelescopicPrompt(context: string, word: string) {
	return `You are a word expander.
Expand the word "${word}" into a longer phrase in the context of the following text: "${context}".
Keep the period at the end of the sentence.
Use the period as a way to divide the context into sentences if the sentence is too long.
Only respond with the expanded phrase, NOT the full sentence.
For example, if asked to expand "tea" in "I made <word>.", respond with "a soothing cup of herbal tea." NOT "I made a soothing cup of herbal tea."`;
}
