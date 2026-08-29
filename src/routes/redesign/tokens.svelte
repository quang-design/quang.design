<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import { MicroLabel } from '$lib/components/primitives';
	import { typeScale, semanticTokens } from './catalog';
</script>

<h2 id="tokens" class="mt-4 scroll-mt-28 text-sm tracking-widest uppercase">1 · Design tokens</h2>
<p class="atlas-row-desc max-w-3xl">
	shadcn-svelte theming: CSS variables on a root, then semantic aliases so
	<code>ui/</code> components restyle without class rewrites. Atlas retunes the keys Tailwind
	already exposes (<code>--text-*</code>, <code>--spacing</code>, <code>--radius</code>,
	<code>--background</code>…). No parallel px scale.
</p>

<ReviewItem
	id="T1"
	group="tokens"
	title="Surface — one warm paper tone, no elevation"
	why="shadcn --background / --card. Reference is a single paper. No shadow, no tinted cards."
>
	{#snippet children()}
		<div class="flex flex-col gap-2">
			<div class="atlas-hair h-16 bg-[var(--paper)]"></div>
			<code class="atlas-label">--paper → --background</code>
			<div class="atlas-hair h-16 bg-[var(--ink)]"></div>
			<code class="atlas-label">--ink → --foreground</code>
			<div class="grid grid-cols-5 gap-1">
				{#each ['--ink', '--ink-60', '--ink-40', '--ink-25', '--ink-10'] as step (step)}
					<div class="flex min-w-0 flex-col gap-1">
						<div class="atlas-hair h-8" style="background-color: var({step})"></div>
						<code class="atlas-label truncate">{step}</code>
					</div>
				{/each}
			</div>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="T2"
	group="tokens"
	title="Semantic map — full shadcn-svelte set, no accent hue"
	why="Latest theming: background through sidebar-ring plus chart-1…5. Atlas fills every variable so Button/Input/Badge/Select inherit paper/ink. Destructive, accent, and charts map to ink — never a second hue."
>
	{#snippet children()}
		<div class="atlas-stack max-h-80 overflow-auto">
			{#each semanticTokens as row (row.token)}
				<div class="flex items-baseline gap-3 px-2 py-1.5">
					<code class="atlas-label w-52 shrink-0">{row.token}</code>
					<span class="atlas-row-desc">{row.maps}</span>
				</div>
			{/each}
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="T3"
	group="tokens"
	title="Type — theme Tailwind --text-*, don't invent a scale"
	why="Atlas retunes --text-sm / --text-base on .atlas so text-xs…text-xl and shadcn Button/Input (text-sm) pick it up. No --fs-micro parallel scale."
>
	{#snippet children()}
		<div class="flex flex-col gap-3">
			<div class="atlas-stack">
				{#each typeScale as row (row.token)}
					<div class="flex items-baseline gap-3 px-2 py-1.5">
						<code class="atlas-label w-28 shrink-0">{row.utility}</code>
						<span class="atlas-label w-8 shrink-0">{row.px}</span>
						<span class="atlas-row-desc grow">{row.use}</span>
					</div>
				{/each}
			</div>
			<MicroLabel>text-xs — Rivers of Empire</MicroLabel>
			<h1 class="text-xl font-bold tracking-tight">The Evolution Harness</h1>
			<p class="text-base">text-base UI body.</p>
			<p class="text-lg leading-relaxed">text-lg prose.</p>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="T4"
	group="tokens"
	title="Radius — zero"
	why="Latest shadcn --radius drives rounded-lg on Button/Input and rounded-4xl on Badge. Atlas sets --radius: 0 and forces border-radius: 0 on descendants and data-slots."
>
	{#snippet children()}
		<div class="flex items-center gap-2">
			<div class="atlas-hair h-10 w-24"></div>
			<div class="atlas-hair size-10"></div>
			<MicroLabel>--radius: 0</MicroLabel>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="T5"
	group="tokens"
	title="Spacing — theme Tailwind --spacing"
	why="Tailwind and shadcn space with --spacing (p-2, gap-3, h-8). Atlas sets 0.25rem — Tailwind's default — so the 4px grid is theirs, not a parallel --step."
>
	{#snippet children()}
		<div class="flex flex-col gap-2">
			<div class="atlas-hair p-2">p-2</div>
			<div class="atlas-hair p-3">p-3</div>
			<div class="atlas-hair p-4">p-4</div>
			<MicroLabel>--spacing: 0.25rem</MicroLabel>
		</div>
	{/snippet}
</ReviewItem>
