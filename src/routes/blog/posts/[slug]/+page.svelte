<script lang="ts">
	import { Markdown } from '$lib/components/markdown';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { Badge } from '$lib/components/ui/badge';
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
	canonical={`https://quang.design/blog/posts/${page.params.slug}`}
	image={data.meta.thumbnail ? `https://quang.design${data.meta.thumbnail}` : undefined}
	type="article"
	publishedTime={data.meta.date ? new Date(data.meta.date).toISOString() : undefined}
	author="Quang"
/>

<div class="flex flex-col">
	<div class="mx-auto w-full max-w-xl p-4">
		<div class="mb-4 flex gap-2">
			<Badge variant="outline" href="/blog/posts/{page.params.slug}/llms.txt">llms.txt</Badge>
			<Badge variant="outline" href="/blog/posts/{page.params.slug}/post.md">post.md</Badge>
		</div>
		<h1 class="ink-display mb-2">{data.meta.title}</h1>
		{#if data.meta.date}
			<p class="ink-label mb-4">{data.meta.date}</p>
		{/if}
		<div class="ink-read">
			<Markdown md={data.md} />
		</div>
	</div>
</div>
