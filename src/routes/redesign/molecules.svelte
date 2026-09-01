<script lang="ts">
	import { resolve } from '$app/paths';
	import ReviewItem from './review-item.svelte';
	import PostCard from '$lib/components/shared/post-card.svelte';
	import EmptyState from '$lib/components/shared/empty-state.svelte';
	import Subscribe from '$lib/components/shared/subscribe.svelte';
	import { Markdown } from '$lib/components/markdown';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import { IndexRow } from '$lib/components/layout';

	const samplePost = {
		slug: 'doppio',
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
	Subscribe shares one hairline stack so input and button match. IndexRow is Option A.
</p>

<ReviewItem
	id="M1"
	group="molecules"
	title="Field — subscribe"
	why="Root cause of the height/border mismatch: separate 1px vs 0.5px borders and padding-based action height. Live field is one h-8 stack with a mail icon."
>
	{#snippet before()}
		<form class="flex items-center gap-2">
			<input class="h-8 rounded-lg border px-2.5" placeholder="Enter your email" />
			<button class="rounded-lg bg-black px-2.5 py-1.5 text-sm text-white">Subscribe</button>
		</form>
	{/snippet}
	{#snippet after()}
		<div class="max-w-sm">
			<Subscribe />
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="M2"
	group="molecules"
	title="IndexRow replaces the post card"
	why="Option A — title, then description. Design index uses a large caps brand + tagline."
>
	{#snippet before()}
		<div class="max-w-sm">
			<PostCard post={samplePost} hrefPrefix="/design" />
		</div>
	{/snippet}
	{#snippet after()}
		<div class="stack flex flex-col">
			<IndexRow
				code="D1"
				thumbnail="/design/posts/doppio/doppio_1.avif"
				title="DOPPIO KAFFÈ"
				date="2023-01-01"
				description="5 Years of Crafting Doppio Kaffè's Cozy Character"
				href="/design/doppio"
				display
			/>
			<IndexRow placeholder code="D3" title="DREAM SWEETS" date="2022-11-04" display />
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="M3"
	group="molecules"
	title="Engineer card"
	why="IndexRow with E-codes. External stays a glyph, not a colour."
>
	{#snippet before()}
		<a
			href={resolve('/engineer/telescopic')}
			class="flex max-w-sm flex-col justify-between border-[0.5px] border-black/20 p-6"
		>
			<h2 class="mb-2 flex items-center gap-1 text-lg font-semibold">
				Telescopic Text
				<ArrowUpRightIcon class="h-4 w-4" />
			</h2>
			<p class="text-sm text-neutral-400">Click a word. It grows.</p>
		</a>
	{/snippet}
	{#snippet after()}
		<div class="stack flex flex-col">
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
	{#snippet before()}
		<div class="rounded-lg border-2 border-dashed border-neutral-300 p-12 text-center">
			<p>No Posts Yet</p>
		</div>
	{/snippet}
	{#snippet after()}
		<EmptyState title="No Posts Yet" description="Check back soon." />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="M5"
	group="molecules"
	title="Code block"
	why="Hairline box, no theme background. Same Shiki highlighter, chrome removed."
>
	{#snippet before()}
		<div class="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm">
			<code>function greet() {'{}'}</code>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="prose max-w-none text-sm">
			<Markdown md={codeMd} />
		</div>
	{/snippet}
</ReviewItem>
