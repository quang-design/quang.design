<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		glyph = '\u25b6',
		onclick,
		children,
		class: className
	}: { glyph?: string; onclick?: () => void; children: Snippet; class?: string } = $props();
</script>

<button
	type="button"
	{onclick}
	class={cn('atlas-hair atlas-row atlas-invert flex items-center gap-2 px-3 py-1.5', className)}
>
	<span aria-hidden="true">{glyph}</span>
	{@render children()}
</button>
