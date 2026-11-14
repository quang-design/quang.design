<script lang="ts">
	import FlagIcon from '@lucide/svelte/icons/flag';
	import BombIcon from '@lucide/svelte/icons/bomb';
	import { Action, MicroLabel } from '$lib/components/primitives';
	import {
		SIZE,
		MINE_COUNT,
		createMinesweeperController,
		MinesweeperBoardRoot,
		MinesweeperBoardRow,
		MinesweeperBoardCell,
		type MinesweeperGameSnapshot
	} from '$lib/components/primitives/minesweeper';

	const board = createMinesweeperController();
	const rows = Array.from({ length: SIZE }, (_, row) => row);
	const cols = Array.from({ length: SIZE }, (_, col) => col);

	let game = $state<MinesweeperGameSnapshot>({
		status: 'playing',
		minesLeft: MINE_COUNT,
		over: false
	});
</script>

<div class="flex flex-col gap-[var(--grid)]">
	<div class="flex h-[var(--grid)] flex-wrap items-center gap-[var(--grid)]">
		<div aria-live="polite" aria-atomic="true">
			<MicroLabel>
				{#if game.status === 'won'}Cleared
				{:else if game.status === 'lost'}Mine
				{:else}{game.minesLeft} mines left{/if}
			</MicroLabel>
		</div>
		<Action onclick={() => board.reset()} disabled={!game.over}>Reset</Action>
		<span class="sr-only">Press F to flag a cell.</span>
	</div>
	<MinesweeperBoardRoot
		controller={board}
		onGameChange={(next) => {
			game = next;
		}}
		class="flex w-fit flex-col"
	>
		{#each rows as row (row)}
			<MinesweeperBoardRow {row} class="flex">
				{#each cols as col (`${row}:${col}`)}
					<MinesweeperBoardCell {row} {col}>
						{#snippet render({ props, state: cell })}
							<button
								{...props}
								class={[
									'flex size-[var(--grid)] items-center justify-center border-[length:var(--hair)] border-[var(--ink-25)]',
									cell.revealed ? 'bg-[var(--paper)]' : 'ink-invert bg-[var(--ink-10)]',
									cell.revealed && cell.mine && 'bg-red-600 text-white',
									cell.exploded && 'bg-red-700 text-white'
								]}
							>
								{#if cell.flagged && !cell.revealed}
									<FlagIcon class="size-3" />
								{:else if cell.revealed && cell.mine}
									<BombIcon class="size-3" />
								{:else if cell.revealed && cell.number > 0}
									<span class="ink-label">{cell.number}</span>
								{/if}
							</button>
						{/snippet}
					</MinesweeperBoardCell>
				{/each}
			</MinesweeperBoardRow>
		{/each}
	</MinesweeperBoardRoot>
</div>
