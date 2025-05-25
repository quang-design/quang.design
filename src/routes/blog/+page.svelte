<script lang="ts">
	import { Image, CircleAlert } from '@lucide/svelte';

	import type { PostMetadata } from './+page.server';

	let { data } = $props<{ data: { posts: PostMetadata[] } }>();

	const posts = $derived(data.posts);
</script>

<svelte:head>
	<title>Blog</title>
	<meta name="description" content="My thoughts on design, development, and more." />
</svelte:head>

<div class="container mx-auto min-h-screen px-4 py-12 font-mono text-neutral-300">
	<h1 class="mb-12 text-center text-5xl font-bold text-white">Blog Posts</h1>

	{#if posts && posts.length > 0}
		<div class="flex w-full flex-col gap-10">
			{#each posts as post (post.slug)}
				<a
					href={`/blog/${post.slug}`}
					class="group flex flex-col overflow-hidden rounded-lg bg-neutral-800 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl md:flex-row"
				>
					<div
						class="aspect-video w-full shrink-0 border-r-[0.5px] border-neutral-700 md:w-1/3 lg:w-2/5 xl:w-1/3"
					>
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
					<div class="flex flex-grow flex-col justify-between p-6">
						<div>
							<h2
								class="mb-2 text-2xl font-semibold text-white transition-colors group-hover:text-sky-400"
							>
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
						<span
							class="mt-auto self-start font-semibold text-sky-500 transition-colors group-hover:text-sky-300"
							>Read more &rarr;</span
						>
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
</div>
