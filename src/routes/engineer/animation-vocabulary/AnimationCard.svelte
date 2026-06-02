<script lang="ts">
	import anime from 'animejs';
	import { onMount } from 'svelte';

	let {
		title,
		description,
		animate: animateFn
	}: {
		title: string;
		description: string;
		animate: (target: HTMLElement) => void;
	} = $props();

	let shapeEl: HTMLElement;
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	function replay() {
		if (!shapeEl) return;
		anime.remove(shapeEl);
		shapeEl.removeAttribute('style');
		animateFn(shapeEl);
	}

	$effect(() => {
		if (mounted && shapeEl) {
			animateFn(shapeEl);
		}
	});
</script>

<button
	class="border-foreground/10 group flex cursor-pointer items-start gap-6 border-[0.5px] p-6 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
	onclick={replay}
>
	<div
		class="bg-foreground/5 relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden"
	>
		<div bind:this={shapeEl} class="bg-foreground h-8 w-8"></div>
	</div>
	<div class="flex flex-col gap-1">
		<h3 class="text-sm font-bold">{title}</h3>
		<p class="text-muted-foreground text-xs">{description}</p>
		<span
			class="text-muted-foreground mt-2 text-[10px] opacity-0 transition-opacity group-hover:opacity-100"
		>
			click to replay
		</span>
	</div>
</button>
