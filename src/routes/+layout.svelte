<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { ModeWatcher, setMode } from 'mode-watcher';
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

<div class="site">
	<Shell nav={data.nav}>
		{@render children()}
	</Shell>
</div>
