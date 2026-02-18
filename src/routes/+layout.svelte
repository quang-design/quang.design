<script lang="ts">
	import '../app.css';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import Footer from '$lib/components/shared/footer.svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { onMount } from 'svelte';
	import { getSkyGradient } from '$lib/utils/sky';

	let { children } = $props();

	const themeColors = { light: '#ffffff', dark: '#09090b' };

	let now = new SvelteDate();

	// Tick every minute — sky colours shift imperceptibly between ticks
	$effect(() => {
		const interval = setInterval(() => now.setTime(Date.now()), 60_000);
		return () => clearInterval(interval);
	});

	let skyGradient = $derived(getSkyGradient(now));

	onMount(() => {
		const hour = new Date().getHours();
		if (hour >= 6 && hour < 18) setMode('light');
		else setMode('dark');
	});

	injectAnalytics();
	injectSpeedInsights();
</script>

<ModeWatcher defaultMode={'light'} {themeColors} />

<Toaster position="top-center" />

<!-- Full-viewport sky gradient, fixed so it stays put while scrolling -->
<div class="fixed inset-0 -z-10" style="background: {skyGradient}"></div>

<div class="mx-auto flex min-h-screen max-w-7xl flex-col">
	<Navbar />

	<main class="flex flex-1 flex-col py-4">
		{@render children()}
	</main>

	<Footer />
</div>
