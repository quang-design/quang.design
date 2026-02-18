<script lang="ts">
	import { Markdown } from '$lib/components/markdown';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
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
	canonical={`https://quang.design/design/${page.params.slug}`}
	image={data.meta.thumbnail ? `https://quang.design${data.meta.thumbnail}` : undefined}
	type="article"
	publishedTime={data.meta.date ? new Date(data.meta.date).toISOString() : undefined}
	author="Quang"
/>

<div class="flex flex-col">
	<div class="mx-auto w-full max-w-xl p-4">
		<h1 class="mb-2 text-2xl font-bold">{data.meta.title}</h1>
		{#if data.meta.date}
			<p class="mb-4 text-xs text-gray-400">{data.meta.date}</p>
		{/if}
		<Markdown md={data.md} />
	</div>
</div>
