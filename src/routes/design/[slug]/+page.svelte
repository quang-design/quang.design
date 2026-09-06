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
	<div class="flex flex-col px-3 py-[var(--grid)]">
		<div class="mb-[var(--grid)] flex h-[var(--grid)] flex-wrap items-center gap-2">
			<Badge variant="outline" href="/design/{slug}/llms.txt">llms.txt</Badge>
			<Badge variant="outline" href="/design/{slug}/post.md">post.md</Badge>
		</div>
		<h1 class="ink-h1 uppercase">{headline.brand}</h1>
		<div class="grid grid-cols-1 items-start sm:grid-cols-2">
			<div>
				{#if introMd}
					{#each introMd.split('\n\n') as paragraph (paragraph)}
						<p class="m-0 text-base leading-[var(--grid)]">{paragraph}</p>
					{/each}
				{/if}
			</div>
			<div>
				{#each metaParts as part (part)}
					<p class="m-0 text-base leading-[var(--grid)]">{part}</p>
				{/each}
			</div>
		</div>
	</div>

	{#if galleryMd}
		<div class="flex flex-col border-t-[length:var(--hair)]">
			<DesignMarkdown md={galleryMd} />
		</div>
	{/if}
</div>
