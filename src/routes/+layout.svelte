<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { Navbar, HorizontalDivider } from '$components';
</script>

<main class="h-full min-h-screen max-w-md border-r border-gray-600 p-4 pb-12">
	<Navbar />
	<HorizontalDivider />
	{@render children()}
</main>
