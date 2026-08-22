<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import { MicroLabel } from '$lib/components/primitives';
	import { typeScale, semanticTokens } from './catalog';

	let { ink = false }: { ink?: boolean } = $props();
</script>

<h2 id="tokens" class="mt-4 scroll-mt-28 text-sm tracking-widest uppercase">1 · Design tokens</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	shadcn-svelte theming: CSS variables on a root, then semantic aliases so
	<code>ui/</code> components restyle without class rewrites. Atomic design calls this sub-atomic.
	Atlas scopes the same map to <code>.atlas</code> (paper/ink, OKLCH, Tailwind v4
	<code>@theme inline</code>).
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
			<div class="atlas-stack">
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
	title="Spacing — 4px grid"
	why="--step: 0.25rem. Current --spacing is 0.2rem (off-grid). Cards use p-6, prose leading-7."
	{ink}
>
	{#snippet before()}
		<div class="border-foreground/25 border-[0.5px] p-6 text-sm">p-6, --spacing: 0.2rem</div>
	{/snippet}
	{#snippet after()}
		<div class="atlas-stack">
			{#each ['8', '12', '16'] as pad (pad)}
				<div class="flex items-center gap-2 px-2 py-1.5">
					<span class="atlas-label w-8">{pad}</span>
					<span class="atlas-row grow">{pad}px padding</span>
				</div>
			{/each}
		</div>
	{/snippet}
</ReviewItem>
