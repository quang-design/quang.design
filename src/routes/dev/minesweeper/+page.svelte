<script lang="ts">
	import Minesweeper from './Minesweeper.svelte';
</script>

<svelte:head>
	<title>Quang | Minesweeper</title>
	<meta name="description" content="A minesweeper game built with SvelteKit and TailwindCSS." />
</svelte:head>

<section class="max-w-sm">
	<h1 class="uppercase">Welcome to Minesweeper</h1>
	<br />
	<p>A simple minesweeper game built with SvelteKit and TailwindCSS.</p>
	<br />
	<p>
		Click on a cell to reveal what's underneath. If it's a mine, you lose! Otherwise, keep going
		until you've revealed all the cells that aren't mines.
	</p>
	<br />
	<Minesweeper />
</section>
