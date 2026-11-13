import {
	byCell,
	createController,
	createGridFocus,
	definePrimitive,
	selects,
	type GridCell
} from '@ui-sdk/core';

const SIZE = 9;
const MINE_COUNT = 10;
const TOTAL = SIZE * SIZE;

type MinesweeperGameSnapshot = {
	status: 'playing' | 'won' | 'lost';
	minesLeft: number;
	over: boolean;
};

type MinesweeperBoardApi = {
	reveal: (index: number) => void;
	flag: (index: number) => void;
	reset: () => void;
};

type MinesweeperBoardOptions = {
	controller?: MinesweeperBoardApi;
	onGameChange?: (game: MinesweeperGameSnapshot) => void;
};

type CellView = {
	index: number;
	revealed: boolean;
	flagged: boolean;
	mine: boolean;
	exploded: boolean;
	number: number;
	label: string;
};

function neighbors(index: number) {
	const row = Math.floor(index / SIZE);
	const col = index % SIZE;
	const out: number[] = [];
	for (let dr = -1; dr <= 1; dr++) {
		for (let dc = -1; dc <= 1; dc++) {
			if (dr === 0 && dc === 0) continue;
			const r = row + dr;
			const c = col + dc;
			if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) continue;
			out.push(r * SIZE + c);
		}
	}
	return out;
}

function cellIndex(cell: { row: number; col: number }) {
	return cell.row * SIZE + cell.col;
}

function statusOf(state: { exploded: number | null; started: boolean; revealed: number[] }) {
	const lost = state.exploded !== null;
	const won = !lost && state.started && state.revealed.length === TOTAL - MINE_COUNT;
	if (won) return 'won' as const;
	if (lost) return 'lost' as const;
	return 'playing' as const;
}

function cellLabel(
	index: number,
	state: {
		mines: number[];
		numbers: number[];
		revealed: number[];
		flagged: number[];
	}
) {
	const row = Math.floor(index / SIZE) + 1;
	const col = (index % SIZE) + 1;
	const pos = `Row ${row} column ${col}`;
	if (state.flagged.includes(index) && !state.revealed.includes(index)) return `${pos}, flagged`;
	if (!state.revealed.includes(index)) return `${pos}, hidden`;
	if (state.mines.includes(index)) return `${pos}, mine`;
	if (state.numbers[index]! > 0) return `${pos}, ${state.numbers[index]} nearby`;
	return `${pos}, empty`;
}

function cellView(
	index: number,
	state: {
		mines: number[];
		numbers: number[];
		revealed: number[];
		flagged: number[];
		exploded: number | null;
	}
): CellView {
	return {
		index,
		revealed: state.revealed.includes(index),
		flagged: state.flagged.includes(index),
		mine: state.mines.includes(index),
		exploded: state.exploded === index,
		number: state.numbers[index] ?? 0,
		label: cellLabel(index, state)
	};
}

function createMinesweeperController() {
	return createController<MinesweeperBoardApi>();
}

function gameSnapshot(state: {
	exploded: number | null;
	started: boolean;
	revealed: number[];
	flagged: number[];
}): MinesweeperGameSnapshot {
	const status = statusOf(state);
	return {
		status,
		minesLeft: MINE_COUNT - state.flagged.length,
		over: status !== 'playing'
	};
}

