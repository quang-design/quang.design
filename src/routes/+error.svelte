<script lang="ts">
	import { page } from '$app/state';
	import { documentTitle } from '$lib/seo/copy';

	const title = $derived(page.status === 404 ? 'Page not found' : 'Something went wrong');
	const description = $derived(
		page.status === 404
			? 'This address is not a page on quang.design.'
			: 'This page could not be loaded on quang.design.'
	);
</script>

<svelte:head>
	<title>{documentTitle(title)}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="noindex" />
</svelte:head>

<h1>{page.status}</h1>
<p>{page.error?.message}</p>
