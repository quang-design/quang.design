<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import { Mark, Action } from '$lib/components/primitives';
	import { StatusBar, IndexTree, IndexRow, ReadingPane, HintBar } from '$lib/components/atlas';
	import type { TreeGroup } from '$lib/components/atlas/index-tree.svelte';

	let { localTime, treeGroups }: { localTime: string; treeGroups: TreeGroup[] } = $props();
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
<p class="atlas-row-desc max-w-3xl">
	Composed chrome: StatusBar, IndexTree, ReadingPane, HintBar. These assemble into the four-zone
	shell.
</p>

<ReviewItem
	id="O1"
	group="organisms"
	title="StatusBar"
	why="Repository, location, country, live local time, Action. Scrolls horizontally on small screens."
>
	{#snippet children()}
		<div class="atlas-hair overflow-x-auto">
			<StatusBar
				title="quang.design"
				stats={[
					{ label: 'Location', value: 'Nha Trang' },
					{ label: 'Country', value: 'Vietnam' },
					{ label: 'Local time', value: localTime }
				]}
				actions={['Subscribe']}
			/>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="O2"
	group="organisms"
	title="IndexTree"
	why="Grouped tree, codes, counts. Nesting is indent only. Telescopic sits under Engineer."
>
	{#snippet children()}
		<div class="atlas-hair">
			<IndexTree groups={treeGroups} active="E1" />
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="O3"
	group="organisms"
	title="ReadingPane"
	why="Eyebrow, display title, labelled sections, Mark, 13px prose."
>
	{#snippet children()}
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
	title="HintBar"
	why="Glyph legend. Subscribe moves to a field in the reading column or status actions."
>
	{#snippet children()}
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
