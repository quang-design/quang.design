<script lang="ts">
	import { type PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let posts = $derived(data.posts);
</script>

<svelte:head>
	<title>Quang | Blog</title>
	<meta name="description" content="A collection of thoughts and ideas." />
</svelte:head>

<div class="mx-auto max-w-prose py-8">
	<h1 class="mb-8 text-3xl font-bold">Blog</h1>

	<ul class="space-y-6">
		{#each posts as post}
			<li class="border-b border-gray-200 pb-6 dark:border-gray-800">
				<a href={`/blog/${post.slug}`} class="block transition-opacity hover:opacity-80">
					<div class="flex gap-4">
						<div class="w-1/3 flex-shrink-0">
							<img src={post.thumbnail} alt={post.title} class="w-full object-cover" />
						</div>
						<div class="flex-grow">
							<h2 class="mb-2 text-xl font-bold">{post.title}</h2>
							{#if post.description}
								<p class="mb-2 text-gray-600 dark:text-gray-400">{post.description}</p>
							{/if}
							<time datetime={post.date} class="text-sm text-gray-500 dark:text-gray-500">
								{new Date(post.date).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</time>
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</div>
