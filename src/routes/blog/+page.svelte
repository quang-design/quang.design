<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import EmptyState from '$lib/components/shared/empty-state.svelte';
	import { IndexRow } from '$lib/components/layout';
	import type { PostMetadata } from './+page.server';

	let { data }: { data: { posts: PostMetadata[] } } = $props();

	const posts = $derived(data.posts);
</script>

<SeoHead
	title="Blog"
	description="My thoughts on design, development, and more."
	canonical="https://quang.design/blog"
/>

{#if posts && posts.length > 0}
	<div class="stack stack-flush flex flex-col">
		{#each posts as post, i (post.slug)}
			<IndexRow
				code="B{i + 1}"
				title={post.title}
				date={post.date}
				thumbnail={post.thumbnail}
				placeholder={!post.thumbnail}
				href="/blog/posts/{post.slug}"
				preview={{
					eyebrow: 'Blog',
					title: post.title,
					subtitle: post.date,
					description: post.description,
					date: post.date,
					thumbnail: post.thumbnail,
					href: `/blog/posts/${post.slug}`
				}}
			/>
		{/each}
	</div>
{:else}
	<div class="p-3">
		<EmptyState
			title="No Posts Yet"
			description="It looks like there are no blog posts available at the moment. Check back soon!"
		/>
	</div>
{/if}
