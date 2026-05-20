<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import PostCard from '$lib/components/shared/post-card.svelte';
	import EmptyState from '$lib/components/shared/empty-state.svelte';
	import type { PostMetadata } from './+page.server';

	let { data }: { data: { posts: PostMetadata[] } } = $props();

	const posts = $derived(data.posts);
</script>

<SeoHead
	title="Blog"
	description="My thoughts on design, development, and more."
	canonical="https://quang.design/blog"
/>

<h1 class="mb-12 text-center text-2xl font-bold">Blog Posts</h1>

{#if posts && posts.length > 0}
	<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each posts as post (post.slug)}
			<PostCard {post} hrefPrefix="/blog/posts" />
		{/each}
	</div>
{:else}
	<EmptyState
		title="No Posts Yet"
		description="It looks like there are no blog posts available at the moment. Check back soon!"
	/>
{/if}
