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

const FUNCTION_WORDS = new Set([
	'a',
	'an',
	'the',
	'of',
	'and',
	'or',
	'but',
	'to',
	'with',
	'for',
	'in',
	'on',
	'at',
	'from',
	'by'
]);

function overlaps(phrase: string[], neighbor: string[], edge: 'start' | 'end') {
	const max = Math.min(phrase.length, neighbor.length);
	for (let n = max; n > 0; n--) {
		const fromPhrase = edge === 'start' ? phrase.slice(0, n) : phrase.slice(phrase.length - n);
		const fromNeighbor =
			edge === 'start' ? neighbor.slice(neighbor.length - n) : neighbor.slice(0, n);
		if (fromPhrase.every((word, index) => word === fromNeighbor[index])) return n;
	}
	return 0;
}

function keptPhrase(phrase: string, left: string, right: string, bare: string) {
	const leftWords = lexemes(left);
	const rightWords = lexemes(right);
	const leftSet = new Set(leftWords);
	const rightSet = new Set(rightWords);
	const bareNorm = bare.toLowerCase();
	const chunks = chunksOf(stripQuotes(phrase));
	const hits = chunks.flatMap((chunk, index) =>
		chunk.kind === 'word' ? [{ index, norm: chunk.text.toLowerCase() }] : []
	);
	const dropped = new Set<number>();
	const soleAnchor = hits.filter((hit) => hit.norm === bareNorm).length === 1;

	const lead = overlaps(
		hits.map((hit) => hit.norm),
		leftWords,
		'start'
	);
	for (let n = 0; n < lead; n++) {
		const hit = hits[n];
		if (!hit || (hit.norm === bareNorm && soleAnchor)) break;
		dropped.add(hit.index);
	}

	let end = hits.length;
	while (end > 0 && rightWords[0] && hits[end - 1]?.norm === rightWords[0]) {
		const hit = hits[end - 1];
		if (!hit || (hit.norm === bareNorm && soleAnchor)) break;
		end -= 1;
		dropped.add(hit.index);
	}

	let prev = '';
	let keptAnchor = false;
	const kept: Chunk[] = [];
	for (const [index, chunk] of chunks.entries()) {
		if (chunk.kind === 'gap') {
			kept.push(chunk);
			continue;
		}
		if (dropped.has(index)) continue;
		const norm = chunk.text.toLowerCase();
		if (norm === prev) continue;
		if (norm === bareNorm) keptAnchor = true;
		prev = norm;
		kept.push(chunk);
	}

	const blocked = kept.some(
		(chunk) =>
			chunk.kind === 'word' &&
			chunk.text.toLowerCase() !== bareNorm &&
			!FUNCTION_WORDS.has(chunk.text.toLowerCase()) &&
			(leftSet.has(chunk.text.toLowerCase()) || rightSet.has(chunk.text.toLowerCase()))
	);

	return { text: tidy(kept), keptAnchor, blocked };
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
	if (kept.blocked) return word;
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
