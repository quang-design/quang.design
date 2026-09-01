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

	function linkPreview(node: HTMLElement) {
		if (!preview) return;

		function enter(event: Event) {
			const a = event.currentTarget as HTMLAnchorElement;
			preview?.setHover({
				eyebrow: 'Link',
				title: a.textContent?.trim() || a.href,
				subtitle: a.getAttribute('href') ?? a.href,
				href: a.getAttribute('href') ?? a.href
			});
		}

		function leave() {
			preview?.clearHover();
		}

		const links = [...node.querySelectorAll('a')];
		for (const a of links) {
			a.addEventListener('mouseenter', enter);
			a.addEventListener('mouseleave', leave);
			a.addEventListener('focus', enter);
			a.addEventListener('blur', leave);
		}

		return () => {
			for (const a of links) {
				a.removeEventListener('mouseenter', enter);
				a.removeEventListener('mouseleave', leave);
				a.removeEventListener('focus', enter);
				a.removeEventListener('blur', leave);
			}
		};
	}
</script>

<SeoHead
	title="Quang | Home"
	description="A Vietnamese graphic designer with passion to build things."
	canonical="https://quang.design"
/>

<div {@attach linkPreview} class="w-full p-3">
	<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
		{#each sections as section, i (i)}
			<div class="ink-read max-w-none">
				<Markdown md={section} />
			</div>
		{/each}
	</div>
</div>
