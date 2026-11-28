<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { Heading } from '$lib/components/primitives';
	import { pages } from '$lib/seo/copy';
	import AnimationCard from './AnimationCard.svelte';
	import { sections } from './animations';
</script>

<SeoHead
	title={pages.animation.title}
	description={pages.animation.description}
	canonical="https://quang.design/engineer/animation-vocabulary"
/>

<section
	class="@container w-full space-y-[calc(var(--grid)*2)] p-[var(--grid)] sm:space-y-[calc(var(--grid)*3)]"
>
	<div>
		<Heading level={1} class="ink-display uppercase" text="Animation Vocabulary" />
		<p>Interactive visual glossary of animation terms.</p>
		<p>
			Inspired by <a
				class="underline decoration-[var(--ink-40)] underline-offset-4"
				href="https://animations.dev/vocabulary">animations.dev/vocabulary</a
			>. Click any card to replay.
		</p>
	</div>
	{#each sections as section (section.title)}
		<div class="space-y-[var(--grid)]">
			<div>
				<Heading level={2} class="ink-label" text={section.title} />
				<p class="text-muted-foreground text-sm">{section.description}</p>
			</div>
			<div class="grid grid-cols-1 gap-0 @[36rem]:grid-cols-2">
				{#each section.items as item (item.title)}
					<AnimationCard title={item.title} description={item.description} animate={item.animate} />
				{/each}
			</div>
		</div>
	{/each}
</section>
