<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from '@ui-sdk/svelte/button';

	let {
		glyph,
		onclick,
		disabled = false,
		children,
		class: className
	}: {
		glyph?: string;
		onclick?: () => void;
		disabled?: boolean;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<Button
	{onclick}
	{disabled}
	class={[
		'hair ink-row ink-invert flex h-[var(--grid)] cursor-pointer items-center gap-2 px-3 disabled:pointer-events-none disabled:opacity-40',
		className
	]}
>
	{#if glyph}<span aria-hidden="true">{glyph}</span>{/if}
	{@render children()}
</Button>
