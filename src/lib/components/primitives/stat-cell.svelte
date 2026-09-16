<script lang="ts">
	import { cn } from '$lib/utils';
	import MicroLabel from './micro-label.svelte';

	let {
		label,
		value,
		class: className
	}: { label: string; value: string; class?: string } = $props();
</script>

<div class={cn('flex min-h-0 flex-col overflow-hidden', className)}>
	<MicroLabel class="truncate">{label}</MicroLabel>
	<span class="truncate">{value}</span>
</div>
