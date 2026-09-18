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

The replacement is SELECTION compressed to at most ${maxWords} words.
Keep the actor and the main action or object.
Drop asides, parentheticals, and extra modifiers.
Do not continue into AFTER. Do not copy BEFORE or AFTER.
If AFTER starts with a period, do not end the replacement with a period.

Example:
BEFORE: ""
SELECTION: "Yawning, and smearing my eyes with my fingers, "
AFTER: "I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap"
replacement: "Yawning and rubbing my eyes, "
finished: "Yawning and rubbing my eyes, I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap"

Example:
BEFORE: "I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap, "
SELECTION: "checking with my hands to make sure it was cold enough (The best tea comes from the coldest water)"
AFTER: ". I glanced outside for a minute at the city mist."
replacement: "checking the water was cold enough"
finished: "I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap, checking the water was cold enough. I glanced outside for a minute at the city mist."

Example:
BEFORE: "The best tea comes from the coldest water). "
SELECTION: "I glanced outside for a minute at the city mist"
AFTER: ". I could almost taste the grey."
replacement: "I glanced at the city mist"
finished: "The best tea comes from the coldest water). I glanced at the city mist. I could almost taste the grey."`;
}

export function createTelescopicPrompt(context: string, word: string) {
	return `You are a word expander.
Expand the word "${word}" into a longer phrase in the context of the following text: "${context}".
Keep the period at the end of the sentence.
Use the period as a way to divide the context into sentences if the sentence is too long.
Only respond with the expanded phrase, NOT the full sentence.
For example, if asked to expand "tea" in "I made <word>.", respond with "a soothing cup of herbal tea." NOT "I made a soothing cup of herbal tea."`;
}
