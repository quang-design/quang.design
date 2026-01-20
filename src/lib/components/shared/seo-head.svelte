<script lang="ts">
	import { generateStructuredData, type SEOData } from '$lib/utils/seo';

	let {
		title,
		description,
		canonical,
		image,
		type = 'website',
		publishedTime,
		modifiedTime,
		author,
		tags
	}: SEOData = $props();

	const structuredData = $derived(
		generateStructuredData({
			title,
			description,
			canonical,
			image,
			type,
			publishedTime,
			modifiedTime,
			author,
			tags,
			url: canonical || ''
		})
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	{#if canonical}
		<meta property="og:url" content={canonical} />
	{/if}
	{#if image}
		<meta property="og:image" content={image} />
		<meta property="og:image:alt" content={title} />
	{/if}
	{#if type === 'article' && publishedTime}
		<meta property="article:published_time" content={publishedTime} />
		{#if modifiedTime}
			<meta property="article:modified_time" content={modifiedTime} />
		{/if}
		{#if author}
			<meta property="article:author" content={author} />
		{/if}
	{/if}

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if image}
		<meta name="twitter:image" content={image} />
		<meta name="twitter:image:alt" content={title} />
	{/if}

	<!-- Structured Data -->
	{#if canonical}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<${'script'} type="application/ld+json">${structuredData}</${'script'}>`}
	{/if}
</svelte:head>
