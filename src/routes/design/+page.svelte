<script lang="ts">
	import { CircleAlert } from '@lucide/svelte';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import PostCard from '$lib/components/shared/post-card.svelte';
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
	<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each posts as post (post.slug)}
			<PostCard {post} hrefPrefix="/design" />
		{/each}
	</div>
{:else}
	<div
		class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-800 p-12 text-center"
	>
		<CircleAlert />
		<h2 class="text-2xl font-semibold text-white">No Design Work Yet</h2>
		<p class="mt-2 text-neutral-400">Design work will be showcased here soon. Check back later!</p>
	</div>
{/if}
