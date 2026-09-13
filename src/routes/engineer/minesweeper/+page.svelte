<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import Minesweeper from './Minesweeper.svelte';
</script>

<SeoHead
	title="Quang | Minesweeper"
	description="A minesweeper game built with SvelteKit and TailwindCSS."
	canonical="https://quang.design/engineer/minesweeper"
/>

<div
	class="flex flex-col px-[var(--grid)] md:grid md:min-h-full md:grid-cols-2 md:content-start md:gap-x-[calc(var(--grid)*2)]"
>
	<div class="ink-read space-y-[var(--grid)] py-[var(--grid)]">
		<h1 class="ink-display uppercase">Welcome to Minesweeper</h1>
		<p>A simple minesweeper game built with SvelteKit and TailwindCSS.</p>
		<p>Click on a cell to reveal what's underneath. If it's a mine, you lose!</p>
		<p>Otherwise, keep going until you've revealed all the cells that aren't mines.</p>
	</div>
	<div class="ink-read pt-0 pb-[var(--grid)] md:py-[var(--grid)]">
		<Minesweeper />
	</div>
</div>
