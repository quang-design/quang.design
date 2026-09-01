<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import { Action, MicroLabel } from '$lib/components/primitives';

	const SIZE = 9;
	const MINE_COUNT = 10;
	const TOTAL = SIZE * SIZE;
	const cells = Array.from({ length: TOTAL }, (_, i) => i);

	let mines = $state<Set<number>>(new Set());
	let numbers = $state<number[]>(Array(TOTAL).fill(0));
	let revealed = new SvelteSet<number>();
	let flagged = new SvelteSet<number>();
	let exploded = $state<number | null>(null);
	let started = $state(false);

	const lost = $derived(exploded !== null);
	const won = $derived(!lost && started && revealed.size === TOTAL - MINE_COUNT);
	const over = $derived(lost || won);

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

	function placeMines(safeIndex: number) {
		const forbidden = new Set([safeIndex, ...neighbors(safeIndex)]);
		const next = new Set<number>();
		while (next.size < MINE_COUNT) {
			const n = Math.floor(Math.random() * TOTAL);
			if (!forbidden.has(n) && !next.has(n)) next.add(n);
		}
		const counts = Array(TOTAL).fill(0);
		for (const mine of next) {
			for (const pos of neighbors(mine)) counts[pos]++;
		}
		mines = next;
		numbers = counts;
		started = true;
	}

	function revealFrom(index: number) {
		if (revealed.has(index) || flagged.has(index) || over) return;
		if (!started) placeMines(index);
		if (mines.has(index)) {
			exploded = index;
			for (const mine of mines) revealed.add(mine);
			return;
		}
		const stack = [index];
		while (stack.length) {
			const current = stack.pop()!;
			if (revealed.has(current) || flagged.has(current) || mines.has(current)) continue;
			revealed.add(current);
			if (numbers[current] === 0) {
				for (const pos of neighbors(current)) {
					if (!revealed.has(pos)) stack.push(pos);
				}
			}
		}
	}

	function toggleFlag(index: number) {
		if (revealed.has(index) || over) return;
		if (flagged.has(index)) flagged.delete(index);
		else flagged.add(index);
	}

	function reset() {
		mines = new Set();
		numbers = Array(TOTAL).fill(0);
		revealed.clear();
		flagged.clear();
		exploded = null;
		started = false;
	}

	function cellLabel(index: number) {
		if (flagged.has(index) && !revealed.has(index)) return 'Flagged';
		if (!revealed.has(index)) return 'Hidden';
		if (mines.has(index)) return 'Mine';
		if (numbers[index] > 0) return `${numbers[index]} nearby`;
		return 'Empty';
	}
</script>

<div class="flex flex-col gap-3">
	<div class="flex flex-wrap items-center gap-3">
		<MicroLabel>
			{#if won}Cleared
			{:else if lost}Mine
			{:else}{MINE_COUNT - flagged.size} mines left{/if}
		</MicroLabel>
		<Action onclick={reset}>Reset</Action>
	</div>
	<div class="grid w-fit grid-cols-9">
		{#each cells as i (i)}
			<button
				type="button"
				aria-label={cellLabel(i)}
				oncontextmenu={(e) => {
					e.preventDefault();
					toggleFlag(i);
				}}
				onclick={() => revealFrom(i)}
				class={[
					'flex size-8 items-center justify-center border-[length:var(--hair)] border-[var(--ink-25)]',
					revealed.has(i) ? 'bg-[var(--paper)]' : 'ink-invert bg-[var(--ink-10)]',
					mines.has(i) && revealed.has(i) && 'hatch',
					exploded === i && 'bg-[var(--ink)] text-[var(--paper)]'
				]}
			>
				{#if flagged.has(i) && !revealed.has(i)}
					<span class="ink-label">F</span>
				{:else if revealed.has(i) && mines.has(i)}
					<span class="ink-label">M</span>
				{:else if revealed.has(i) && numbers[i] > 0}
					<span class="ink-label">{numbers[i]}</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
