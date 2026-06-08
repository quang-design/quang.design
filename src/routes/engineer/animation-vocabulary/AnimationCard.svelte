<script lang="ts">
	import anime from 'animejs';
	import { Button } from '$lib/components/ui/button';
	import type { AnimateFn } from './animations';

	let {
		title,
		description,
		animate: animateFn
	}: {
		title: string;
		description: string;
		animate: AnimateFn;
	} = $props();

	let stageEl: HTMLElement;
	let cleanup: void | (() => void);
	let hasPlayed = false;

	function play() {
		if (!stageEl) return;
		if (typeof cleanup === 'function') cleanup();
		const kids = stageEl.querySelectorAll('*');
		anime.remove(kids);
		stageEl.innerHTML = '';
		cleanup = animateFn(stageEl);
		hasPlayed = true;
	}

	function autoplay(el: HTMLElement) {
		stageEl = el;
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !hasPlayed && !reduced) {
					play();
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}
</script>

<Button
	variant="ghost"
	class="border-foreground/10 group flex h-auto w-full cursor-pointer flex-col items-start gap-4 overflow-hidden rounded-none border-[0.5px] p-4 text-left whitespace-normal transition-colors hover:bg-neutral-50 sm:flex-row sm:gap-6 sm:p-6 dark:hover:bg-neutral-900"
	onclick={play}
>
	<div
		{@attach autoplay}
		class="bg-foreground/5 relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden sm:h-24 sm:w-24"
	></div>
	<div class="flex min-w-0 flex-col gap-1">
		<h3 class="text-sm font-bold">{title}</h3>
		<p class="text-muted-foreground text-xs">{description}</p>
		<span
			class="text-muted-foreground mt-2 text-[10px] opacity-0 transition-opacity group-hover:opacity-100"
		>
			click to replay
		</span>
	</div>
</Button>
