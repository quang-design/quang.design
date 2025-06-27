<script lang="ts">
	import '../app.css';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	injectAnalytics();

	onMount(() => {
		const hour = new Date().getHours();
		if (hour >= 6 && hour < 18) setMode('light');
		else setMode('dark');
	});
</script>

<ModeWatcher defaultMode={'light'} />

<div class="mx-auto flex min-h-screen max-w-7xl flex-col">
	<Navbar />

	<main class="flex-grow py-4">
		{@render children()}
	</main>

	<Footer />
</div>
