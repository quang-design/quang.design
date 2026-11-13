import { createParts } from '@ui-sdk/svelte/primitive';
import { wordBoard } from './word-board';

const { Root: WordBoardRoot, Word: WordBoardWord } = createParts(wordBoard, {
	root: 'div',
	word: 'button'
});

export { WordBoardRoot, WordBoardWord };
