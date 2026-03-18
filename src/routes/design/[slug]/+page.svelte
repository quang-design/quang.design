<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import DesignPostHeader from '$lib/components/shared/design-post-header.svelte';
	import DesignPostGallery from '$lib/components/shared/design-post-gallery.svelte';
	import { parseDesignMarkdown, splitDesignBlocks } from '$lib/utils/parse-design-markdown';
	import { page } from '$app/state';

	let {
		data
	}: {
		data: {
			md: string;
			meta: { title: string; description: string; thumbnail: string; date: string };
		};
	} = $props();

	const blocks = $derived(parseDesignMarkdown(data.md));
	const { metaBlock, textBlocks, galleryBlocks } = $derived(splitDesignBlocks(blocks));
</script>

<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	canonical={`https://quang.design/design/${page.params.slug}`}
	image={data.meta.thumbnail ? data.meta.thumbnail : undefined}
	type="article"
	publishedTime={data.meta.date ? new Date(data.meta.date).toISOString() : undefined}
	author="Quang"
/>

<div class="flex flex-col">
	<DesignPostHeader title={data.meta.title} {textBlocks} {metaBlock} />
	<DesignPostGallery blocks={galleryBlocks} />
</div>
