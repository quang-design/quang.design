<script lang="ts">
	import type { Snippet } from 'svelte';
	import { review } from './review.svelte';

	let {
		id,
		group,
		title,
		why,
		stacked = false,
		ink = false,
		before,
		after
	}: {
		id: string;
		group: string;
		title: string;
		why: string;
		stacked?: boolean;
		ink?: boolean;
		before: Snippet;
		after: Snippet;
	} = $props();

	$effect(() => review.register({ id, group, title }));

	const entry = $derived(review.entry(id));
</script>

<section {id} class="border-foreground/25 flex flex-col border-[0.5px]">
	<header class="border-foreground/25 flex flex-wrap items-baseline gap-3 border-b-[0.5px] p-3">
		<span class="text-muted-foreground text-xs tracking-widest uppercase">{id}</span>
		<h3 class="grow text-base">{title}</h3>
		<div class="flex items-center gap-2">
			<button
				type="button"
				class="border-foreground/25 cursor-pointer border-[0.5px] px-2 py-1 text-xs uppercase"
				class:bg-foreground={entry.verdict === 'approved'}
				class:text-background={entry.verdict === 'approved'}
				onclick={() =>
					review.set(id, { verdict: entry.verdict === 'approved' ? 'pending' : 'approved' })}
			>
				Approve
			</button>
			<button
				type="button"
				class="border-foreground/25 cursor-pointer border-[0.5px] px-2 py-1 text-xs uppercase"
				class:bg-foreground={entry.verdict === 'revise'}
				class:text-background={entry.verdict === 'revise'}
				onclick={() =>
					review.set(id, { verdict: entry.verdict === 'revise' ? 'pending' : 'revise' })}
			>
				Revise
			</button>
		</div>
	</header>

	<p class="text-muted-foreground border-foreground/25 border-b-[0.5px] p-3 text-xs">{why}</p>

	<div class="grid grid-cols-1 {stacked ? '' : 'md:grid-cols-2'}">
		<div
			class="border-foreground/25 flex flex-col border-b-[0.5px] {stacked
				? ''
				: 'md:border-r-[0.5px] md:border-b-0'}"
		>
			<span class="text-muted-foreground px-3 pt-3 text-xs tracking-widest uppercase">
				Before &mdash; current site
			</span>
			<div class="p-3">{@render before()}</div>
		</div>
		<div class="flex flex-col">
			<span class="text-muted-foreground px-3 pt-3 text-xs tracking-widest uppercase">
				After &mdash; atlas
			</span>
			<div class="atlas p-3" class:atlas-ink={ink}>{@render after()}</div>
		</div>
	</div>

	<label class="border-foreground/25 flex flex-col gap-1 border-t-[0.5px] p-3">
		<span class="text-muted-foreground text-xs tracking-widest uppercase">Note for Devin</span>
		<textarea
			rows="2"
			placeholder="What to change…"
			class="border-foreground/25 bg-background w-full border-[0.5px] p-2 text-xs"
			value={entry.note}
			oninput={(e) => review.set(id, { note: e.currentTarget.value })}
		></textarea>
	</label>
</section>
