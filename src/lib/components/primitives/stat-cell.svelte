<script lang="ts">
	import { cn } from '$lib/utils';
	import MicroLabel from './micro-label.svelte';

	let {
		label,
		value,
		class: className
	}: { label: string; value: string; class?: string } = $props();
</script>

<div
	class={cn(
		'grid h-full min-h-0 grid-rows-[var(--grid)_var(--grid)] items-end overflow-x-clip',
		className
	)}
>
	<MicroLabel class="truncate">{label}</MicroLabel>
	<span class="min-w-0 overflow-x-clip overflow-y-visible text-ellipsis whitespace-nowrap"
		>{value}</span
	>
</div>
