<script lang="ts">
	import { Markdown } from '$lib/components/markdown';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { ArrowUpRight } from '@lucide/svelte';
	import { page } from '$app/state';

	let {
		data
	}: {
		data: {
			md: string;
			meta: { title: string; description: string; thumbnail: string; date: string };
		};
	} = $props();
</script>

<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	canonical="https://quang.design/blog/{page.params.slug}"
	image={data.meta.thumbnail ? `https://quang.design${data.meta.thumbnail}` : undefined}
	type="article"
	publishedTime={data.meta.date ? new Date(data.meta.date).toISOString() : undefined}
	author="Quang"
/>

<div class="flex flex-col">
	<div class="mx-auto w-full max-w-xl p-4">
		<div class="mb-4 flex">
			<a href="/blog/posts/{page.params.slug}/llms.txt" target="_blank" rel="noopener noreferrer">
				<Badge variant="outline" class="cursor-pointer gap-1 text-xs hover:bg-gray-50" data-badge>
					llms.txt
					<ArrowUpRight size={12} />
				</Badge>
			</a>
		</div>
		<h1 class="mb-2 text-2xl font-bold">{data.meta.title}</h1>
		{#if data.meta.date}
			<p class="mb-4 text-xs text-gray-400">{data.meta.date}</p>
		{/if}
		<Markdown md={data.md} />
	</div>
</div>
