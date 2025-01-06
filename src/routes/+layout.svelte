<script lang="ts">
	import '../app.css';
	import { Navbar, HorizontalDivider } from '$components';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	let { children } = $props();

	injectAnalytics();
</script>

<main class="h-full min-h-screen max-w-md border-r border-gray-600 p-4 pb-12">
	<Navbar />
	<HorizontalDivider />
	{@render children()}
</main>
