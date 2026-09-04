<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { cn } from '$lib/utils';
	import { KeySlot, Hatch } from '$lib/components/primitives';
	import { PREVIEW_KEY, type Preview, type PreviewState } from '$lib/preview.svelte';

	let {
		code,
		title,
		date,
		description,
		thumbnail,
		placeholder = false,
		href = '#',
		external = false,
		preview: previewData = null,
		icon,
		class: className
	}: {
		code: string;
		title: string;
		date?: string;
		description?: string;
		thumbnail?: string;
		placeholder?: boolean;
		href?: string;
		external?: boolean;
		preview?: Preview;
		icon?: Snippet;
		class?: string;
	} = $props();

	const preview = getContext<PreviewState | undefined>(PREVIEW_KEY);
	const rowClass = $derived(
		cn('ink-invert flex flex-col gap-1 px-3 py-2 sm:flex-row sm:items-center sm:gap-3', className)
	);
	const route = $derived(!external && href.startsWith('/') ? href : null);

	function enter() {
		if (previewData) preview?.setHover(previewData);
	}

	function leave() {
		preview?.clearHover();
	}
</script>

{#snippet body()}
	<KeySlot {code} />
	{#if thumbnail}
		<img src={thumbnail} alt="" width="60" height="40" class="hair h-10 w-[3.75rem] shrink-0 object-cover" />
	{:else if icon}
		<div class="hair flex size-10 shrink-0 items-center justify-center">
			{@render icon()}
		</div>
	{:else if placeholder}
		<Hatch class="hair h-10 w-[3.75rem] shrink-0" />
	{/if}
	<span class="flex min-w-0 grow flex-col gap-0.5">
		<span class="ink-row-title">{title}</span>
		{#if description}<span class="ink-row-desc line-clamp-2">{description}</span>{/if}
	</span>
	{#if date}<span class="ink-row-meta shrink-0 sm:ml-auto">{date}</span>{/if}
{/snippet}

{#if route}
	<a
		href={resolve(route as '/')}
		class={rowClass}
		onmouseenter={enter}
		onmouseleave={leave}
		onfocus={enter}
		onblur={leave}
	>
		{@render body()}
	</a>
{:else if external}
	<a
		{href}
		target="_blank"
		rel="noopener noreferrer"
		class={rowClass}
		onmouseenter={enter}
		onmouseleave={leave}
		onfocus={enter}
		onblur={leave}
	>
		{@render body()}
	</a>
{:else}
	<div class={rowClass} role="presentation" onmouseenter={enter} onmouseleave={leave}>
		{@render body()}
	</div>
{/if}
