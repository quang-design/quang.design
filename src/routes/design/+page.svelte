<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import EmptyState from '$lib/components/shared/empty-state.svelte';
	import { IndexRow } from '$lib/components/layout';
	import { designHeadline } from '$lib/content/headline';
	import type { PostMetadata } from './+page.server';

	let { data }: { data: { posts: PostMetadata[] } } = $props();

	const posts = $derived(data.posts);
</script>

<SeoHead
	title="Design"
	description="A collection of my design work."
	canonical="https://quang.design/design"
/>

{#if posts && posts.length > 0}
	<div class="stack stack-flush flex flex-col">
		{#each posts as post, i (post.slug)}
			{@const headline = designHeadline(post.title, post.slug)}
			<IndexRow
				code="D{i + 1}"
				title={headline.brand}
				description={headline.line}
				date={post.date}
				thumbnail={post.thumbnail}
				placeholder={!post.thumbnail}
				href="/design/{post.slug}"
				display
				preview={{
					eyebrow: 'Design',
					title: headline.brand,
					subtitle: headline.line,
					description: post.description,
					date: post.date,
					thumbnail: post.thumbnail,
					href: `/design/${post.slug}`
				}}
			/>
		{/each}
	</div>
{:else}
	<div class="p-3">
		<EmptyState
			title="No Design Work Yet"
			description="Design work will be showcased here soon. Check back later!"
		/>
	</div>
{/if}
