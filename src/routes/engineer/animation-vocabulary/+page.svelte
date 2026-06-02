<script lang="ts">
	import anime from 'animejs';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import AnimationCard from './AnimationCard.svelte';

	const animations = [
		{
			title: 'Fade in / Fade out',
			description: 'Element appears or disappears by changing opacity.',
			animate: (el: HTMLElement) => {
				anime({
					targets: el,
					opacity: [0, 1],
					duration: 1000,
					easing: 'easeInOutQuad'
				});
			}
		},
		{
			title: 'Slide in',
			description: 'Element enters by sliding in from off-screen (left, right, top, or bottom).',
			animate: (el: HTMLElement) => {
				anime({
					targets: el,
					translateX: [-60, 0],
					opacity: [0, 1],
					duration: 800,
					easing: 'easeOutCubic'
				});
			}
		},
		{
			title: 'Scale in',
			description:
				'Element grows from smaller to full size as it appears, often paired with a fade.',
			animate: (el: HTMLElement) => {
				anime({
					targets: el,
					scale: [0, 1],
					opacity: [0, 1],
					duration: 600,
					easing: 'easeOutCubic'
				});
			}
		},
		{
			title: 'Pop in',
			description: 'Element appears with a slight overshoot, like it bounces into place.',
			animate: (el: HTMLElement) => {
				anime({
					targets: el,
					scale: [0, 1.2, 1],
					opacity: [0, 1],
					duration: 600,
					easing: 'easeOutElastic(1, .6)'
				});
			}
		},
		{
			title: 'Reveal',
			description: 'Content is uncovered gradually, often by animating a clip-path or mask.',
			animate: (el: HTMLElement) => {
				anime({
					targets: el,
					clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
					duration: 800,
					easing: 'easeInOutQuad'
				});
			}
		},
		{
			title: 'Enter / Exit',
			description: "The animation an element plays when it's added to or removed from the screen.",
			animate: (el: HTMLElement) => {
				anime({
					targets: el,
					translateY: [20, 0],
					opacity: [0, 1],
					scale: [0.8, 1],
					duration: 500,
					easing: 'easeOutCubic',
					complete: () => {
						anime({
							targets: el,
							translateY: [0, -20],
							opacity: [1, 0],
							scale: [1, 0.8],
							duration: 500,
							easing: 'easeInCubic',
							delay: 600,
							complete: () => {
								anime({
									targets: el,
									translateY: [20, 0],
									opacity: [0, 1],
									scale: [0.8, 1],
									duration: 500,
									easing: 'easeOutCubic'
								});
							}
						});
					}
				});
			}
		}
	];
</script>

<SeoHead
	title="Quang | Animation Vocabulary"
	description="Interactive visual glossary of animation terms — Entrances & Exits — powered by anime.js."
	canonical="https://quang.design/engineer/animation-vocabulary"
/>

<section class="mx-auto w-full max-w-2xl space-y-8 p-4">
	<div>
		<h1 class="text-2xl font-bold uppercase">Animation Vocabulary</h1>
		<p class="text-muted-foreground mt-1 text-sm">
			Entrances &amp; Exits — how elements appear and disappear.
		</p>
		<p class="text-muted-foreground mt-1 text-xs">
			Inspired by <a
				href="https://animations.dev/vocabulary#entrances-and-exits"
				target="_blank"
				rel="noopener noreferrer"
				class="underline">animations.dev/vocabulary</a
			>. Click any card to replay.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		{#each animations as anim}
			<AnimationCard title={anim.title} description={anim.description} animate={anim.animate} />
		{/each}
	</div>
</section>
