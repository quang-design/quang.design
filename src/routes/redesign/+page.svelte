<script lang="ts">
	import '$lib/styles/atlas.css';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import { review } from './review.svelte';
	import Tokens from './tokens.svelte';
	import Subatomic from './subatomic.svelte';
	import Atoms from './atoms.svelte';
	import Molecules from './molecules.svelte';
	import Organisms from './organisms.svelte';
	import Pages from './pages.svelte';
	import { catalogNav, inventory } from './catalog';
	import type { EngineerProject } from '$lib/content/engineer';
	import type { PostMetadata } from '$lib/content/loader';

	let {
		data
	}: { data: { design: PostMetadata[]; blog: PostMetadata[]; engineer: EngineerProject[] } } =
		$props();

	let ink = $state(false);
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
	<title>Atlas redesign review</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex w-full flex-col gap-6 pb-16">
	<header
		class="border-foreground/25 bg-background sticky top-0 z-10 flex flex-col gap-3 border-b-[0.5px] py-3 md:flex-row md:flex-wrap md:items-center"
	>
		<div class="flex min-w-0 flex-wrap items-baseline gap-3">
			<h1 class="text-lg">Atlas redesign review</h1>
			<p class="text-muted-foreground text-xs">
				{review.count('approved')} approved / {review.count('revise')} revise / {review.count(
					'pending'
				)} pending
			</p>
		</div>
		<nav
			class="-mx-4 flex items-center gap-2 overflow-x-auto px-4 text-xs tracking-widest uppercase md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
		>
			{#each catalogNav as item, i (item.href)}
				{#if i > 0}<span class="text-muted-foreground">/</span>{/if}
				<a href="{resolve('/redesign')}{item.href}" class="shrink-0">
					{item.label}
				</a>
			{/each}
		</nav>
		<div class="flex flex-wrap items-center gap-2 md:ml-auto">
			<Button variant="outline" size="sm" class="cursor-pointer" onclick={() => (ink = !ink)}>
				{ink ? 'Paper theme' : 'Ink theme'}
			</Button>
			<Button variant="outline" size="sm" class="cursor-pointer" onclick={copySummary}>
				{copied ? 'Copied' : 'Copy review'}
			</Button>
			<Button variant="ghost" size="sm" class="cursor-pointer" onclick={() => review.reset()}>
				Reset
			</Button>
		</div>
	</header>

	<p class="text-muted-foreground max-w-3xl text-xs">
		Catalog follows atomic design, mapped to shadcn-svelte: tokens (theme CSS variables) →
		sub-atomic rules → <code>ui/</code> atoms → molecules (blocks) → organisms → templates → pages.
		Type and space retune Tailwind <code>--text-*</code> and <code>--spacing</code> so utilities and
		<code>ui/</code> inherit. After panes are scoped to <code>.atlas</code>. Resize for the
		responsive shell (stack → two column → three column).
	</p>

	<section id="inventory" class="border-foreground/25 overflow-x-auto border-[0.5px]">
		<header class="border-foreground/25 border-b-[0.5px] px-3 py-2">
			<h2 class="text-sm tracking-widest uppercase">What has to change</h2>
		</header>
		<table class="w-full min-w-[36rem] text-left text-xs">
			<thead>
				<tr class="text-muted-foreground tracking-widest uppercase">
					<th class="px-3 py-1.5 font-normal">Layer</th>
					<th class="px-3 py-1.5 font-normal">Current</th>
					<th class="px-3 py-1.5 font-normal">Atlas</th>
				</tr>
			</thead>
			<tbody>
				{#each inventory as row, i (row.current)}
					<tr class={['border-foreground/25 border-t-[0.5px]', i % 2 === 1 && 'bg-muted']}>
						<td class="px-3 py-1.5 whitespace-nowrap">{row.layer}</td>
						<td class="px-3 py-1.5">{row.current}</td>
						<td class="px-3 py-1.5">{row.atlas}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<Tokens {ink} />
	<Subatomic {ink} />
	<Atoms {ink} />
	<Molecules {ink} />
	<Organisms {ink} {localTime} {treeGroups} />
	<Pages
		{ink}
		{localTime}
		{treeGroups}
		design={data.design}
		blog={data.blog}
		engineer={data.engineer}
	/>

	<details class="border-foreground/25 mt-8 border-[0.5px] p-3 text-xs">
		<summary class="cursor-pointer tracking-widest uppercase">Review summary</summary>
		<pre class="mt-3 whitespace-pre-wrap">{review.summary}</pre>
	</details>
</div>
