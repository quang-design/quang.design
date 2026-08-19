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
	aria-pressed={active}
	class={cn(
		'atlas-row grow px-3 py-2 text-center',
		active ? 'bg-[var(--ink)] text-[var(--paper)]' : 'atlas-invert',
		className
	)}
>
	{@render children()}
</button>
