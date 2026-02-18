<script lang="ts">
	import { Image } from '@lucide/svelte';
	import type { PostMetadata } from '$lib/content/loader';

	let {
		post,
		hrefPrefix,
		aspectRatio = 'aspect-square'
	}: { post: PostMetadata; hrefPrefix: string; aspectRatio?: string } = $props();
</script>

<a
	href={`${hrefPrefix}/${post.slug}`}
	class="border-foreground/25 group flex flex-col border-[0.5px]"
>
	<div class="{aspectRatio} w-full shrink-0 overflow-hidden">
		{#if post.thumbnail}
			<img
				src={post.thumbnail}
				alt={`Thumbnail for ${post.title}`}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center bg-neutral-700">
				<Image />
			</div>
		{/if}
	</div>
	<div
		class="flex grow flex-col justify-between p-6 group-hover:bg-neutral-50 dark:group-hover:bg-neutral-900"
	>
		<div>
			<h2 class="mb-2 text-2xl font-semibold">
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
	</div>
</a>
