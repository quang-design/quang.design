<script lang="ts">
	import { Markdown } from '$lib/components/markdown';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import content from './content.md?raw';

	const sections = content
		.split(/^## Column\d+\s*/m)
		.filter((section) => section.trim().length)
		.map((section) => section.trim());
</script>

<SeoHead
	title="Quang | Home"
	description="A Vietnamese graphic designer with passion to build things."
	canonical="https://quang.design"
/>

<div
	class="flex flex-col md:grid md:min-h-full md:grid-cols-2 md:content-start md:gap-x-[calc(var(--grid)*2)]"
>
	<div
		class="ink-read border-[var(--ink-25)] px-3 py-[var(--grid)] md:border-r-[length:var(--hair)] [&_p:last-child]:mb-0"
	>
		<Markdown md={sections[0] ?? ''} />
	</div>
	<div class="ink-read px-3 pt-0 pb-[var(--grid)] md:py-[var(--grid)] [&_h3]:mb-0 [&_h4]:mb-0">
		{#each sections.slice(1) as section, i (i)}
			<Markdown md={section} />
		{/each}
	</div>
</div>
