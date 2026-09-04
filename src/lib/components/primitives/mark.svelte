<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let { children, class: className }: { children: Snippet; class?: string } = $props();
</script>

<mark class={cn('ink-mark', className)}>{@render children()}</mark>
