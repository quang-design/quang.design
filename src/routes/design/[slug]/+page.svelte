<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { DesignMarkdown } from '$lib/components/markdown';
	import { splitDesignContent } from '$lib/utils/design-content';
	import { page } from '$app/state';
	import { Badge } from '$lib/components/ui/badge';
	import { designHeadline } from '$lib/content/headline';

	let {
		data
	}: {
		data: {
			md: string;
			meta: { title: string; description: string; thumbnail: string; date: string };
		};
	} = $props();

	const { introMd, metaParts, galleryMd } = $derived(splitDesignContent(data.md));
	const headline = $derived(designHeadline(data.meta.title, page.params.slug ?? ''));
	const slug = $derived(page.params.slug);
</script>

<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	canonical={`https://quang.design/design/${page.params.slug}`}
	image={data.meta.thumbnail ? data.meta.thumbnail : undefined}
	type="article"
	publishedTime={data.meta.date ? new Date(data.meta.date).toISOString() : undefined}
	author="Quang"
/>

<div class="flex flex-col">
	<div class="grid grid-cols-1 gap-8 px-3 py-8 sm:grid-cols-2">
		<div>
			<h1 class="ink-display mb-4 uppercase">{headline.brand}</h1>
			{#if introMd}
				<div class="ink-read leading-relaxed">
					{#each introMd.split('\n\n') as paragraph (paragraph)}
						<p class="mb-3">{paragraph}</p>
					{/each}
				</div>
			{/if}
		</div>
		<div class="flex flex-col gap-3">
			{#if metaParts.length}
				<div class="flex flex-col gap-1">
					{#each metaParts as part (part)}
						<p>{part}</p>
					{/each}
				</div>
			{/if}
			<div class="flex flex-wrap gap-2">
				<Badge variant="outline" href="/design/{slug}/llms.txt">llms.txt</Badge>
				<Badge variant="outline" href="/design/{slug}/post.md">post.md</Badge>
			</div>
		</div>
	</div>

	{#if galleryMd}
		<div class="flex flex-col gap-2 border-t-[length:var(--hair)] pt-4 md:gap-8">
			<DesignMarkdown md={galleryMd} />
		</div>
	{/if}
</div>
