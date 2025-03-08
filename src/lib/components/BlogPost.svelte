<script lang="ts">
	// For mdsvex, we need to handle both metadata and children
	// Using the new Svelte 5 runes syntax with proper destructuring
	interface BlogPostProps {
		title?: string;
		date?: string;
		metadata?: {
			title?: string;
			date?: string;
			[key: string]: any;
		};
		children?: any;
	}

	// Destructure props directly with fallback values
	let { title = '', date = '', metadata = {}, children }: BlogPostProps = $props();

	// Derive values from props or metadata when props are not provided
	let derivedTitle = $derived(title || metadata.title || '');
	let derivedDate = $derived(date || metadata.date || '');

	// Format the date for display
	let formattedDate = $derived(
		derivedDate
			? new Date(derivedDate).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})
			: ''
	);
</script>

<article class="mx-auto max-w-prose space-y-6">
	<header class="mb-8">
		<h1 class="mb-4 text-2xl font-bold">{derivedTitle}</h1>
		{#if derivedDate}
			<time datetime={derivedDate} class="text-gray-600 dark:text-gray-400">
				{formattedDate}
			</time>
		{/if}
		{#if metadata.thumbnail}
			<img src={metadata.thumbnail} alt={derivedTitle} class="w-full rounded-lg" />
		{/if}
	</header>

	<div class="prose dark:prose-invert prose-blue prose-p:my-4 prose-img:my-6 max-w-none space-y-6">
		{#if children}
			{@render children()}
		{/if}
	</div>
</article>
