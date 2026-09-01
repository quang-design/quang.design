<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		active = false,
		onclick,
		children,
		class: className
	}: { active?: boolean; onclick?: () => void; children: Snippet; class?: string } = $props();
</script>

<button
	type="button"
	{onclick}
	data-slot="tab"
	aria-pressed={active}
	class={cn(
		'ink-row grow cursor-pointer px-3 py-2 text-center',
		active ? 'bg-[var(--ink)] text-[var(--paper)]' : 'ink-invert',
		className
	)}
>
	{@render children()}
</button>
