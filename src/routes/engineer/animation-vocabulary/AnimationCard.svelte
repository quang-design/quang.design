<script lang="ts">
	import anime from 'animejs';
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

<button type="button" class="anim-card hair group" onclick={play}>
	<div {@attach autoplay} class="anim-stage"></div>
	<div class="anim-copy">
		<h3 class="ink-row-title">{title}</h3>
		<p class="ink-row-desc">{description}</p>
		<span class="ink-label mt-2 opacity-0 group-hover:opacity-100">click to replay</span>
	</div>
</button>

<style>
	.anim-card {
		display: grid;
		grid-template-columns: 1fr 2fr;
		width: 100%;
		height: auto;
		padding: 0;
		cursor: pointer;
		overflow: hidden;
		text-align: left;
		white-space: normal;
		background: transparent;
		color: inherit;
		font: inherit;
	}

	.anim-stage {
		aspect-ratio: 1;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-right: var(--hair) solid var(--ink-25);
	}

	.anim-copy {
		min-width: 0;
		display: flex;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		gap: calc(var(--spacing) * 1);
		padding: calc(var(--spacing) * 3);
	}

	.anim-card:hover,
	.anim-card:focus-visible {
		background-color: var(--ink-10);
	}

	.anim-card:focus-visible {
		outline: var(--hair) solid var(--ink);
		outline-offset: calc(var(--spacing) * -1);
	}
</style>
