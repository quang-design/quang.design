import { createParts } from '@ui-sdk/svelte/primitive';
import { minesweeperBoard } from './minesweeper-board';

const {
	Root: MinesweeperBoardRoot,
	Row: MinesweeperBoardRow,
	Cell: MinesweeperBoardCell
} = createParts(minesweeperBoard, {
	root: 'div',
	row: 'div',
	cell: 'button'
});

export { MinesweeperBoardRoot, MinesweeperBoardRow, MinesweeperBoardCell };
