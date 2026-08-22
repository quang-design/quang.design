<script lang="ts">
	import { resolve } from '$app/paths';
	import ReviewItem from './review-item.svelte';
	import HorizontalDivider from '$lib/components/shared/horizontal-divider.svelte';
	import { MicroLabel, Hatch, GridBackdrop, Rule } from '$lib/components/primitives';

	let { ink = false }: { ink?: boolean } = $props();
</script>

<h2 id="subatomic" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">2 · Sub-atomic</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	The smallest visible units atoms are built from: hairlines, hatch, inversion, focus. Not
	components — rules that every layer above must obey.
</p>

<ReviewItem
	id="S1"
	group="subatomic"
	title="Hairlines — 0.5px, dashed = latent, double = emphasis"
	why="Every rule is 0.5px. Emphasis is a second hairline inset 2px. Stacked groups share one line. Never two rules next to each other. Replaces horizontal-divider."
	{ink}
>
	{#snippet before()}
		<div class="text-sm">
			<div class="border-foreground/25 border-[0.5px] p-3">0.5px solid</div>
			<HorizontalDivider />
			<div class="border border-dashed border-gray-600 p-3">gray-600 dashed</div>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-3">
			<div class="atlas-hair p-3">0.5px solid</div>
			<div class="atlas-hair-dashed p-3">0.5px dashed — latent</div>
			<div class="atlas-hair-double p-3">double — 2px paper gap</div>
			<div class="atlas-stack">
				<div class="px-3 py-1.5">row one</div>
				<div class="px-3 py-1.5">row two</div>
				<div class="px-3 py-1.5">row three</div>
			</div>
			<div class="atlas-stack-x flex">
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
	why="No muted fills. Surfaces differentiate with 45° hatch and a 24px grid."
	{ink}
>
	{#snippet before()}
		<div class="bg-muted h-32 w-full p-3 text-sm">flat muted fill</div>
	{/snippet}
	{#snippet after()}
		<GridBackdrop class="atlas-hair flex h-32 items-end gap-3 p-3">
			<Hatch class="atlas-hair h-16 w-24" />
			<Hatch class="atlas-hair h-24 w-16" />
			<div class="atlas-hair-dashed h-10 w-20"></div>
		</GridBackdrop>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="S3"
	group="subatomic"
	title="Motion — instant, inversion only"
	why="shadcn buttons transition-all; avatar scales; links underline over 0.3s. Atlas sets transition: none. Hover inverts. Spinner does not spin."
	{ink}
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
		<div class="atlas-hair atlas-invert w-fit px-3 py-1.5">hover — instant inversion</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="S4"
	group="subatomic"
	title="Focus — hairline outline, not ring-3"
	why="Latest shadcn uses focus-visible:ring-3. Atlas replaces that with a 0.5px ink outline offset 2px so focus is visible without a coloured glow."
	{ink}
>
	{#snippet before()}
		<button
			type="button"
			class="border-foreground/25 focus-visible:ring-ring/50 border-[0.5px] px-3 py-1.5 text-sm focus-visible:ring-3"
		>
			Tab to me
		</button>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-2">
			<button type="button" data-slot="button" class="atlas-hair atlas-invert w-fit px-3 py-1.5">
				Tab to me
			</button>
			<MicroLabel>outline 0.5px / offset 2px</MicroLabel>
		</div>
	{/snippet}
</ReviewItem>
