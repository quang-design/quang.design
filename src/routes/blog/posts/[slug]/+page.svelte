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
	<div class="w-full max-w-[calc(var(--grid)*24)] px-[var(--grid)] py-[var(--grid)]">
		<div class="mb-[var(--grid)] flex h-[var(--grid)] flex-wrap items-center gap-[var(--grid)]">
			<Badge
				variant="outline"
				class="min-w-[calc(var(--grid)*5)]"
				href="/blog/posts/{page.params.slug}/llms.txt">llms.txt</Badge
			>
			<Badge
				variant="outline"
				class="min-w-[calc(var(--grid)*5)]"
				href="/blog/posts/{page.params.slug}/post.md">post.md</Badge
			>
		</div>
		<h1 class="ink-h1">{data.meta.title}</h1>
		{#if data.meta.date}
			<p class="ink-label">{data.meta.date}</p>
		{/if}
		<div class="ink-read">
			<Markdown md={data.md} />
		</div>
	</div>
</div>
