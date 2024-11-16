<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { Navbar, HorizontalDivider } from '$components';
</script>

<main class="max-w-xs p-4">
	<Navbar />
	<HorizontalDivider />
	{@render children()}
</main>
