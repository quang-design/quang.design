<script lang="ts">
	import { CircleAlert } from '@lucide/svelte';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import PostCard from '$lib/components/shared/post-card.svelte';
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
	<div
		class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-800 p-12 text-center"
	>
		<CircleAlert />
		<h2 class="text-2xl font-semibold text-white">No Posts Yet</h2>
		<p class="mt-2 text-neutral-400">
			It looks like there are no blog posts available at the moment. Check back soon!
		</p>
	</div>
{/if}
