<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import { MicroLabel } from '$lib/components/primitives';
	import { typeScale, semanticTokens } from './catalog';

	let { ink = false }: { ink?: boolean } = $props();
</script>

<h2 id="tokens" class="mt-4 scroll-mt-28 text-sm tracking-widest uppercase">1 · Design tokens</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	shadcn-svelte theming: CSS variables on a root, then semantic aliases so
	<code>ui/</code> components restyle without class rewrites. Atlas only retunes the keys Tailwind
	already exposes (<code>--text-*</code>, <code>--spacing</code>,
	<code>--radius</code>, <code>--background</code>…). No parallel px scale.
</p>

<ReviewItem
	id="T1"
	group="tokens"
	title="Surface — one warm paper tone, no elevation"
	why="shadcn --background / --card. Reference is a single paper. Current site is pure white / neutral dark. No shadow, no tinted cards."
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
	{ink}
>
	{#snippet before()}
		<div class="grid grid-cols-2 gap-1 text-xs sm:grid-cols-4">
			<div class="bg-background border-border h-10 border p-1">background</div>
			<div class="bg-primary text-primary-foreground h-10 p-1">primary</div>
			<div class="bg-muted text-muted-foreground h-10 p-1">muted</div>
			<div class="bg-destructive text-primary-foreground h-10 p-1">destructive</div>
			<div class="bg-chart-1 h-10 p-1 text-white">chart-1</div>
			<div class="bg-chart-2 h-10 p-1 text-white">chart-2</div>
			<div class="border-border h-10 border p-1">border</div>
			<div class="bg-sidebar border-sidebar-border h-10 border p-1">sidebar</div>
		</div>
	{/snippet}
	{#snippet after()}
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
	why="The site already shrinks --text-sm / --text-base on :root. Atlas retunes those same keys on .atlas so text-xs…text-xl and shadcn Button/Input (text-sm) pick it up. No --fs-micro parallel scale."
	{ink}
>
	{#snippet before()}
		<div class="flex flex-col gap-2 text-sm">
			<p class="text-xs">text-xs — --text-sm on :root is 0.8rem</p>
			<p class="text-sm">text-sm</p>
			<p class="text-base">text-base — 0.85rem</p>
			<h1 class="mt-0 text-3xl font-semibold">text-3xl heading</h1>
			<p class="leading-7">Body leading-7</p>
		</div>
	{/snippet}
	{#snippet after()}
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
	{ink}
>
	{#snippet before()}
		<div class="flex gap-2">
			<div class="border-foreground/25 h-10 w-24 rounded-lg border"></div>
			<div class="border-foreground/25 size-10 rounded-full border"></div>
		</div>
	{/snippet}
	{#snippet after()}
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
	why="Tailwind and shadcn already space with --spacing (p-2, gap-3, h-8). The site sets 0.2rem. Atlas sets 0.25rem — Tailwind's own default — so the 4px grid is theirs, not a parallel --step."
	{ink}
>
	{#snippet before()}
		<div class="border-foreground/25 flex flex-col gap-2 border-[0.5px] p-6 text-sm">
			<p>--spacing: 0.2rem</p>
			<p>p-6 is 1.2rem off a 4px grid</p>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-2">
			<div class="atlas-hair p-2">p-2</div>
			<div class="atlas-hair p-3">p-3</div>
			<div class="atlas-hair p-4">p-4</div>
			<MicroLabel>--spacing: 0.25rem</MicroLabel>
		</div>
	{/snippet}
</ReviewItem>
