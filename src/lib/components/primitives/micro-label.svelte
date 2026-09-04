<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let { children, class: className }: { children: Snippet; class?: string } = $props();
</script>

<span class={cn('ink-label block', className)} data-slot="label">{@render children()}</span>
