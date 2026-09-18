<script lang="ts">
	import { Markdown } from '$lib/components/markdown';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import content from './content.md?raw';

	const sections = content
		.split(/^## Column\d+\s*/m)
		.filter((section) => section.trim().length)
		.map((section) => section.trim());

	const intro = sections[0] ?? '';
	const match = intro.match(/^(#{1,6} .+)\n+([\s\S]*)$/);
	const title = match?.[1] ?? '';
	const body = match?.[2] ?? intro;
</script>

<SeoHead
	title="Quang | Home"
	description="A Vietnamese graphic designer with passion to build things."
	canonical="https://quang.design"
/>

<div
	class="flex flex-col px-[var(--grid)] md:grid md:min-h-full md:grid-cols-2 md:content-start md:gap-x-[calc(var(--grid)*2)]"
>
	<div class="ink-read pt-[var(--grid)] md:col-start-1">
		<h1 class="sr-only">Quang</h1>
		{#if title}
			<Markdown md={title} />
		{/if}
	</div>
	<div class="ink-read pb-[var(--grid)] md:col-start-1 [&_p:last-child]:mb-0">
		<Markdown md={body} />
	</div>
	<div class="ink-read pt-0 pb-[var(--grid)] md:col-start-2 md:row-start-2 [&_h3]:mb-0 [&_h4]:mb-0">
		{#each sections.slice(1) as section (section)}
			<Markdown md={section} />
		{/each}
	</div>
</div>
