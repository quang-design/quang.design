<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import { MicroLabel, Hatch, GridBackdrop, Rule } from '$lib/components/primitives';
</script>

<h2 id="subatomic" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">2 · Sub-atomic</h2>
<p class="atlas-row-desc max-w-3xl">
	The smallest visible units atoms are built from: hairlines, hatch, inversion, focus. Not
	components — rules that every layer above must obey.
</p>

<ReviewItem
	id="S1"
	group="subatomic"
	title="Hairlines — 0.5px, dashed = latent, double = emphasis"
	why="Every rule is 0.5px. Emphasis is a second hairline inset 2px. Stacked groups share one line. Never two rules next to each other."
>
	{#snippet children()}
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
>
	{#snippet children()}
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
	why="No transition-all, no scale on hover, no underline tween. Hover inverts. Spinner does not spin."
>
	{#snippet children()}
		<div class="atlas-hair atlas-invert w-fit px-3 py-1.5">hover — instant inversion</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="S4"
	group="subatomic"
	title="Focus — hairline outline, not ring-3"
	why="Latest shadcn uses focus-visible:ring-3. Atlas replaces that with a 0.5px ink outline offset 2px."
>
	{#snippet children()}
		<div class="flex flex-col gap-2">
			<button type="button" data-slot="button" class="atlas-hair atlas-invert w-fit px-3 py-1.5">
				Tab to me
			</button>
			<MicroLabel>outline 0.5px / offset 2px</MicroLabel>
		</div>
	{/snippet}
</ReviewItem>
