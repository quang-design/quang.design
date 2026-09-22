export function applyExpansion(text: string, index: number, phrase: string) {
	const words = text.split(' ');
	const word = words[index] ?? '';
	return text.replace(word, phrase.trim());
}
