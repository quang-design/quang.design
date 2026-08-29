<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import { DesignMarkdown } from '$lib/components/markdown';
	import { Input } from '$lib/components/ui/input/index.js';
	import { MicroLabel, Action } from '$lib/components/primitives';
	import { IndexRow } from '$lib/components/atlas';

	const galleryMd = `![](/design/posts/doppio/doppio_1.avif)

![](/design/posts/doppio/doppio_2.avif)

<!-- 2col -->

![](/design/posts/doppio/doppio_3.avif)
![](/design/posts/doppio/doppio_4.avif)`;
</script>

<h2 id="molecules" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">4 · Molecules</h2>
<p class="atlas-row-desc max-w-3xl">
	Blocks composed from atoms: Field (label + control + action), IndexRow, design gallery, code
	block.
</p>

<ReviewItem
	id="M1"
	group="molecules"
	title="Field — subscribe"
	why="Footer Subscribe is Input + Button + sonner. Atlas: MicroLabel, hairline input, Action."
>
	{#snippet children()}
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
	id="M2"
	group="molecules"
	title="IndexRow replaces the post card"
	why="Thumbnail, date = title (text-base). Description is text-xs. Two orders: title first and description first."
>
	{#snippet children()}
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
	id="M3"
	group="molecules"
	title="Engineer card"
	why="/engineer is a card grid with ArrowUpRight. Atlas: IndexRow with E-codes."
>
	{#snippet children()}
		<div class="atlas-stack flex flex-col">
			<IndexRow
				code="E1"
				placeholder
				title="Telescopic Text"
				description="Click a word. It grows."
				href="/engineer/telescopic"
			/>
			<IndexRow
				code="E4"
				placeholder
				title="Minesweeper"
				description="A classic, drawn with hatch."
				href="/engineer/minesweeper"
			/>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem id="M4" group="molecules" title="Empty state" why="Dashed 0.5px hair, hatch, label.">
	{#snippet children()}
		<div class="atlas-hair-dashed flex flex-col items-center gap-2 p-8 text-center">
			<div class="atlas-hatch atlas-hair size-10"></div>
			<MicroLabel>No posts yet</MicroLabel>
			<p class="atlas-row-desc">Check back soon.</p>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="M5"
	group="molecules"
	title="Code block"
	why="markdown/code-block: Shiki, zinc chrome, rounded-xl. Atlas: hairline box, no theme background, 12px mono."
>
	{#snippet children()}
		<div class="atlas-hair p-3">
			<code class="atlas-label">{'function greet() {}'}</code>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="M6"
	group="molecules"
	title="Design gallery + prose"
	why="/design/[slug] splits intro + meta in reading, gallery on canvas. DesignMarkdown handles 2col directives."
>
	{#snippet children()}
		<div class="flex flex-col gap-4">
			<div class="atlas-hair-dashed p-3">
				<MicroLabel>Reading column — intro + meta</MicroLabel>
				<p class="atlas-read mt-2">
					Soft textures, earth tones and handwritten fonts for a welcoming oasis — a home away from
					home.
				</p>
				<p class="atlas-label mt-2">Client: Doppio Kaffè · Project: Brand Identity</p>
			</div>
			<div class="atlas-hair p-2">
				<MicroLabel>Canvas — gallery</MicroLabel>
				<div class="mt-2">
					<DesignMarkdown md={galleryMd} />
				</div>
			</div>
		</div>
	{/snippet}
</ReviewItem>
