<script lang="ts">
	import { resolve } from '$app/paths';
	import ReviewItem from './review-item.svelte';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import Footer from '$lib/components/shared/footer.svelte';
	import { Markdown } from '$lib/components/markdown';
	import { Mark } from '$lib/components/primitives';
	import { StatusBar, IndexTree, IndexRow, ReadingPane } from '$lib/components/layout';
	import Subscribe from '$lib/components/shared/subscribe.svelte';
	import type { TreeGroup } from '$lib/config/tree';

	let { treeGroups }: { treeGroups: TreeGroup[] } = $props();

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
	<div class="stack flex flex-col">
		<IndexRow code="01" title="Design Director @FlexOS" date="2023 — now" />
		<IndexRow code="02" title="Design Manager @FlexOS" date="2022 — 2023" />
	</div>
{/snippet}

<h2 id="organisms" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">5 · Organisms</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	Status bar, index tree, reading pane, and footer. These are the live site pieces.
</p>

<ReviewItem
	id="O1"
	group="organisms"
	title="StatusBar replaces the navbar"
	why="Welcome to / quang.design. Location, country, local time. Original sun/moon toggle."
	stacked
>
	{#snippet before()}
		<Navbar />
	{/snippet}
	{#snippet after()}
		<div class="hair overflow-x-auto">
			<StatusBar title="quang.design" />
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="O2"
	group="organisms"
	title="IndexTree replaces flat nav"
	why="HOME. Design lists every project. Blog lists every article. Engineer is one row — children live on /engineer."
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
		<div class="hair max-h-80 overflow-auto">
			<IndexTree groups={treeGroups} active="H" />
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="O3"
	group="organisms"
	title="ReadingPane + Markdown"
	why="Original content, restyled. Tabs switch. Metadata belongs in this column on real pages."
	stacked
>
	{#snippet before()}
		<div class="prose max-w-none text-sm">
			<Markdown md={homeMd} />
		</div>
	{/snippet}
	{#snippet after()}
		<div class="hair">
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
	title="Footer — quote + subscribe"
	why="Keep the Urban Dictionary quote. No keyboard hint bar. Subscribe field after the M1 revision."
	stacked
>
	{#snippet before()}
		<Footer />
	{/snippet}
	{#snippet after()}
		<div class="hair flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
			<div class="flex min-w-0 flex-col gap-2">
				<blockquote class="italic">
					"The best person ever to exist."
					<a href="http://quang.urbanup.com/9858947">Urban Dictionary</a>
				</blockquote>
			</div>
			<div class="sm:ml-auto sm:w-72">
				<Subscribe />
			</div>
		</div>
	{/snippet}
</ReviewItem>
