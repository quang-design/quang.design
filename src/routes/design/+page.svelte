<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import PostCard from '$lib/components/shared/post-card.svelte';
	import EmptyState from '$lib/components/shared/empty-state.svelte';
	import type { PostMetadata } from './+page.server';

	let { data }: { data: { posts: PostMetadata[] } } = $props();

	const posts = $derived(data.posts);
</script>

<SeoHead
	title="Design"
	description="A collection of my design work."
	canonical="https://quang.design/design"
/>

<h1 class="mb-12 text-center text-2xl font-bold">Design Work</h1>

{#if posts && posts.length > 0}
	<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
		{#each posts as post (post.slug)}
			<PostCard {post} hrefPrefix="/design" aspectRatio="aspect-3/2" />
		{/each}
	</div>
{:else}
	<EmptyState
		title="No Design Work Yet"
		description="Design work will be showcased here soon. Check back later!"
	/>
{/if}
