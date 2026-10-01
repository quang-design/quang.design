<script lang="ts">
	import { shareImageUrl } from '$lib/og/url';
	import { SHARE_HEIGHT, SHARE_WIDTH } from '$lib/og/size';
	import { documentTitle, searchDescription, siteName } from '$lib/seo/copy';
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

	const pageTitle = $derived(documentTitle(title));
	const pageDescription = $derived(searchDescription(description));

	const social = $derived.by(() => {
		if (canonical) {
			const src = shareImageUrl(canonical);
			if (src) return { src, sized: true };
		}
		return image ? { src: image, sized: false } : undefined;
	});

	const structuredData = $derived(
		generateStructuredData({
			title: pageTitle,
			description: pageDescription,
			canonical,
			image: image ?? social?.src,
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
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}

	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="en_US" />
	{#if canonical}
		<meta property="og:url" content={canonical} />
	{/if}
	{#if social}
		<meta property="og:image" content={social.src} />
		<meta property="og:image:alt" content={pageTitle} />
		{#if social.sized}
			<meta property="og:image:type" content="image/png" />
			<meta property="og:image:width" content={String(SHARE_WIDTH)} />
			<meta property="og:image:height" content={String(SHARE_HEIGHT)} />
		{/if}
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

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	{#if social}
		<meta name="twitter:image" content={social.src} />
		<meta name="twitter:image:alt" content={pageTitle} />
	{/if}

	{#if canonical}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<${'script'} type="application/ld+json">${structuredData}</${'script'}>`}
	{/if}
</svelte:head>
