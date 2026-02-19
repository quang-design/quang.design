<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import MinesweeperBlock from './MinesweeperBlock.svelte';

	let mines = $state<number[]>([]);
	let numbers = $state<number[]>(Array(81).fill(0));
	let isGameOver = $state(false);
	let revealedBlocks = new SvelteSet<number>();

	function calculateNumbers() {
		numbers = Array(81).fill(0);
		for (const mine of mines) {
			const adjacentPositions = [
				mine - 10,
				mine - 9,
				mine - 8, // top row
				mine - 1,
				mine + 1, // middle row
				mine + 8,
				mine + 9,
				mine + 10 // bottom row
			];

			adjacentPositions.forEach((pos) => {
				if (pos >= 0 && pos < 81) {
					const currentRow = Math.floor(mine / 9);
					const posRow = Math.floor(pos / 9);
					if (Math.abs(currentRow - posRow) <= 1) {
						numbers[pos]++;
					}
				}
			});
		}
	}

	function getAdjacentPositions(index: number) {
		const adjacentPositions = [
			index - 10,
			index - 9,
			index - 8, // top row
			index - 1,
			index + 1, // middle row
			index + 8,
			index + 9,
			index + 10 // bottom row
		];

		return adjacentPositions.filter((pos) => {
			if (pos < 0 || pos >= 81) return false;
			const currentRow = Math.floor(index / 9);
			const posRow = Math.floor(pos / 9);
			return Math.abs(currentRow - posRow) <= 1;
		});
	}

	function revealBlockRecursive(index: number) {
		if (revealedBlocks.has(index) || mines.includes(index)) return;

		revealedBlocks.add(index);

		// If it's a zero, reveal adjacent blocks recursively
		if (numbers[index] === 0) {
			const adjacentPositions = getAdjacentPositions(index);
			adjacentPositions.forEach((pos) => {
				if (!revealedBlocks.has(pos)) {
					revealBlockRecursive(pos);
				}
			});
		}
	}

	function revealBlock(index: number) {
		revealBlockRecursive(index);
	}

	function generateMines() {
		const minePositions = new Set<number>();
		while (minePositions.size < 10) {
			minePositions.add(Math.floor(Math.random() * 81));
		}
		mines = Array.from(minePositions);
		calculateNumbers();
	}

	function handleGameOver() {
		isGameOver = true;
	}

	generateMines();
</script>

<div class="grid grid-cols-9 gap-0">
	{#each Array(81) as _, i}
		<MinesweeperBlock
			isMine={mines.includes(i)}
			number={numbers[i]}
			{isGameOver}
			onGameOver={handleGameOver}
			isRevealed={revealedBlocks.has(i)}
			onReveal={() => revealBlock(i)}
		/>
	{/each}
</div>
