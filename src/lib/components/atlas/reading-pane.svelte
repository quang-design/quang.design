<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { Tab, MicroLabel } from '$lib/components/primitives';

	let {
		tabs = [],
		eyebrow,
		title,
		subtitle,
		sections = [],
		class: className
	}: {
		tabs?: string[];
		eyebrow?: string;
		title: string;
		subtitle?: string;
		sections?: { label: string; body: Snippet }[];
		class?: string;
	} = $props();

	let activeTab = $state(0);
</script>

<article class={cn('flex flex-col', className)}>
	{#if tabs.length}
		<div class="atlas-hair flex border-x-0 border-t-0">
			{#each tabs as tab, i (tab)}
				<Tab active={i === activeTab} onclick={() => (activeTab = i)}>{tab}</Tab>
			{/each}
		</div>
	{/if}
	<div class="flex flex-col gap-4 px-4 py-4">
		{#if eyebrow}<MicroLabel>{eyebrow}</MicroLabel>{/if}
		<h1 class="atlas-display">{title}</h1>
		{#if subtitle}<p class="text-[var(--ink-60)]">{subtitle}</p>{/if}
		{#each sections as section (section.label)}
			<section class="flex flex-col gap-2">
				<MicroLabel>{section.label}</MicroLabel>
				{@render section.body()}
			</section>
		{/each}
	</div>
</article>
