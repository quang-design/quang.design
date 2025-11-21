<script lang="ts">
	import { Image, CircleAlert } from '@lucide/svelte';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import type { PostMetadata } from './+page.server';

	let { data } = $props<{ data: { posts: PostMetadata[] } }>();

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
			<a
				href={`/blog/posts/${post.slug}`}
				class="border-foreground/25 flex flex-col border-[0.5px]"
			>
				<div class="aspect-square w-full shrink-0">
					{#if post.thumbnail}
						<img
							src={post.thumbnail}
							alt={`Thumbnail for ${post.title}`}
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
						/>
					{:else}
						<div class="flex h-full w-full items-center justify-center bg-neutral-700">
							<Image />
						</div>
					{/if}
				</div>
				<div class="flex grow flex-col justify-between p-6">
					<div>
						<h2 class="mb-2 text-2xl font-semibold transition-colors group-hover:text-sky-400">
							{post.title}
						</h2>
						{#if post.date}
							<p class="mb-3 text-sm text-neutral-400">
								{new Date(post.date).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</p>
						{/if}
						<p class="mb-4 line-clamp-3 text-neutral-400 md:line-clamp-4 lg:line-clamp-3">
							{post.description}
						</p>
					</div>
					<span class="mt-auto self-start font-semibold text-sky-500">Read more &rarr;</span>
				</div>
			</a>
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
