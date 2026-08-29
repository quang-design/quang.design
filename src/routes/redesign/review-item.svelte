<script lang="ts">
	import type { Snippet } from 'svelte';
	import { review } from './review.svelte';

	let {
		id,
		group,
		title,
		why,
		fullWidth = false,
		children
	}: {
		id: string;
		group: string;
		title: string;
		why: string;
		fullWidth?: boolean;
		children: Snippet;
	} = $props();

	$effect(() => review.register({ id, group, title }));

	const entry = $derived(review.entry(id));
</script>

<section {id} class="atlas-hair flex flex-col">
	<header class="atlas-rule-b flex flex-wrap items-baseline gap-3 p-3">
		<span class="atlas-label">{id}</span>
		<h3 class="atlas-row-title grow normal-case">{title}</h3>
		<div class="flex items-center gap-2">
			<button
				type="button"
				class={[
					'atlas-hair atlas-row cursor-pointer px-2 py-1',
					entry.verdict === 'approved' && 'atlas-active'
				]}
				onclick={() =>
					review.set(id, { verdict: entry.verdict === 'approved' ? 'pending' : 'approved' })}
			>
				Approve
			</button>
			<button
				type="button"
				class={[
					'atlas-hair atlas-row cursor-pointer px-2 py-1',
					entry.verdict === 'revise' && 'atlas-active'
				]}
				onclick={() =>
					review.set(id, { verdict: entry.verdict === 'revise' ? 'pending' : 'revise' })}
			>
				Revise
			</button>
		</div>
	</header>

	<p class="atlas-row-desc border-b border-[var(--ink-25)] p-3">{why}</p>

	<div class={fullWidth ? 'p-0' : 'p-3'}>{@render children()}</div>

	<label class="atlas-rule-b flex flex-col gap-1 p-3">
		<span class="atlas-label">Note</span>
		<textarea
			rows="2"
			placeholder="What to change…"
			class="atlas-hair w-full bg-[var(--paper)] p-2 text-base"
			value={entry.note}
			oninput={(e) => review.set(id, { note: e.currentTarget.value })}
		></textarea>
	</label>
</section>
