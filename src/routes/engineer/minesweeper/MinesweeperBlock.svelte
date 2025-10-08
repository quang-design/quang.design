<script lang="ts">
	let {
		isMine,
		number,
		isGameOver,
		onGameOver,
		isRevealed: propIsRevealed,
		onReveal
	} = $props<{
		isMine: boolean;
		number: number;
		isGameOver: boolean;
		onGameOver: () => void;
		isRevealed: boolean;
		onReveal: () => void;
	}>();

	let isFlagged = $state(false);
	let isExploded = $state(false);

	function rightClick(e: MouseEvent) {
		e.preventDefault();
		// if (propIsRevealed || isGameOver) return;
		isFlagged = !isFlagged;
	}

	function handleClick(e: MouseEvent) {
		if (e.button === 2) {
			// Right click
			rightClick(e);
			return;
		}

		if (isFlagged || propIsRevealed) return;

		if (isMine) {
			isExploded = true;
			onGameOver();
		} else {
			onReveal();
		}
	}
</script>

<button
	aria-label="Minesweeper block"
	onmousedown={(e) => {
		if (e.button === 2) rightClick(e);
	}}
	oncontextmenu={(e) => e.preventDefault()}
	onclick={(e) => {
		if (e.button !== 2) handleClick(e);
	}}
	class="aspect-square items-center justify-center overflow-hidden
	{propIsRevealed
		? 'border-2 border-gray-800 bg-gray-600'
		: 'border-b-4 border-l-4 border-r-4 border-t-4 border-gray-200 border-b-gray-600 border-r-gray-600 bg-gray-400'}
	{isExploded ? 'border border-gray-800 bg-red-500' : ''}"
>
	{#if propIsRevealed || (isGameOver && isMine)}
		{#if isFlagged}
			<span class="max-[320px]:text-xs sm:text-2xl">🚧</span>
		{:else if isExploded}
			<span class="max-[320px]:text-xs sm:text-2xl">💣</span>
		{:else if isMine}
			<span class="max-[320px]:text-xs sm:text-2xl">💣</span>
		{:else if number > 0}
			<span class="max-[320px]:text-xs sm:text-2xl">{number}</span>
		{/if}
	{:else if isFlagged}
		<span class="max-[320px]:text-xs sm:text-2xl">🚧</span>
	{/if}
</button>
