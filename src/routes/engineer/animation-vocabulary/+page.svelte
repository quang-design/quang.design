<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import AnimationCard from './AnimationCard.svelte';
	import { sections } from './animations';
</script>

<SeoHead
	title="Quang | Animation Vocabulary"
	description="Interactive visual glossary of animation terms powered by anime.js."
	canonical="https://quang.design/engineer/animation-vocabulary"
/>

<section class="mx-auto w-full max-w-2xl space-y-10 p-4 sm:space-y-16">
	<div>
		<h1 class="ink-display uppercase">Animation Vocabulary</h1>
		<p class="mt-1">Interactive visual glossary of animation terms.</p>
		<p class="mt-1">
			Inspired by <a href="https://animations.dev/vocabulary">animations.dev/vocabulary</a>. Click
			any card to replay.
		</p>
	</div>
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
