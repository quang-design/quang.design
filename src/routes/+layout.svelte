<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { Navbar, HorizontalDivider } from '$components';
</script>

<svelte:head>
	<title>Quang | Design + Build</title>
	<meta name="description" content="A Vietnamese graphic designer with passion to build things." />
</svelte:head>

<main class="p-4">
	<Navbar />
	<HorizontalDivider />
	{@render children()}
</main>
