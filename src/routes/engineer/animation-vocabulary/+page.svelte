<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import AnimationCard from './AnimationCard.svelte';
	import { sections } from './animations';
	import PagePreview from '$lib/components/layout/page-preview.svelte';
</script>

<SeoHead
	title="Quang | Animation Vocabulary"
	description="Interactive visual glossary of animation terms powered by anime.js."
	canonical="https://quang.design/engineer/animation-vocabulary"
/>

<PagePreview
	value={{
		eyebrow: 'Engineer · E3',
		title: 'Animation Vocabulary',
		subtitle: 'Interactive visual glossary of animation terms.',
		description:
			'Inspired by animations.dev/vocabulary. Click any card to replay. Motion is unchanged — only the chrome is restyled.',
		links: [{ label: 'animations.dev/vocabulary', href: 'https://animations.dev/vocabulary' }]
	}}
/>

<section class="mx-auto w-full max-w-2xl space-y-10 p-4 sm:space-y-16">
	{#each sections as section (section.title)}
		<div class="space-y-4">
			<div>
				<h2 class="ink-label">{section.title}</h2>
				<p class="text-muted-foreground text-sm">{section.description}</p>
			</div>
			<div class="grid grid-cols-1 gap-0 sm:grid-cols-2">
				{#each section.items as item (item.title)}
					<AnimationCard title={item.title} description={item.description} animate={item.animate} />
				{/each}
			</div>
		</div>
	{/each}
</section>
