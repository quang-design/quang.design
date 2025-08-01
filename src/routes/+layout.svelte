<script lang="ts">
	import '../app.css';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import Footer from '$lib/components/shared/footer.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	const themeColors = { light: '#ffffff', dark: '#09090b' };

	onMount(() => {
		const hour = new Date().getHours();
		if (hour >= 6 && hour < 18) setMode('light');
		else setMode('dark');
	});

	injectAnalytics();
</script>

<ModeWatcher defaultMode={'light'} {themeColors} />

<Toaster position="top-center" />

<div class="mx-auto flex min-h-screen max-w-7xl flex-col">
	<Navbar />

	<main class="flex flex-1 flex-col py-4">
		{@render children()}
	</main>

	<Footer />
</div>
