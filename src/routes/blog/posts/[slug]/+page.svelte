<script lang="ts">
	import { Markdown } from '$lib/components/markdown/';
	import { generateStructuredData, type SEOData } from '$lib/utils/seo';
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

	// let md = $state(data.md);

	// Generate SEO data
	const seoData: SEOData = {
		title: data.meta.title,
		description: data.meta.description,
		canonical: `https://quang.design/blog/${page.params.slug}`,
		image: data.meta.thumbnail ? `https://quang.design${data.meta.thumbnail}` : undefined,
		type: 'article',
		publishedTime: data.meta.date ? new Date(data.meta.date).toISOString() : undefined,
		author: 'Quang'
	};

	const structuredData = generateStructuredData({
		...seoData,
		url: seoData.canonical!
	});
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<link rel="canonical" href="https://quang.design/blog/{page.params.slug}" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://quang.design/blog/{page.params.slug}" />
	{#if data.meta.thumbnail}
		<meta property="og:image" content="https://quang.design{data.meta.thumbnail}" />
		<meta property="og:image:alt" content={data.meta.title} />
	{/if}
	{#if data.meta.date}
		<meta property="article:published_time" content={new Date(data.meta.date).toISOString()} />
		<meta property="article:author" content="Quang" />
	{/if}

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.meta.title} />
	<meta name="twitter:description" content={data.meta.description} />
	{#if data.meta.thumbnail}
		<meta name="twitter:image" content="https://quang.design{data.meta.thumbnail}" />
		<meta name="twitter:image:alt" content={data.meta.title} />
	{/if}

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${structuredData}</script>`}
</svelte:head>

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
