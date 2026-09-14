<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	import type { Plugin } from 'svelte-exmarkdown';
	import DesignParagraph from './design-paragraph.svelte';
	import DesignImage from './design-image.svelte';
	import { safeHref } from '$lib/utils/safe-href';
	import { cn } from '$lib/utils';

	let { md }: { md: string } = $props();

	const designPlugin: Plugin = {
		renderer: {
			p: DesignParagraph,
			img: DesignImage
		}
	};
</script>

<Markdown {md} plugins={[gfmPlugin(), designPlugin]}>
	{#snippet a(props)}
		{@const { children, href, ...rest } = props}
		{@const attrs = { ...rest, href: safeHref(href) }}
		<a {...attrs} class={cn(rest.class)} target="_blank" rel="noopener noreferrer">
			{@render children?.()}
		</a>
	{/snippet}
</Markdown>
