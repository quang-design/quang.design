<script lang="ts">
	import { cn } from '$lib/utils';
	import MicroLabel from './micro-label.svelte';

	let {
		label,
		value,
		class: className
	}: { label: string; value: string; class?: string } = $props();
</script>

<div class={cn('flex flex-col gap-1', className)}>
	<MicroLabel>{label}</MicroLabel>
	<span class="leading-none">{value}</span>
</div>
