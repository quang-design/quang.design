export function createMicroscopicPrompt(context: string, selection: string) {
	return `Zip "${selection}" into the shortest replacement that still fits the surrounding sentence.

Rules:
- Reply with only the zipped text
- Cut hard: a phrase becomes 1-3 words; a sentence becomes a short clause
- Keep the subject
- Do not repeat words that appear after the selection
- Do not return the original selection or a lightly edited copy of it

Example: "Yawning, and smearing my eyes with my fingers" -> "Yawning"

Context: "${context}"`;
}

export function createTelescopicPrompt(context: string, word: string) {
	return `You are a word expander.
Expand the word "${word}" into a longer phrase in the context of the following text: "${context}".
Keep the period at the end of the sentence.
Use the period as a way to divide the context into sentences if the sentence is too long.
Only respond with the expanded phrase, NOT the full sentence.
For example, if asked to expand "tea" in "I made <word>.", respond with "a soothing cup of herbal tea." NOT "I made a soothing cup of herbal tea."`;
}
