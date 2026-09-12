<script lang="ts">
	import { cn } from '$lib/utils';
	import { MicroLabel } from '$lib/components/primitives';
	import type { Preview } from '$lib/preview.svelte';

	let {
		preview = null,
		class: className
	}: {
		preview?: Preview;
		class?: string;
	} = $props();
</script>

<article
	class={cn(
		'reading-pane flex min-h-0 flex-1 flex-col overflow-y-auto pt-[calc(var(--grid)*2)] pr-[calc(var(--grid)*2)] pb-[var(--grid)] pl-[var(--grid)]',
		className
	)}
>
	{#if preview}
		<div class="flex min-w-0 flex-col">
			{#if preview.eyebrow}
				<MicroLabel>{preview.eyebrow}</MicroLabel>
			{/if}
			{#if preview.title}
				<p class="ink-h4 mt-[var(--hair)]">{preview.title}</p>
			{/if}
			{#if preview.thumbnail}
				<img src={preview.thumbnail} alt="" class="mt-[var(--grid)] w-full object-cover" />
			{/if}
			{#if preview.description}
				<p class="ink-row-desc mt-[var(--grid)]">{preview.description}</p>
			{/if}
		</div>
	{:else}
		<p class="ink-row-desc">Hover a row or a link to preview.</p>
	{/if}
</article>
