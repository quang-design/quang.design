<!-- This file renders each individual blog post for reading. Be sure to update the svelte:head below -->
<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	// The content is automatically rendered by mdsvex through the layout
</script>

<!-- Content is automatically rendered by mdsvex through the layout in svelte.config.js -->

<svelte:head>
	<title>Quang :: {data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
</svelte:head>
