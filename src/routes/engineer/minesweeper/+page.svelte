<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import Minesweeper from './Minesweeper.svelte';
</script>

<SeoHead
	title="Quang | Minesweeper"
	description="A minesweeper game built with SvelteKit and TailwindCSS."
	canonical="https://quang.design/engineer/minesweeper"
/>

<div class="flex flex-col px-[var(--grid)] py-[var(--grid)]">
	<h1 class="ink-h1 uppercase">Welcome to Minesweeper</h1>
	<div
		class="grid grid-cols-1 items-start gap-[var(--grid)] sm:grid-cols-2 sm:gap-x-[calc(var(--grid)*2)]"
	>
		<div class="ink-read space-y-[var(--grid)]">
			<p>A simple minesweeper game built with SvelteKit and TailwindCSS.</p>
			<p>Click on a cell to reveal what's underneath. If it's a mine, you lose!</p>
			<p>Otherwise, keep going until you've revealed all the cells that aren't mines.</p>
		</div>
		<div class="min-w-0">
			<Minesweeper />
		</div>
	</div>
</div>
