const LEXEME = /[A-Za-z0-9']+/g;

type Chunk = {
	kind: 'word' | 'gap';
	text: string;
};

function lexemes(text: string) {
	return text.match(LEXEME)?.map((word) => word.toLowerCase()) ?? [];
}

function stripQuotes(text: string) {
	return text
		.trim()
		.replace(/^["'`]+|["'`]+$/g, '')
		.trim();
}

function bareWord(word: string) {
	return word.match(/[A-Za-z0-9']+/)?.[0] ?? '';
}

function trailingPunct(word: string) {
	return word.match(/[.!?]+$/)?.[0] ?? '';
}

function chunksOf(text: string): Chunk[] {
	const chunks: Chunk[] = [];
	for (const match of text.matchAll(/[A-Za-z0-9']+|[^A-Za-z0-9']+/g)) {
		const text = match[0];
		chunks.push({
			kind: /^[A-Za-z0-9']+$/.test(text) ? 'word' : 'gap',
			text
		});
	}
	return chunks;
}

function tidy(chunks: Chunk[]) {
	const kept: Chunk[] = [];
	let pendingGap = '';
	let started = false;

	for (const chunk of chunks) {
		if (chunk.kind === 'gap') {
			if (started) pendingGap += chunk.text;
			continue;
		}
		if (started) kept.push({ kind: 'gap', text: pendingGap || ' ' });
		kept.push(chunk);
		pendingGap = '';
		started = true;
	}

	return kept
		.map((chunk) => chunk.text)
		.join('')
		.replace(/\s+/g, ' ')
		.replace(/\s+([,.;:!?])/g, '$1')
		.trim();
}

function keptPhrase(phrase: string, left: string, right: string, bare: string) {
	const leftSet = new Set(lexemes(left));
	const rightSet = new Set(lexemes(right));
	const bareNorm = bare.toLowerCase();
	let keptAnchor = false;
	let prev = '';
	const kept: Chunk[] = [];

	for (const chunk of chunksOf(stripQuotes(phrase))) {
		if (chunk.kind === 'gap') {
			kept.push(chunk);
			continue;
		}

		const norm = chunk.text.toLowerCase();
		if (norm === bareNorm && !keptAnchor) {
			keptAnchor = true;
			prev = norm;
			kept.push(chunk);
			continue;
		}
		if (leftSet.has(norm) || rightSet.has(norm) || norm === prev) continue;
		prev = norm;
		kept.push(chunk);
	}

	return { text: tidy(kept), keptAnchor };
}

function sentence(left: string, middle: string, right: string) {
	return [left, middle, right].filter((part) => part.length > 0).join(' ');
}

function grammatical(text: string) {
	const words = lexemes(text);
	for (let i = 1; i < words.length; i++) {
		if (words[i] === words[i - 1]) return false;
	}
	if (/\b(I|You|We|They|He|She)\s+(a|an|the)\b/.test(text)) return false;
	const end = text.replace(/[.!?]+$/, '').trim();
	if (/\b(and|or|but|of|a|an|the)$/i.test(end)) return false;
	return words.length > 0;
}

export function gapAt(text: string, index: number) {
	const words = text.split(' ');
	if (!Number.isInteger(index) || index < 0 || index >= words.length) return null;
	return {
		word: words[index] ?? '',
		left: words.slice(0, index).join(' '),
		right: words.slice(index + 1).join(' ')
	};
}

export function fitExpansion(left: string, phrase: string, right: string, word: string) {
	const bare = bareWord(word);
	const punct = trailingPunct(word);
	const kept = keptPhrase(phrase, left, right, bare);
	let body = kept.text;

	if (!kept.keptAnchor) {
		if (!body) return word;
		const first = lexemes(body)[0] ?? '';
		if (right.trim() && /^(a|an|the)$/.test(first)) body = `${bare} ${body}`;
		else if (!right.trim()) body = `${body} ${bare}`;
		else return word;
	}

	if (punct && !/[.!?]/.test(right) && !body.endsWith(punct)) body = `${body}${punct}`;
	if (lexemes(body).length <= lexemes(bare).length) return word;

	const next = sentence(left, body, right);
	if (!grammatical(next)) return word;
	return body;
}

export function applyExpansion(text: string, index: number, phrase: string) {
	const gap = gapAt(text, index);
	if (!gap) return text;
	const words = text.split(' ');
	words[index] = fitExpansion(gap.left, phrase, gap.right, gap.word);
	return words.join(' ');
}
