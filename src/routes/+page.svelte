<script lang="ts">
	import { getContext } from 'svelte';
	import { Markdown } from '$lib/components/markdown';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { PREVIEW_KEY, type PreviewState } from '$lib/preview.svelte';
	import content from './content.md?raw';

	const sections = content
		.split(/^## Column\d+\s*/m)
		.filter((section) => section.trim().length)
		.map((section) => section.trim());

	const preview = getContext<PreviewState | undefined>(PREVIEW_KEY);

	function onOver(event: MouseEvent) {
		const a = (event.target as HTMLElement | null)?.closest?.('a');
		if (!a) return;
		const href = a.getAttribute('href') ?? '';
		preview?.setHover({
			eyebrow: 'Link',
			title: a.textContent?.trim() || href,
			subtitle: href,
			href
		});
	}

	function onOut(event: MouseEvent) {
		const related = event.relatedTarget as HTMLElement | null;
		if (related?.closest?.('a')) return;
		preview?.clearHover();
	}
</script>

<SeoHead
	title="Quang | Home"
	description="A Vietnamese graphic designer with passion to build things."
	canonical="https://quang.design"
/>

<div class="w-full p-3" onmouseover={onOver} onmouseout={onOut} role="presentation">
	<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
		{#each sections as section}
			<div class="ink-read max-w-none">
				<Markdown md={section} />
			</div>
		{/each}
	</div>
</div>
