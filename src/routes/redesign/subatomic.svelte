<script lang="ts">
	import { resolve } from '$app/paths';
	import ReviewItem from './review-item.svelte';
	import HorizontalDivider from '$lib/components/shared/horizontal-divider.svelte';
	import { MicroLabel, Hatch, GridBackdrop, Rule } from '$lib/components/primitives';
</script>

<h2 id="subatomic" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">2 · Sub-atomic</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	The smallest visible units: hairlines, hatch, inversion, focus. Hatch and grid share
	<code>--grid</code> and <code>background-attachment: fixed</code> so they land on the same origin.
</p>

<ReviewItem
	id="S1"
	group="subatomic"
	title="Hairlines — 0.5px, dashed = latent, double = emphasis"
	why="Every rule is 0.5px. Emphasis is a second hairline inset. Stacked groups share one line."
>
	{#snippet before()}
		<div class="text-sm">
			<div class="border-[0.5px] border-black/20 p-3">0.5px solid</div>
			<HorizontalDivider />
			<div class="border border-dashed border-gray-600 p-3">gray-600 dashed</div>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-3">
			<div class="hair p-3">0.5px solid</div>
			<div class="hair-dashed p-3">0.5px dashed — latent</div>
			<div class="hair-double p-3">double — emphasis</div>
			<div class="stack">
				<div class="px-3 py-1.5">row one</div>
				<div class="px-3 py-1.5">row two</div>
				<div class="px-3 py-1.5">row three</div>
			</div>
			<div class="stack-x flex">
				<div class="grow px-3 py-1.5">cell</div>
				<div class="grow px-3 py-1.5">cell</div>
				<div class="grow px-3 py-1.5">cell</div>
			</div>
			<div class="flex h-10 items-stretch gap-3">
				<Rule />
				<Rule orientation="vertical" />
			</div>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="S2"
	group="subatomic"
	title="Texture — hatch + grid, not tint"
	why="No muted fills. Surfaces differentiate with a 45° hatch and a 24px grid that share origin and size."
>
	{#snippet before()}
		<div class="h-32 w-full bg-neutral-100 p-3 text-sm">flat muted fill</div>
	{/snippet}
	{#snippet after()}
		<GridBackdrop class="hair flex h-32 items-end gap-3 p-3">
			<Hatch class="hair h-16 w-24" />
			<Hatch class="hair h-24 w-16" />
			<div class="hair-dashed h-10 w-20"></div>
		</GridBackdrop>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="S3"
	group="subatomic"
	title="Motion — instant, inversion only"
	why="UI chrome does not tween. Hover inverts. Spinner still spins. Animation vocabulary keeps anime.js."
>
	{#snippet before()}
		<div class="flex items-center gap-4 text-sm">
			<img
				src="/avatar.avif"
				alt=""
				width="32"
				height="32"
				class="size-8 rounded-full border object-cover transition-all duration-300 hover:scale-105"
			/>
			<a href={resolve('/blog')}>underline grows over 0.3s</a>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="hair ink-invert w-fit px-3 py-1.5">hover — instant inversion</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="S4"
	group="subatomic"
	title="Focus — hairline outline, not ring-3"
	why="0.5px ink outline offset 2px. No coloured glow."
>
	{#snippet before()}
		<button
			type="button"
			class="border-[0.5px] border-black/20 px-3 py-1.5 text-sm focus-visible:ring-3"
		>
			Tab to me
		</button>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-2">
			<button type="button" data-slot="button" class="hair ink-invert w-fit px-3 py-1.5">
				Tab to me
			</button>
			<MicroLabel>outline 0.5px / offset 2px</MicroLabel>
		</div>
	{/snippet}
</ReviewItem>
