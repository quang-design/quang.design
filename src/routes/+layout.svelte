<script lang="ts">
	import '../app.css';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';

	let { children } = $props();

	injectAnalytics();
</script>

<ModeWatcher defaultMode={'dark'} />

<div class="mx-auto flex min-h-screen max-w-7xl flex-col">
	<Navbar />

	<main class="flex-grow">
		{@render children()}
	</main>

	<Footer />
</div>
