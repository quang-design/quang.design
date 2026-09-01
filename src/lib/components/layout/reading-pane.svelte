<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { Tab, MicroLabel } from '$lib/components/primitives';
	import type { Preview } from '$lib/preview.svelte';

	let {
		tabs = [],
		eyebrow,
		title,
		subtitle,
		sections = [],
		preview = null,
		class: className
	}: {
		tabs?: string[];
		eyebrow?: string;
		title?: string;
		subtitle?: string;
		sections?: { label: string; body: Snippet }[];
		preview?: Preview;
		class?: string;
	} = $props();

	let activeTab = $state(0);

	const shown = $derived.by(() => {
		if (preview) {
			return {
				eyebrow: preview.eyebrow,
				title: preview.title,
				subtitle: preview.subtitle ?? preview.date,
				description: preview.description,
				thumbnail: preview.thumbnail,
				meta: preview.meta ?? [],
				links: preview.links ?? []
			};
		}
		return {
			eyebrow,
			title,
			subtitle,
			description: undefined as string | undefined,
			thumbnail: undefined as string | undefined,
			meta: [] as string[],
			links: [] as { label: string; href: string }[]
		};
	});

	const visibleSections = $derived(
		tabs.length ? sections.filter((_, i) => i === activeTab) : sections
	);
</script>

<article class={cn('flex flex-col', className)}>
	{#if tabs.length}
		<div class="rule-b flex flex-wrap">
			{#each tabs as tab, i (tab)}
				<Tab active={i === activeTab} onclick={() => (activeTab = i)}>{tab}</Tab>
			{/each}
		</div>
	{/if}
	<div class="flex flex-col gap-3 px-3 py-3">
		{#if shown.eyebrow}<MicroLabel>{shown.eyebrow}</MicroLabel>{/if}
		{#if shown.title}<h1 class="ink-display">{shown.title}</h1>{/if}
		{#if shown.subtitle}<p class="text-muted-foreground">{shown.subtitle}</p>{/if}
		{#if shown.thumbnail}
			<img src={shown.thumbnail} alt="" class="hair aspect-3/2 w-full object-cover" />
		{/if}
		{#if shown.description}
			<p class="ink-read">{shown.description}</p>
		{/if}
		{#if shown.meta.length}
			<section class="flex flex-col gap-1">
				<MicroLabel>Meta</MicroLabel>
				{#each shown.meta as part (part)}
					<p>{part}</p>
				{/each}
			</section>
		{/if}
		{#if shown.links.length}
			<section class="flex flex-wrap gap-2">
				{#each shown.links as link (link.href)}
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						class="hair ink-invert px-2 py-1"
					>
						{link.label}
					</a>
				{/each}
			</section>
		{/if}
		{#each visibleSections as section (section.label)}
			<section class="flex flex-col gap-2">
				<MicroLabel>{section.label}</MicroLabel>
				<div class="ink-read flex flex-col gap-2">{@render section.body()}</div>
			</section>
		{/each}
	</div>
</article>
