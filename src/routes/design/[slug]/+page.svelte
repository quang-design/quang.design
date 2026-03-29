<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { DesignMarkdown } from '$lib/components/markdown';
	import { splitDesignContent } from '$lib/utils/design-content';
	import { page } from '$app/state';

	let {
		data
	}: {
		data: {
			md: string;
			meta: { title: string; description: string; thumbnail: string; date: string };
		};
	} = $props();

	const { introMd, metaParts, galleryMd } = $derived(splitDesignContent(data.md));
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
	<div class="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2">
		<div>
			<h1 class="mb-4 text-2xl font-bold">{data.meta.title}</h1>
			{#if introMd}
				<div class="text-foreground/80 leading-relaxed">
					{#each introMd.split('\n\n') as paragraph (paragraph)}
						<p class="mb-3">{paragraph}</p>
					{/each}
				</div>
			{/if}
		</div>
		<div class="text-foreground/60 flex flex-col gap-1 text-sm">
			{#each metaParts as part (part)}
				<p>{part}</p>
			{/each}
		</div>
	</div>

	{#if galleryMd}
		<div class="border-foreground/10 flex flex-col gap-2 border-t-[0.5px] pt-4 md:gap-8">
			<DesignMarkdown md={galleryMd} />
		</div>
	{/if}
</div>
