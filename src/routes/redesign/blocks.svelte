<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import Footer from '$lib/components/shared/footer.svelte';
	import PostCard from '$lib/components/shared/post-card.svelte';
	import EmptyState from '$lib/components/shared/empty-state.svelte';
	import Subscribe from '$lib/components/shared/subscribe.svelte';
	import { Markdown } from '$lib/components/markdown';
	import { Input } from '$lib/components/ui/input/index.js';
	import { MicroLabel, Action, Mark } from '$lib/components/primitives';
	import { StatusBar, IndexTree, IndexRow, ReadingPane, HintBar } from '$lib/components/atlas';
	import type { TreeGroup } from '$lib/components/atlas/index-tree.svelte';

	let {
		ink = false,
		localTime,
		treeGroups
	}: { ink?: boolean; localTime: string; treeGroups: TreeGroup[] } = $props();

	const samplePost = {
		slug: 'doppio-kaffe',
		title: "5 Years of Crafting Doppio Kaffè's Cozy Character",
		description:
			"As a designer and loyal patron, it's been my privilege to help shape the branding for Doppio Kaffè over the past 5 years.",
		thumbnail: '/design/posts/doppio/doppio_1.avif',
		date: '2023-01-01'
	};

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

<h2 id="blocks" class="mt-8 text-sm tracking-widest uppercase">
	3 · Blocks — molecules + organisms
</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	Composed pieces that replace shared chrome and content cells. shadcn would call these blocks.
</p>

<ReviewItem
	id="B1"
	group="blocks"
	title="Subscribe — Field + Action"
	why="footer Subscribe is Input + Button. Atlas: MicroLabel, hairline input, Action. Toast stays inverted (no hue)."
	{ink}
>
	{#snippet before()}
		<Subscribe />
	{/snippet}
	{#snippet after()}
		<form class="flex max-w-sm flex-col gap-2 sm:flex-row sm:items-end">
			<div class="flex min-w-0 grow flex-col gap-1">
				<MicroLabel>Email</MicroLabel>
				<Input type="email" name="email" placeholder="xinchao@quang.design" />
			</div>
			<Action>Subscribe</Action>
		</form>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="B2"
	group="blocks"
	title="Empty state"
	why="Dashed gray box, rounded, lucide icon. Atlas: dashed 0.5px hair, hatch, label."
	{ink}
>
	{#snippet before()}
		<EmptyState title="No Posts Yet" description="Check back soon." />
	{/snippet}
	{#snippet after()}
		<div class="atlas-hair-dashed flex flex-col items-center gap-2 p-8 text-center">
			<div class="atlas-hatch atlas-hair size-10"></div>
			<MicroLabel>No posts yet</MicroLabel>
			<p class="atlas-row-desc">Check back soon.</p>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="B3"
	group="blocks"
	title="IndexRow replaces the post card"
	why="Thumbnail, date = title size (12px), description one step down (11px). Two orders: title first and description first."
	{ink}
>
	{#snippet before()}
		<div class="max-w-sm">
			<PostCard post={samplePost} hrefPrefix="/design" />
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-1">
				<MicroLabel>Option A — title, then description</MicroLabel>
				<div class="atlas-stack flex flex-col">
					<IndexRow
						code="D1"
						thumbnail="/design/posts/doppio/doppio_1.avif"
						title="Doppio Kaffè"
						date="2023-01-01"
						description="Five years of brand character for a coffee shop."
					/>
					<IndexRow placeholder code="D3" title="Dream Sweets" date="2022-11-04" />
				</div>
			</div>
			<div class="flex flex-col gap-1">
				<MicroLabel>Option B — description, then title</MicroLabel>
				<div class="atlas-stack flex flex-col">
					<IndexRow
						reverse
						code="D1"
						thumbnail="/design/posts/doppio/doppio_1.avif"
						title="Doppio Kaffè"
						date="2023-01-01"
						description="Five years of brand character for a coffee shop."
					/>
				</div>
			</div>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="B4"
	group="blocks"
	title="ReadingPane + Markdown"
	why="Home columns and blog posts use renderer.svelte (semibold headings, blue links, Shiki). Atlas: eyebrow, display title, labelled sections, Mark, 13px prose. Code: hairline box, no theme background."
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
	id="B5"
	group="blocks"
	title="StatusBar replaces the navbar"
	why="Avatar + slash links + clock + theme toggle. Atlas: repository, location, country, live local time, Action."
	stacked
	{ink}
>
	{#snippet before()}
		<Navbar />
	{/snippet}
	{#snippet after()}
		<div class="atlas-hair">
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
	id="B6"
	group="blocks"
	title="IndexTree replaces flat nav"
	why="Four inline links, mobile Select. Atlas: grouped tree, codes, counts. Nesting is indent only. Telescopic sits under Engineer."
	{ink}
>
	{#snippet before()}
		<nav class="flex flex-wrap items-center gap-4 text-sm">
			<a href="/">Quang</a><span class="text-muted-foreground">/</span>
			<a href="/design">Design</a><span class="text-muted-foreground">/</span>
			<a href="/engineer">Engineer</a><span class="text-muted-foreground">/</span>
			<a href="/blog">Blog</a>
		</nav>
	{/snippet}
	{#snippet after()}
		<div class="atlas-hair">
			<IndexTree groups={treeGroups} active="E1" />
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="B7"
	group="blocks"
	title="HintBar replaces the footer quote"
	why="Footer is Urban Dictionary quote + copyright + Subscribe. Atlas: glyph legend. Subscribe moves to a field in the reading column or status actions."
	stacked
	{ink}
>
	{#snippet before()}
		<Footer />
	{/snippet}
	{#snippet after()}
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
	{/snippet}
</ReviewItem>
