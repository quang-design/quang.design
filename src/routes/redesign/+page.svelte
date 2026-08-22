<script lang="ts">
	import '$lib/styles/atlas.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import { review } from './review.svelte';
	import Foundation from './foundation.svelte';
	import Components from './components.svelte';
	import Blocks from './blocks.svelte';
	import Pages from './pages.svelte';
	import { inventory } from './catalog';
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
		class="border-foreground/25 bg-background sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b-[0.5px] py-3"
	>
		<h1 class="text-lg">Atlas redesign review</h1>
		<p class="text-muted-foreground text-xs">
			{review.count('approved')} approved / {review.count('revise')} revise / {review.count(
				'pending'
			)} pending
		</p>
		<nav
			class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs tracking-widest uppercase"
		>
			<a href="#foundation">Foundation</a>
			<span>/</span>
			<a href="#components">Components</a>
			<span>/</span>
			<a href="#blocks">Blocks</a>
			<span>/</span>
			<a href="#templates">Templates</a>
			<span>/</span>
			<a href="#pages">Pages</a>
		</nav>
		<div class="ml-auto flex items-center gap-2">
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
		Catalog follows shadcn-svelte: tokens first, then <code>ui/</code> components (data-slot, OKLCH,
		Tailwind v4), then blocks, templates, pages. After panes are scoped to
		<code>.atlas</code>. Resize for the responsive shell (stack → two column → three column).
	</p>

	<section id="inventory" class="border-foreground/25 overflow-x-auto border-[0.5px]">
		<header class="border-foreground/25 border-b-[0.5px] px-3 py-2">
			<h2 class="text-sm tracking-widest uppercase">What has to change</h2>
		</header>
		<table class="w-full text-left text-xs">
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

	<Foundation {ink} />
	<Components {ink} />
	<Blocks {ink} {localTime} {treeGroups} />
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
