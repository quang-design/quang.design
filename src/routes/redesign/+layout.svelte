<script lang="ts">
	import '$lib/styles/atlas.css';

	let { children } = $props();
</script>

<div class="atlas min-h-screen">
	{@render children()}
</div>
