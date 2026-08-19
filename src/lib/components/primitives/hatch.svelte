<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let { children, class: className }: { children?: Snippet; class?: string } = $props();
</script>

<div class={cn('atlas-hatch atlas-hair', className)}>{@render children?.()}</div>
