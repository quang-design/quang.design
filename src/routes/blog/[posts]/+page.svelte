<!-- This file renders each individual blog post for reading. Be sure to update the svelte:head below -->
<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let PostContent = $derived(data.PostContent);
</script>

<svelte:head>
	<title>Quang :: {data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
</svelte:head>

<div class="mx-auto max-w-prose py-8">
	{@render PostContent({ metadata: data.meta })}
</div>
