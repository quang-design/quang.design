<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		glyph,
		onclick,
		children,
		class: className
	}: { glyph?: string; onclick?: () => void; children: Snippet; class?: string } = $props();
</script>

<button
	type="button"
	{onclick}
	data-slot="button"
	class={cn(
		'hair ink-row ink-invert flex h-8 cursor-pointer items-center gap-2 px-3',
		className
	)}
>
	{#if glyph}<span aria-hidden="true">{glyph}</span>{/if}
	{@render children()}
</button>
