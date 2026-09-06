<script lang="ts">
	import { cn } from '$lib/utils';
	import MicroLabel from './micro-label.svelte';

	let {
		label,
		value,
		class: className
	}: { label: string; value: string; class?: string } = $props();
</script>

<div class={cn('flex flex-col', className)}>
	<MicroLabel>{label}</MicroLabel>
	<span>{value}</span>
</div>
