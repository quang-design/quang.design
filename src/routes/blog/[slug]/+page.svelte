<script lang="ts">
	import { Markdown } from '$lib/components/markdown/';
	let {
		data
	}: {
		data: {
			md: string;
			meta: { title: string; description: string; thumbnail: string; date: string };
		};
	} = $props();

	let md = $state(data.md);
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	{#if data.meta.thumbnail}
		<meta property="og:image" content={data.meta.thumbnail} />
		<meta name="twitter:image" content={data.meta.thumbnail} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="flex min-h-screen flex-col font-mono text-base">
	<div class="mx-auto w-full max-w-xl flex-1 p-4">
		<h1 class="mb-2 text-2xl font-bold">{data.meta.title}</h1>
		{#if data.meta.date}
			<p class="mb-4 text-xs text-gray-400">{data.meta.date}</p>
		{/if}
		<Markdown {md} />
	</div>
</div>
