<script lang="ts">
	import { Markdown } from '$lib/components/markdown';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { page } from '$app/state';
	import PagePreview from '$lib/components/layout/page-preview.svelte';

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

<PagePreview
	value={{
		eyebrow: 'Blog',
		title: data.meta.title,
		subtitle: data.meta.description,
		date: data.meta.date,
		thumbnail: data.meta.thumbnail,
		meta: data.meta.date ? [data.meta.date] : [],
		links: [
			{ label: 'llms.txt', href: `/blog/posts/${page.params.slug}/llms.txt` },
			{ label: 'post.md', href: `/blog/posts/${page.params.slug}/post.md` }
		]
	}}
/>

<div class="flex flex-col">
	<div class="mx-auto w-full max-w-xl p-4">
		<div class="ink-read">
			<Markdown md={data.md} />
		</div>
	</div>
</div>
