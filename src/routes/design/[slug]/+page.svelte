<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { DesignMarkdown } from '$lib/components/markdown';
	import { splitDesignContent } from '$lib/utils/design-content';
	import { page } from '$app/state';
	import { Badge } from '$lib/components/ui/badge';
	import { designHeadline } from '$lib/content/headline';
	import { designHref } from '$lib/content/slug';
	import { absUrl } from '$lib/config/site';

	let {
		data
	}: {
		data: {
			md: string;
			meta: { title: string; description: string; thumbnail: string; date: string };
		};
	} = $props();

	const { introMd, metaParts, galleryMd } = $derived(splitDesignContent(data.md));
	const href = $derived(designHref(page.params.slug));
	const headline = $derived(designHeadline(data.meta.title, page.params.slug ?? ''));
</script>

<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	canonical={href ? absUrl(href) : undefined}
	image={data.meta.thumbnail ? absUrl(data.meta.thumbnail) : undefined}
	type="article"
	publishedTime={data.meta.date ? new Date(data.meta.date).toISOString() : undefined}
	author="Quang"
/>

<div class="flex flex-col">
	<div class="flex flex-col px-[var(--grid)] py-[var(--grid)]">
		<div class="mb-[var(--grid)] flex h-[var(--grid)] flex-wrap items-center gap-[var(--grid)]">
			{#if href}
				<Badge variant="outline" class="min-w-[calc(var(--grid)*5)]" href="{href}/llms.txt"
					>llms.txt</Badge
				>
				<Badge variant="outline" class="min-w-[calc(var(--grid)*5)]" href="{href}/post.md"
					>post.md</Badge
				>
			{/if}
		</div>
		<h1 class="ink-h1 uppercase">{headline.brand}</h1>
		<div
			class="grid grid-cols-1 items-start gap-[var(--grid)] sm:grid-cols-2 sm:gap-x-[calc(var(--grid)*2)]"
		>
			<div class="flex min-w-0 flex-col gap-[var(--grid)]">
				{#if introMd}
					{#each introMd.split('\n\n') as paragraph (paragraph)}
						<p class="m-0 text-base leading-[var(--grid)]">{paragraph}</p>
					{/each}
				{/if}
			</div>
			<div class="min-w-0">
				{#each metaParts as part (part)}
					<p class="m-0 text-base leading-[var(--grid)]">{part}</p>
				{/each}
			</div>
		</div>
	</div>

	{#if galleryMd}
		<div class="gallery flex flex-col">
			<DesignMarkdown md={galleryMd} />
		</div>
	{/if}
</div>
