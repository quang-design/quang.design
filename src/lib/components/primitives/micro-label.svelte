<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, class: className }: { children: Snippet; class?: string } = $props();
</script>

<span class={['ink-label block', className]} data-slot="label">{@render children()}</span>
