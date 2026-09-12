<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import Minesweeper from './Minesweeper.svelte';
</script>

<SeoHead
	title="Quang | Minesweeper"
	description="A minesweeper game built with SvelteKit and TailwindCSS."
	canonical="https://quang.design/engineer/minesweeper"
/>

<section class="max-w-[calc(var(--grid)*16)] space-y-[var(--grid)] p-[var(--grid)]">
	<h1 class="ink-display uppercase">Welcome to Minesweeper</h1>
	<p>A simple minesweeper game built with SvelteKit and TailwindCSS.</p>
	<p>Click on a cell to reveal what's underneath. If it's a mine, you lose!</p>
	<p>Otherwise, keep going until you've revealed all the cells that aren't mines.</p>
	<Minesweeper />
</section>
