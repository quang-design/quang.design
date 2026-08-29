<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import { page } from '$app/state';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import Footer from '$lib/components/shared/footer.svelte';

	let { children } = $props();

	const themeColors = { light: '#ffffff', dark: '#09090b' };

	const fullBleed = $derived(
		page.url.pathname.startsWith('/anh-nhi') || page.url.pathname.startsWith('/redesign')
	);

	onMount(() => {
		const hour = new Date().getHours();
		if (hour >= 6 && hour < 18) setMode('light');
		else setMode('dark');
	});

	injectAnalytics();
	injectSpeedInsights();
</script>

<ModeWatcher defaultMode="light" {themeColors} />

<Toaster position="top-center" />

{#if fullBleed}
	{@render children()}
{:else}
	<div class="mx-auto flex min-h-screen max-w-7xl flex-col">
		<Navbar />

		<main class="flex flex-1 flex-col py-4">
			{@render children()}
		</main>

		<Footer />
	</div>
{/if}
