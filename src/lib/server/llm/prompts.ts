export function createMicroscopicPrompt(context: string, selection: string) {
	return `You are a semantic word zipper.
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
10. ONLY respond with the zipped text, NOT the full context

Context: "${context}"
Example: If asked to zip "Yawning, and smearing my eyes with my fingers" in the context above, respond with "Yawning" NOT "Yawning, I walked bleary..."
Only respond with the zipped text.`;
}

export function createTelescopicPrompt(context: string, word: string) {
	return `You are a word expander.
Expand the word "${word}" into a longer phrase in the context of the following text: "${context}".
Keep the period at the end of the sentence.
Use the period as a way to divide the context into sentences if the sentence is too long.
Only respond with the expanded phrase, NOT the full sentence.
For example, if asked to expand "tea" in "I made <word>.", respond with "a soothing cup of herbal tea." NOT "I made a soothing cup of herbal tea."`;
}
