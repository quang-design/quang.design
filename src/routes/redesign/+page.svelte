<script lang="ts">
	import { resolve } from '$app/paths';
	import { review } from './review.svelte';
	import { Action } from '$lib/components/primitives';
	import Tokens from './tokens.svelte';
	import Subatomic from './subatomic.svelte';
	import Atoms from './atoms.svelte';
	import Molecules from './molecules.svelte';
	import Organisms from './organisms.svelte';
	import Pages from './pages.svelte';
	import { catalogNav, siteCoverage } from './catalog';
	import type { EngineerProject } from '$lib/content/engineer';
	import type { PostMetadata } from '$lib/content/loader';

	let {
		data
	}: { data: { design: PostMetadata[]; blog: PostMetadata[]; engineer: EngineerProject[] } } =
		$props();

	let copied = $state(false);

	let now = $state(new Date());
	$effect(() => {
		const id = setInterval(() => (now = new Date()), 1000);
		return () => clearInterval(id);
	});

	const localTime = $derived(
		new Intl.DateTimeFormat('en-GB', {
			timeZone: 'Asia/Ho_Chi_Minh',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		}).format(now)
	);

	const treeGroups = $derived([
		{
			label: 'Index',
			rows: [
				{ code: 'Q', label: 'Quang' },
				{ code: 'D', label: 'Design', count: data.design.length },
				{ code: 'E', label: 'Engineer', count: data.engineer.length },
				{ code: 'E1', label: 'Telescopic Text', nested: true },
				{ code: 'E2', label: 'Microscopic Text', nested: true },
				{ code: 'E3', label: 'Animation Vocabulary', nested: true },
				{ code: 'E4', label: 'Minesweeper', nested: true },
				{ code: 'B', label: 'Blog', count: data.blog.length }
			]
		},
		{
			label: 'Reference',
			rows: [{ code: 'S', label: 'Styles' }]
		}
	]);

	async function copySummary() {
		await navigator.clipboard.writeText(review.summary);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<svelte:head>
	<title>Paper design catalog</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex w-full flex-col gap-6 p-4 pb-16 md:p-6">
	<header
		class="atlas-hair sticky top-0 z-10 flex flex-col gap-3 bg-[var(--paper)] py-3 md:flex-row md:flex-wrap md:items-center"
	>
		<div class="flex min-w-0 flex-wrap items-baseline gap-3">
			<h1 class="atlas-display text-xl">Paper design catalog</h1>
			<p class="atlas-row-desc">
				{review.count('approved')} approved / {review.count('revise')} revise / {review.count(
					'pending'
				)} pending
			</p>
		</div>
		<nav
			class="-mx-4 flex items-center gap-2 overflow-x-auto px-4 text-xs tracking-widest uppercase md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
		>
			{#each catalogNav as item, i (item.href)}
				{#if i > 0}<span class="atlas-row-desc">/</span>{/if}
				<a href="{resolve('/redesign')}{item.href}" class="atlas-row shrink-0 hover:underline">
					{item.label}
				</a>
			{/each}
		</nav>
		<div class="flex flex-wrap items-center gap-2 md:ml-auto">
			<Action onclick={copySummary}>{copied ? 'Copied' : 'Copy review'}</Action>
			<Action glyph="↺" onclick={() => review.reset()}>Reset</Action>
		</div>
	</header>

	<p class="atlas-row-desc max-w-3xl">
		Atomic design catalog for the Atlas redesign. Review from lowest level (tokens) through full
		pages. Everything renders in Paper so you can finalize the design here before applying to the
		live site. Resize for the responsive shell (stack → two column → three column).
	</p>

	<section id="coverage" class="atlas-hair overflow-x-auto">
		<header class="atlas-rule-b p-3">
			<h2 class="text-sm tracking-widest uppercase">Site coverage</h2>
		</header>
		<table class="w-full min-w-[36rem] text-left text-xs">
			<thead>
				<tr class="atlas-row-desc tracking-widest uppercase">
					<th class="px-3 py-1.5 font-normal">Layer</th>
					<th class="px-3 py-1.5 font-normal">Route / item</th>
					<th class="px-3 py-1.5 font-normal">ID</th>
				</tr>
			</thead>
			<tbody>
				{#each siteCoverage as row, i (row.id + row.item)}
					<tr class={['atlas-rule-b', i % 2 === 1 && 'bg-[var(--ink-10)]']}>
						<td class="px-3 py-1.5 whitespace-nowrap">{row.layer}</td>
						<td class="px-3 py-1.5">{row.item}</td>
						<td class="atlas-label px-3 py-1.5">{row.id}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<Tokens />
	<Subatomic />
	<Atoms />
	<Molecules />
	<Organisms {localTime} {treeGroups} />
	<Pages {localTime} {treeGroups} design={data.design} blog={data.blog} engineer={data.engineer} />

	<details class="atlas-hair mt-8 p-3 text-xs">
		<summary class="atlas-row cursor-pointer tracking-widest uppercase">Review summary</summary>
		<pre class="atlas-read mt-3 whitespace-pre-wrap">{review.summary}</pre>
	</details>
</div>
