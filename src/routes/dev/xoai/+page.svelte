<script lang="ts">
	import Xoai from './Xoai.svelte';
</script>

<svelte:head>
	<title>Quang | XOAI</title>
	<meta
		name="description"
		content="Welcome to XOAI - a simple Tic Tac Toe AI game built with SvelteKit and TailwindCSS."
	/>
</svelte:head>

<section class="max-w-sm">
	<h1 class="uppercase">Welcome to XOAI</h1>
	<br />
	<p>Let's play Tic Tac Toe with an AI and see how it goes.</p>
	<br />
	<p>You know the rules, right?</p>
	<br />
	<Xoai />
</section>
