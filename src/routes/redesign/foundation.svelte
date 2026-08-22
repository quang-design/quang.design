<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import HorizontalDivider from '$lib/components/shared/horizontal-divider.svelte';
	import { MicroLabel, KeySlot, Hatch, GridBackdrop } from '$lib/components/primitives';
	import { typeScale, semanticTokens } from './catalog';

	let { ink = false }: { ink?: boolean } = $props();
</script>

<h2 id="foundation" class="mt-4 text-sm tracking-widest uppercase">
	1 · Foundation — design tokens
</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	Same model as shadcn-svelte theming: CSS variables on <code>.atlas</code> (paper/ink), then
	semantic aliases (<code>--background</code>, <code>--primary</code>, <code>--border</code>…) so
	existing <code>ui/</code> components restyle without class rewrites.
</p>

<ReviewItem
	id="F1"
	group="foundation"
	title="Surface — one warm paper tone, no elevation"
	why="shadcn --background / --card. Reference is a single paper #cdc499. Current site is pure white / neutral dark."
	{ink}
>
	{#snippet before()}
		<div class="flex flex-col gap-2 text-xs">
			<div class="border-foreground/25 h-16 border-[0.5px] bg-white"></div>
			<code>--background: oklch(1 0 0)</code>
			<div class="border-foreground/25 h-16 border-[0.5px] bg-[oklch(0.145_0_0)]"></div>
			<code>.dark --background: oklch(0.145 0 0)</code>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-2">
			<div class="atlas-hair h-16 bg-[var(--paper)]"></div>
			<code class="atlas-label">--paper → --background</code>
			<div class="atlas-hair h-16 bg-[var(--ink)]"></div>
			<code class="atlas-label">--ink → --foreground</code>
			<div class="flex gap-1">
				{#each ['--ink', '--ink-60', '--ink-40', '--ink-25', '--ink-10'] as step (step)}
					<div class="flex grow flex-col gap-1">
						<div class="atlas-hair h-8" style="background-color: var({step})"></div>
						<code class="atlas-label">{step}</code>
					</div>
				{/each}
			</div>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="F2"
	group="foundation"
	title="Semantic tokens — shadcn variable map"
	why="Every ui/ component reads --primary, --muted, --border, --ring, --sidebar. Atlas fills the full shadcn set so Button/Input/Badge inherit paper/ink. No accent hue: destructive and accent also map to ink."
	{ink}
>
	{#snippet before()}
		<div class="grid grid-cols-2 gap-1 text-xs sm:grid-cols-4">
			<div class="bg-background border-border h-10 border p-1">background</div>
			<div class="bg-primary text-primary-foreground h-10 p-1">primary</div>
			<div class="bg-muted text-muted-foreground h-10 p-1">muted</div>
			<div class="border-border h-10 border p-1">border</div>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="atlas-stack flex flex-col">
			{#each semanticTokens as row (row.token)}
				<div class="flex items-baseline gap-3 px-2 py-1.5">
					<code class="atlas-label w-44 shrink-0">{row.token}</code>
					<span class="atlas-row-desc">{row.maps}</span>
				</div>
			{/each}
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="F3"
	group="foundation"
	title="Type — hierarchy by case + tracking"
	why="UI body 12px. Labels 10 / captions 11 / prose 13 / titles 20. One weight. Global heading sizes and leading-7 are reset inside .atlas."
	{ink}
>
	{#snippet before()}
		<div class="text-sm">
			<h1 class="mt-0 mb-2 text-3xl font-semibold">The Evolution Harness</h1>
			<h2 class="mt-4 mb-2 text-2xl font-semibold">What this is</h2>
			<p class="leading-7">Body today is ~13.6px / leading-7.</p>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-3">
			<div class="atlas-stack flex flex-col">
				{#each typeScale as row (row.token)}
					<div class="flex items-baseline gap-3 px-2 py-1.5">
						<code class="atlas-label w-28 shrink-0">{row.token}</code>
						<span class="atlas-label w-8 shrink-0">{row.px}</span>
						<span class="atlas-row-desc grow">{row.use}</span>
					</div>
				{/each}
			</div>
			<MicroLabel>Rivers of Empire</MicroLabel>
			<h1 class="atlas-display">The Evolution Harness</h1>
			<p>UI body is 12px / 1.45.</p>
			<p class="atlas-read">Prose steps up to 13px / 1.55.</p>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="F4"
	group="foundation"
	title="Radius — zero"
	why="shadcn --radius drives rounded-lg on Button/Input. Atlas sets --radius: 0 and forces border-radius: 0 on descendants."
	{ink}
>
	{#snippet before()}
		<div class="flex gap-2">
			<div class="border-foreground/25 h-10 w-24 rounded-lg border"></div>
			<div class="border-foreground/25 size-10 rounded-full border"></div>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex gap-2">
			<div class="atlas-hair h-10 w-24"></div>
			<div class="atlas-hair size-10"></div>
			<MicroLabel>--radius: 0</MicroLabel>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="F5"
	group="foundation"
	title="Spacing — 4px grid"
	why="--step: 0.25rem. Current --spacing is 0.2rem (off-grid). Cards use p-6, prose leading-7."
	{ink}
>
	{#snippet before()}
		<div class="border-foreground/25 border-[0.5px] p-6 text-sm">p-6, --spacing: 0.2rem</div>
	{/snippet}
	{#snippet after()}
		<div class="atlas-stack flex flex-col">
			{#each ['8', '12', '16'] as pad (pad)}
				<div class="flex items-center gap-2 px-2 py-1.5">
					<KeySlot code={pad} />
					<span class="atlas-row grow">{pad}px padding</span>
				</div>
			{/each}
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="F6"
	group="foundation"
	title="Hairlines — 0.5px, dashed = latent, double = emphasis"
	why="Every rule is 0.5px. Emphasis is a second hairline inset 2px. Stacked groups share one line. Never two rules next to each other."
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
			<div class="atlas-stack flex flex-col">
				<div class="px-3 py-1.5">row one</div>
				<div class="px-3 py-1.5">row two</div>
				<div class="px-3 py-1.5">row three</div>
			</div>
			<div class="atlas-stack-x flex">
				<div class="grow px-3 py-1.5">cell</div>
				<div class="grow px-3 py-1.5">cell</div>
				<div class="grow px-3 py-1.5">cell</div>
			</div>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="F7"
	group="foundation"
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
	id="F8"
	group="foundation"
	title="Motion — instant, inversion only"
	why="shadcn buttons transition-all. Atlas sets transition: none. Hover inverts. Spinner does not spin."
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
			<a href="/blog">underline grows over 0.3s</a>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="atlas-hair atlas-invert w-fit px-3 py-1.5">hover — instant inversion</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="F9"
	group="foundation"
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
		<button type="button" data-slot="button" class="atlas-hair atlas-invert px-3 py-1.5">
			Tab to me
		</button>
	{/snippet}
</ReviewItem>
