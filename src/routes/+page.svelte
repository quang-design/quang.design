<script lang="ts">
	import { Markdown } from '$lib/components/markdown';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { pages } from '$lib/seo/copy';
	import content from './content.md?raw';

	const sections = content
		.split(/^## Column\d+\s*/m)
		.filter((section) => section.trim().length)
		.map((section) => section.trim());

	const first = sections[0] ?? '';
	const lead = first.match(/^###[ \t]+(.+)(?:\r?\n)*/);
	const leadHeading = lead?.[1]?.trim() ?? '';
	const leadBody = lead ? first.slice(lead[0].length).trim() : first;
</script>

<SeoHead
	title={pages.home.title}
	description={pages.home.description}
	canonical="https://quang.design"
/>

<div
	class="flex flex-col px-[var(--grid)] md:grid md:min-h-full md:grid-cols-2 md:content-start md:gap-x-[calc(var(--grid)*2)]"
>
	<div class="ink-read py-[var(--grid)] [&_p:last-child]:mb-0">
		<h1 class="sr-only">Quang</h1>
		{#if leadHeading}
			<h2 class="ink-h3 mt-0 mb-[var(--grid)]">{leadHeading}</h2>
		{/if}
		<Markdown md={leadBody} />
	</div>
	<div class="ink-read pt-0 pb-[var(--grid)] md:py-[var(--grid)] [&_h3]:mb-0 [&_h4]:mb-0">
		{#each sections.slice(1) as section, i (section)}
			<Markdown md={section} />
		{/each}
	</div>
</div>