const minesweeperBoard = definePrimitive({
	name: 'minesweeper-board',
	options: {
		controller: 'value',
		onGameChange: 'callback'
	},
	state: (_options: MinesweeperBoardOptions) => ({
		mines: [] as number[],
		numbers: Array.from({ length: TOTAL }, () => 0),
		revealed: [] as number[],
		flagged: [] as number[],
		exploded: null as number | null,
		started: false,
		active: null as GridCell | null
	}),
	api: (context) => {
		const grid = createGridFocus(context, {
			key: 'active',
			rows: () => SIZE,
			cols: () => SIZE
		});

		function publish() {
			context.options().onGameChange?.(gameSnapshot(context.store.get()));
		}

		function placeMines(safeIndex: number) {
			const forbidden = new Set([safeIndex, ...neighbors(safeIndex)]);
			const next = new Set<number>();
			while (next.size < MINE_COUNT) {
				const n = Math.floor(Math.random() * TOTAL);
				if (!forbidden.has(n) && !next.has(n)) next.add(n);
			}
			const counts = Array.from({ length: TOTAL }, () => 0);
			for (const mine of next) {
				for (const pos of neighbors(mine)) counts[pos]!++;
			}
			context.store.set({
				mines: [...next],
				numbers: counts,
				started: true
			});
		}

		function over() {
			const state = context.store.get();
			return statusOf(state) !== 'playing';
		}

		function reveal(index: number) {
			const state = context.store.get();
			if (state.revealed.includes(index) || state.flagged.includes(index) || over()) return;
			if (!state.started) placeMines(index);
			const afterPlace = context.store.get();
			if (afterPlace.mines.includes(index)) {
				const revealed = new Set(afterPlace.revealed);
				for (const mine of afterPlace.mines) revealed.add(mine);
				context.store.set({
					exploded: index,
					revealed: [...revealed]
				});
				publish();
				return;
			}
			const revealed = new Set(afterPlace.revealed);
			const stack = [index];
			while (stack.length) {
				const current = stack.pop()!;
				if (
					revealed.has(current) ||
					afterPlace.flagged.includes(current) ||
					afterPlace.mines.includes(current)
				) {
					continue;
				}
				revealed.add(current);
				if (afterPlace.numbers[current] === 0) {
					for (const pos of neighbors(current)) {
						if (!revealed.has(pos)) stack.push(pos);
					}
				}
			}
			context.store.set({ revealed: [...revealed] });
			publish();
		}

		function flag(index: number) {
			const state = context.store.get();
			if (state.revealed.includes(index) || over()) return;
			const flagged = new Set(state.flagged);
			if (flagged.has(index)) flagged.delete(index);
			else flagged.add(index);
			context.store.set({ flagged: [...flagged] });
			publish();
		}

		function reset() {
			if (!over()) return;
			context.store.set({
				mines: [],
				numbers: Array.from({ length: TOTAL }, () => 0),
				revealed: [],
				flagged: [],
				exploded: null,
				started: false,
				active: null
			});
			publish();
		}

		return {
			grid,
			reveal,
			flag,
			reset
		};
	},
	slots: (slot) => ({
		root: slot({
			role: 'grid',
			keys: { none: 'Focus stays on a cell, whose keydown handles them.' },
			attrs: () => ({
				'aria-label': 'Minesweeper'
			}),
			state: (state): MinesweeperGameSnapshot => gameSnapshot(state)
		}),
		row: slot<{ row: number }>({
			role: 'row',
			props: { row: 'number' }
		}),
		cell: slot<{ row: number; col: number }, CellView>({
			role: 'gridcell',
			focus: 'roving',
			props: { row: 'number', col: 'number' },
			selects: selects({ active: byCell }),
			keys: [
				'ArrowUp',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				'Home',
				'End',
				'mod+Home',
				'mod+End',
				'PageUp',
				'PageDown',
				'Enter',
				' ',
				'f',
				'F'
			],
			state: (state, { props }) => cellView(cellIndex(props), state),
			attrs: (state, { props, api }) => {
				const view = cellView(cellIndex(props), state);
				return {
					type: 'button',
					tabindex: api.grid.tabIndex(state, props),
					'aria-label': view.label,
					'data-revealed': view.revealed ? '' : undefined,
					'data-flagged': view.flagged && !view.revealed ? '' : undefined,
					'data-mine': view.revealed && view.mine ? '' : undefined,
					'data-exploded': view.exploded ? '' : undefined,
					'data-active': api.grid.isActive(state, props) ? '' : undefined
				};
			},
			press: ({ api, props }) => api.reveal(cellIndex(props)),
			on: {
				keydown: (event, { api, props }) => {
					if (event.key === 'f' || event.key === 'F') {
						event.preventDefault();
						api.flag(cellIndex(props));
						return;
					}
					api.grid.keydown(event);
				},
				pointerdown: (event, { api, props }) => {
					api.grid.focus(props, { reason: 'item-press', event });
				},
				contextmenu: (event, { api, props }) => {
					event.preventDefault();
					api.flag(cellIndex(props));
				}
			},
			bind: (el, { api, props }) => api.grid.bind(el, props)
		})
	}),
	agent: { actions: ['reveal', 'flag', 'reset'] }
});

export {
	SIZE,
	MINE_COUNT,
	TOTAL,
	createMinesweeperController,
	minesweeperBoard,
	type MinesweeperBoardApi,
	type MinesweeperBoardOptions,
	type MinesweeperGameSnapshot,
	type CellView
};
