<script lang="ts">
	import { Markdown } from '$lib/components/markdown';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import content from './content.md?raw';

	// Split out each column section and drop the "ColumnX" headings
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

<div class="w-full">
	<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
		{#each sections as section}
			<div class="prose max-w-none">
				<Markdown md={section} />
			</div>
		{/each}
	</div>
</div>
