<script lang="ts">
	import { resolve } from '$app/paths';
	import ReviewItem from './review-item.svelte';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import Footer from '$lib/components/shared/footer.svelte';
	import { Markdown } from '$lib/components/markdown';
	import { Mark, Action } from '$lib/components/primitives';
	import { StatusBar, IndexTree, IndexRow, ReadingPane, HintBar } from '$lib/components/atlas';
	import type { TreeGroup } from '$lib/components/atlas/index-tree.svelte';

	let {
		ink = false,
		localTime,
		treeGroups
	}: { ink?: boolean; localTime: string; treeGroups: TreeGroup[] } = $props();

	const homeMd = `## Xin Chào!

My name is Quang – a Vietnamese Graphic Designer skilled at crafting **impactful brand identities**.

- Design Director @FlexOS
- Design Manager @FlexOS`;
</script>

{#snippet whatThisIs()}
	<p>
		A Vietnamese graphic designer who <Mark>builds the things he designs</Mark>.
	</p>
{/snippet}
{#snippet work()}
	<div class="atlas-stack flex flex-col">
		<IndexRow code="01" title="Design Director @FlexOS" date="2023 — now" />
		<IndexRow code="02" title="Design Manager @FlexOS" date="2022 — 2023" />
	</div>
{/snippet}

<h2 id="organisms" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">5 · Organisms</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	Composed chrome that replaces navbar, footer, and markdown. These are the pieces the four-zone
	shell assembles.
</p>

<ReviewItem
	id="O1"
	group="organisms"
	title="StatusBar replaces the navbar"
	why="Avatar + slash links + clock + theme toggle. Atlas: repository, location, country, live local time, Action. Scrolls horizontally on small screens."
	stacked
	{ink}
>
	{#snippet before()}
		<Navbar />
	{/snippet}
	{#snippet after()}
		<div class="atlas-hair overflow-x-auto">
			<StatusBar
				title="quang.design"
				stats={[
					{ label: 'Location', value: 'Nha Trang' },
					{ label: 'Country', value: 'Vietnam' },
					{ label: 'Local time', value: localTime }
				]}
				actions={['Ink theme']}
			/>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="O2"
	group="organisms"
	title="IndexTree replaces flat nav"
	why="Four inline links, mobile Select. Atlas: grouped tree, codes, counts. Nesting is indent only. Telescopic sits under Engineer."
	{ink}
>
	{#snippet before()}
		<nav class="flex flex-wrap items-center gap-4 text-sm">
			<a href={resolve('/')}>Quang</a><span class="text-muted-foreground">/</span>
			<a href={resolve('/design')}>Design</a><span class="text-muted-foreground">/</span>
			<a href={resolve('/engineer')}>Engineer</a><span class="text-muted-foreground">/</span>
			<a href={resolve('/blog')}>Blog</a>
		</nav>
	{/snippet}
	{#snippet after()}
		<div class="atlas-hair">
			<IndexTree groups={treeGroups} active="E1" />
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="O3"
	group="organisms"
	title="ReadingPane + Markdown"
	why="Home columns and blog posts use renderer.svelte (semibold headings, blue links, amber quotes, Shiki). Atlas: eyebrow, display title, labelled sections, Mark, 13px prose."
	stacked
	{ink}
>
	{#snippet before()}
		<div class="prose max-w-none text-sm">
			<Markdown md={homeMd} />
		</div>
	{/snippet}
	{#snippet after()}
		<div class="atlas-hair">
			<ReadingPane
				tabs={['What it does', "How it's built"]}
				eyebrow="Quang Nguyen"
				title="Design Engineer"
				subtitle="how a brand gets designed, built and shipped"
				sections={[
					{ label: 'What this is', body: whatThisIs },
					{ label: 'Work', body: work }
				]}
			/>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="O4"
	group="organisms"
	title="HintBar replaces the footer quote"
	why="Footer is Urban Dictionary quote + copyright + Subscribe. Atlas: glyph legend. Subscribe moves to a field in the reading column or status actions. Wraps on small screens."
	stacked
	{ink}
>
	{#snippet before()}
		<Footer />
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-3">
			<div class="atlas-hair">
				<HintBar
					hints={[
						{ glyph: '→', label: 'Go inside' },
						{ glyph: '←', label: 'Come back out' },
						{ glyph: '↓↑', label: 'Move' },
						{ glyph: '·', label: 'Hover to read' }
					]}
				/>
			</div>
			<div class="flex flex-wrap items-end gap-2">
				<Action>Subscribe</Action>
			</div>
		</div>
	{/snippet}
</ReviewItem>
