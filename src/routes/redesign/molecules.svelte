<script lang="ts">
	import { resolve } from '$app/paths';
	import ReviewItem from './review-item.svelte';
	import PostCard from '$lib/components/shared/post-card.svelte';
	import EmptyState from '$lib/components/shared/empty-state.svelte';
	import Subscribe from '$lib/components/shared/subscribe.svelte';
	import { Markdown } from '$lib/components/markdown';
	import { Input } from '$lib/components/ui/input/index.js';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import { MicroLabel, Action } from '$lib/components/primitives';
	import { IndexRow } from '$lib/components/atlas';

	let { ink = false }: { ink?: boolean } = $props();

	const samplePost = {
		slug: 'doppio-kaffe',
		title: "5 Years of Crafting Doppio Kaffè's Cozy Character",
		description:
			"As a designer and loyal patron, it's been my privilege to help shape the branding for Doppio Kaffè over the past 5 years.",
		thumbnail: '/design/posts/doppio/doppio_1.avif',
		date: '2023-01-01'
	};

	const codeMd = '```ts\nfunction greet() {}\n```';
</script>

<h2 id="molecules" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">4 · Molecules</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	shadcn would call these blocks: a few atoms composed. Field follows the latest Field pattern
	(label + control + action) without installing <code>ui/field</code>.
</p>

<ReviewItem
	id="M1"
	group="molecules"
	title="Field — subscribe"
	why="footer Subscribe is Input + Button + sonner. Latest shadcn Field is label + control + action. Atlas: MicroLabel, hairline input, Action."
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
	id="M2"
	group="molecules"
	title="IndexRow replaces the post card"
	why="Thumbnail, date = title (text-base). Description is text-xs. Stacks on small screens. Two orders: title first and description first."
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
	id="M3"
	group="molecules"
	title="Engineer card"
	why="/engineer is a 1/2/3 column card grid with ArrowUpRight and hover fill. Atlas: IndexRow with E-codes. External stays a glyph in the title, not a colour."
	{ink}
>
	{#snippet before()}
		<a
			href={resolve('/engineer/telescopic')}
			class="border-foreground/25 flex max-w-sm flex-col justify-between border-[0.5px] p-6 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
		>
			<h2 class="mb-2 flex items-center gap-1 text-lg font-semibold">
				Telescopic Text
				<ArrowUpRightIcon class="h-4 w-4" />
			</h2>
			<p class="text-sm text-neutral-400">Click a word. It grows.</p>
		</a>
	{/snippet}
	{#snippet after()}
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

<ReviewItem
	id="M4"
	group="molecules"
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
	id="M5"
	group="molecules"
	title="Code block"
	why="markdown/code-block: Shiki, zinc chrome, rounded-xl. Atlas: hairline box, no theme background, 12px mono."
	{ink}
>
	{#snippet before()}
		<div class="prose max-w-none text-sm">
			<Markdown md={codeMd} />
		</div>
	{/snippet}
	{#snippet after()}
		<div class="atlas-hair p-3">
			<code class="atlas-label">{'function greet() {}'}</code>
		</div>
	{/snippet}
</ReviewItem>
