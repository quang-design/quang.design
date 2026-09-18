export function createMicroscopicPrompt(left: string, selection: string, right: string) {
	return `Replace the selection so BEFORE + replacement + AFTER reads as one passage.

BEFORE: ${JSON.stringify(left)}
SELECTION: ${JSON.stringify(selection)}
AFTER: ${JSON.stringify(right)}

Write only the replacement.
Keep the selection's subject and its main action or object.
Cut extra detail, not the point.
The replacement must be shorter than the selection.
Match person, tense, and grammar so the joined passage is grammatical.
Do not copy wording from the end of BEFORE or the start of AFTER.
Do not add punctuation that AFTER already begins with.
Do not add punctuation that BEFORE already ends with.

Example:
BEFORE: ""
SELECTION: "Yawning, and smearing my eyes with my fingers"
AFTER: ", I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap"
Replacement: "Yawning and rubbing my eyes"

Example:
BEFORE: "Yawning, and smearing my eyes with my fingers, I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap, "
SELECTION: "checking with my hands to make sure it was cold enough (The best tea comes from the coldest water)"
AFTER: ". I glanced outside for a minute at the city mist."
Replacement: "checking the water was cold enough"`;
}

export function createTelescopicPrompt(context: string, word: string) {
	return `You are a word expander.
Expand the word "${word}" into a longer phrase in the context of the following text: "${context}".
Keep the period at the end of the sentence.
Use the period as a way to divide the context into sentences if the sentence is too long.
Only respond with the expanded phrase, NOT the full sentence.
For example, if asked to expand "tea" in "I made <word>.", respond with "a soothing cup of herbal tea." NOT "I made a soothing cup of herbal tea."`;
}
