<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import { page } from '$app/state';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Shell from '$lib/components/layout/shell.svelte';
	import type { EngineerProject } from '$lib/content/engineer';
	import type { PostMetadata } from '$lib/content/loader';

	let {
		children,
		data
	}: {
		children: import('svelte').Snippet;
		data: { nav: { design: PostMetadata[]; blog: PostMetadata[]; engineer: EngineerProject[] } };
	} = $props();

	const themeColors = { light: '#d4c4a0', dark: '#1a1610' };

	const fullBleed = $derived(page.url.pathname.startsWith('/anh-nhi'));
	const catalog = $derived(page.url.pathname.startsWith('/redesign'));

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
{:else if catalog}
	<div class="site px-4 py-4">{@render children()}</div>
{:else}
	<div class="site">
		<Shell nav={data.nav}>
			{@render children()}
		</Shell>
	</div>
{/if}
