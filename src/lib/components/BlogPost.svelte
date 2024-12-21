<script lang="ts">
	let { title, date, children } = $props();
</script>

<article class="mx-auto max-w-prose">
	<header class="mb-8">
		<h1 class="mb-4 text-2xl font-bold">{title}</h1>
		{#if date}
			<time datetime={date} class="text-gray-600 dark:text-gray-400">
				{new Date(date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</time>
		{/if}
	</header>

	<div class="prose dark:prose-invert prose-blue max-w-none">
		{@render children()}
	</div>
</article>
