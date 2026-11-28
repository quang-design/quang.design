<script lang="ts">
	import { page } from '$app/state';
	import { Heading } from '$lib/components/primitives';
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

<Heading level={1} text={String(page.status)} />
<p>{page.error?.message}</p>
