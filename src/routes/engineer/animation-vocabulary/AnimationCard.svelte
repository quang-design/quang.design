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
	let loopTimer: ReturnType<typeof setTimeout>;
	let visible = false;

	function play() {
		if (!stageEl) return;
		clearTimeout(loopTimer);
		if (typeof cleanup === 'function') cleanup();
		const kids = stageEl.querySelectorAll('*');
		anime.remove(kids);
		stageEl.innerHTML = '';

		const runningBefore = (anime as unknown as Record<string, unknown>).running as unknown[];
		const countBefore = runningBefore.length;
		cleanup = animateFn(stageEl);
		const newInstances = runningBefore.slice(countBefore);

		if (newInstances.length > 0 && visible) {
			const finished = newInstances.map(
				(a) => (a as Record<string, unknown>).finished as Promise<void>
			);
			Promise.all(finished)
				.then(() => {
					if (visible) loopTimer = setTimeout(play, 1000);
				})
				.catch(() => {});
		}
	}

	function autoplay(el: HTMLElement) {
		stageEl = el;
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const observer = new IntersectionObserver(
			(entries) => {
				visible = entries[0].isIntersecting;
				if (visible && !reduced) {
					play();
				} else {
					clearTimeout(loopTimer);
				}
			},
			{ threshold: 0.3 }
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
			clearTimeout(loopTimer);
		};
	}
</script>

<Button
	variant="ghost"
	class="hair group flex h-auto w-full cursor-pointer flex-col items-start gap-4 overflow-hidden p-4 text-left whitespace-normal sm:flex-row sm:gap-6 sm:p-6"
	onclick={play}
>
	<div
		{@attach autoplay}
		class="hair relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden sm:h-24 sm:w-24"
	></div>
	<div class="flex min-w-0 flex-col gap-1">
		<h3 class="ink-row-title">{title}</h3>
		<p class="ink-row-desc">{description}</p>
		<span class="ink-label mt-2 opacity-0 group-hover:opacity-100">click to replay</span>
	</div>
</Button>
