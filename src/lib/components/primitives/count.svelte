<script lang="ts">
	import { cn } from '$lib/utils';

	let { value, class: className }: { value: number; class?: string } = $props();
</script>

<span class={cn('ink-label shrink-0 tabular-nums', className)}>{value}</span>
