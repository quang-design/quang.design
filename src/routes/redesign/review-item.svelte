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

<section {id} class="hair flex flex-col">
	<header class="rule-b flex flex-wrap items-baseline gap-3 p-3">
		<span class="ink-label">{id}</span>
		<h3 class="grow text-base">{title}</h3>
		<div class="flex items-center gap-2">
			<button
				type="button"
				class={[
					'hair cursor-pointer px-2 py-1 text-xs uppercase',
					entry.verdict === 'approved' && 'bg-foreground text-background'
				]}
				onclick={() =>
					review.set(id, { verdict: entry.verdict === 'approved' ? 'pending' : 'approved' })}
			>
				Approve
			</button>
			<button
				type="button"
				class={[
					'hair cursor-pointer px-2 py-1 text-xs uppercase',
					entry.verdict === 'revise' && 'bg-foreground text-background'
				]}
				onclick={() =>
					review.set(id, { verdict: entry.verdict === 'revise' ? 'pending' : 'revise' })}
			>
				Revise
			</button>
		</div>
	</header>

	<p class="text-muted-foreground rule-b p-3 text-xs">{why}</p>

	<div class="grid grid-cols-1 {stacked ? '' : 'md:grid-cols-2'}">
		<div class="rule-b flex flex-col {stacked ? '' : 'md:border-r-[length:var(--hair)] md:border-b-0'}">
			<span class="ink-label px-3 pt-3">Before</span>
			<div class="p-3">{@render before()}</div>
		</div>
		<div class="flex flex-col">
			<span class="ink-label px-3 pt-3">After — live site</span>
			<div class={['p-3', ink && 'dark']}>{@render after()}</div>
		</div>
	</div>

	<label class="rule-b flex flex-col gap-1 border-t-[length:var(--hair)] p-3">
		<span class="ink-label">Note</span>
		<textarea
			rows="2"
			placeholder="What to change…"
			class="hair bg-background w-full p-2 text-xs"
			value={entry.note}
			oninput={(e) => review.set(id, { note: e.currentTarget.value })}
		></textarea>
	</label>
</section>
