<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { cn } from '$lib/utils';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
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
		thumb = 'square',
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
		thumb?: 'square' | 'wide';
		class?: string;
	} = $props();

	const preview = getContext<PreviewState | undefined>(PREVIEW_KEY);
	const thumbClass = $derived(
		thumb === 'wide'
			? 'hair h-[calc(var(--grid)*2)] w-[calc(var(--grid)*3)] shrink-0 object-cover'
			: 'hair size-[calc(var(--grid)*2)] shrink-0 object-cover'
	);
	const thumbSize = $derived(
		thumb === 'wide' ? { width: 72, height: 48 } : { width: 48, height: 48 }
	);
	const rowClass = $derived(
		cn(
			'ink-invert flex min-h-[calc(var(--grid)*2)] items-center gap-3 pl-3',
			external ? 'pr-0' : 'pr-3',
			className
		)
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
		<img
			src={thumbnail}
			alt=""
			width={thumbSize.width}
			height={thumbSize.height}
			class={thumbClass}
		/>
	{:else if icon}
		<div class="hair flex size-[calc(var(--grid)*2)] shrink-0 items-center justify-center">
			{@render icon()}
		</div>
	{:else if placeholder}
		<Hatch
			class={thumb === 'wide'
				? 'hair h-[calc(var(--grid)*2)] w-[calc(var(--grid)*3)] shrink-0'
				: 'hair size-[calc(var(--grid)*2)] shrink-0'}
		/>
	{/if}
	<span class="flex min-w-0 grow flex-col">
		<span class="ink-row-title truncate">{title}</span>
		{#if description}<span class="ink-row-desc line-clamp-1">{description}</span>{/if}
	</span>
	{#if date}<span class="ink-row-meta shrink-0">{date}</span>{/if}
	{#if external}
		<span
			class="hair flex size-[calc(var(--grid)*2)] shrink-0 items-center justify-center"
			aria-hidden="true"
		>
			<ArrowUpRightIcon class="size-4" />
		</span>
	{/if}
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
