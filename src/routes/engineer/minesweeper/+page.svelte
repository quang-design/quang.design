<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import Minesweeper from './Minesweeper.svelte';
</script>

<SeoHead
	title="Quang | Minesweeper"
	description="A minesweeper game built with SvelteKit and TailwindCSS."
	canonical="https://quang.design/engineer/minesweeper"
/>

<div class="canvas-split">
	<h1 class="ink-h1 uppercase sm:col-start-1">Welcome to Minesweeper</h1>
	<div class="ink-read space-y-[var(--grid)] sm:col-start-1">
		<p>A simple minesweeper game built with SvelteKit and TailwindCSS.</p>
		<p>Click on a cell to reveal what's underneath. If it's a mine, you lose!</p>
		<p>Otherwise, keep going until you've revealed all the cells that aren't mines.</p>
	</div>
	<div class="min-w-0 sm:col-start-2 sm:row-start-2">
		<Minesweeper />
	</div>
</div>
