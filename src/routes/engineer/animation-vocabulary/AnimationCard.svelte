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

	function onKey(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			play();
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

<div class="anim-card" role="button" tabindex="0" onclick={play} onkeydown={onKey}>
	<div class="anim-stage">
		<div {@attach autoplay} class="anim-play"></div>
	</div>
	<div class="anim-copy">
		<h3 class="ink-row-title">{title}</h3>
		<p class="ink-row-desc">{description}</p>
		<span class="ink-label anim-hint">click to replay</span>
	</div>
</div>

<style>
	.anim-card {
		display: grid;
		grid-template-columns: calc(var(--grid) * 5) minmax(0, 1fr);
		align-items: stretch;
		width: 100%;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		cursor: pointer;
		overflow: visible;
		text-align: left;
		white-space: normal;
		background: transparent;
		color: inherit;
		font: inherit;
		box-shadow: 0 0 0 var(--hair) var(--ink-25);
	}

	.anim-stage {
		align-self: stretch;
		min-width: 0;
		min-height: calc(var(--grid) * 5);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		box-shadow: inset calc(-1 * var(--hair)) 0 0 var(--ink-25);
	}

	.anim-play {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
		width: min(100%, calc(var(--grid) * 5));
		height: auto;
		overflow: hidden;
	}

	.anim-copy {
		min-width: 0;
		display: flex;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		gap: 0;
		padding: var(--grid);
	}

	.anim-hint {
		height: var(--grid);
		margin-top: 0;
		opacity: 0;
	}

	.anim-card:hover .anim-hint,
	.anim-card:focus-visible .anim-hint {
		opacity: 1;
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
