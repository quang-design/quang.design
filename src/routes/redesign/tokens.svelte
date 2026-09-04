<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import { MicroLabel } from '$lib/components/primitives';
	import { typeScale, semanticTokens } from './catalog';
</script>

<h2 id="tokens" class="mt-4 scroll-mt-28 text-sm tracking-widest uppercase">1 · Design tokens</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	shadcn-svelte theming: CSS variables on <code>:root</code>, then semantic aliases so
	<code>ui/</code> components restyle without class rewrites. Type and space retune Tailwind
	<code>--text-*</code> and <code>--spacing</code>. No parallel px scale.
</p>

<ReviewItem
	id="T1"
	group="tokens"
	title="Surface — one warm paper tone, no elevation"
	why="shadcn --background / --card. Reference is a single paper. No shadow, no tinted cards."
>
	{#snippet before()}
		<div class="flex flex-col gap-2 text-xs">
			<div class="h-16 border-[0.5px] border-black/20 bg-white"></div>
			<code>--background: oklch(1 0 0)</code>
			<div class="h-16 border-[0.5px] border-black/20 bg-[oklch(0.145_0_0)]"></div>
			<code>.dark --background: oklch(0.145 0 0)</code>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-2">
			<div class="hair h-16 bg-[var(--paper)]"></div>
			<code class="ink-label">--paper → --background</code>
			<div class="hair h-16 bg-[var(--ink)]"></div>
			<code class="ink-label">--ink → --foreground</code>
			<div class="grid grid-cols-5 gap-1">
				{#each ['--ink', '--ink-60', '--ink-40', '--ink-25', '--ink-10'] as step (step)}
					<div class="flex min-w-0 flex-col gap-1">
						<div class="hair h-8" style="background-color: var({step})"></div>
						<code class="ink-label truncate">{step}</code>
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
	why="Latest theming: background through sidebar-ring plus chart-1…5. Destructive, accent, and charts map to ink — never a second hue."
>
	{#snippet before()}
		<div class="grid grid-cols-2 gap-1 text-xs sm:grid-cols-4">
			<div class="h-10 border border-neutral-200 bg-white p-1">background</div>
			<div class="h-10 bg-neutral-900 p-1 text-white">primary</div>
			<div class="h-10 bg-neutral-100 p-1 text-neutral-500">muted</div>
			<div class="h-10 bg-red-600 p-1 text-white">destructive</div>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="stack max-h-80 overflow-auto">
			{#each semanticTokens as row (row.token)}
				<div class="flex items-baseline gap-3 px-2 py-1.5">
					<code class="ink-label w-52 shrink-0">{row.token}</code>
					<span class="ink-row-desc">{row.maps}</span>
				</div>
			{/each}
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="T3"
	group="tokens"
	title="Type — theme Tailwind --text-*, don't invent a scale"
	why="Retune --text-xs…xl on :root so text-xs…text-xl and shadcn Button/Input (text-sm) pick it up. No parallel scale."
>
	{#snippet before()}
		<div class="flex flex-col gap-2 text-sm">
			<p class="text-xs">text-xs — previous --text-sm on :root was 0.8rem</p>
			<p class="text-sm">text-sm</p>
			<p class="text-base">text-base</p>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-3">
			<div class="stack">
				{#each typeScale as row (row.token)}
					<div class="flex items-baseline gap-3 px-2 py-1.5">
						<code class="ink-label w-28 shrink-0">{row.utility}</code>
						<span class="ink-label w-8 shrink-0">{row.px}</span>
						<span class="ink-row-desc grow">{row.use}</span>
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
	why="--radius: 0 and border-radius: 0 on rounded utilities and data-slots."
>
	{#snippet before()}
		<div class="flex gap-2">
			<div class="h-10 w-24 rounded-lg border border-black/20"></div>
			<div class="size-10 rounded-full border border-black/20"></div>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex items-center gap-2">
			<div class="hair h-10 w-24"></div>
			<div class="hair size-10"></div>
			<MicroLabel>--radius: 0</MicroLabel>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="T5"
	group="tokens"
	title="Spacing — theme Tailwind --spacing"
	why="--spacing: 0.25rem so the 4px grid is Tailwind's. --grid is 6 steps (24px) for hatch alignment."
>
	{#snippet before()}
		<div class="flex flex-col gap-2 border-[0.5px] border-black/20 p-6 text-sm">
			<p>--spacing: 0.2rem</p>
			<p>p-6 is 1.2rem off a 4px grid</p>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-2">
			<div class="hair p-2">p-2</div>
			<div class="hair p-3">p-3</div>
			<div class="hair p-4">p-4</div>
			<MicroLabel>--spacing: 0.25rem · --grid: 1.5rem</MicroLabel>
		</div>
	{/snippet}
</ReviewItem>
