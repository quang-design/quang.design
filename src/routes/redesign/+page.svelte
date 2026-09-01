<script lang="ts">
	import { resolve } from '$app/paths';
	import { toggleMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
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
	import { buildIndexTree } from '$lib/config/tree';

	let {
		data
	}: { data: { design: PostMetadata[]; blog: PostMetadata[]; engineer: EngineerProject[] } } =
		$props();

	let copied = $state(false);

	const treeGroups = $derived(
		buildIndexTree({ design: data.design, blog: data.blog, engineer: data.engineer }, '/').groups
	);

	async function copySummary() {
		await navigator.clipboard.writeText(review.summary);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<svelte:head>
	<title>Redesign review</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex w-full flex-col gap-6 pb-16">
	<header class="rule-b bg-background sticky top-0 z-10 flex flex-col gap-3 py-3 md:flex-row md:flex-wrap md:items-center">
		<div class="flex min-w-0 flex-wrap items-baseline gap-3">
			<h1 class="text-lg">Redesign review</h1>
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
			<Button variant="outline" size="icon" class="cursor-pointer" onclick={toggleMode}>
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
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
		This catalog is the same design system as the live site. After panes and page iframes are the
		real chrome — comment here, then look at <a href={resolve('/')}>/</a>,
		<a href={resolve('/design')}>/design</a>, <a href={resolve('/engineer')}>/engineer</a>, and
		<a href={resolve('/blog')}>/blog</a> for the applied layout.
		<code>/anh-nhi</code> stays out of scope.
	</p>

	<section id="inventory" class="hair overflow-x-auto">
		<header class="rule-b px-3 py-2">
			<h2 class="text-sm tracking-widest uppercase">What changed</h2>
		</header>
		<table class="w-full min-w-[36rem] text-left text-xs">
			<thead>
				<tr class="text-muted-foreground tracking-widest uppercase">
					<th class="px-3 py-1.5 font-normal">Layer</th>
					<th class="px-3 py-1.5 font-normal">Previous</th>
					<th class="px-3 py-1.5 font-normal">Live</th>
				</tr>
			</thead>
			<tbody>
				{#each inventory as row, i (row.current)}
					<tr class={['border-t-[length:var(--hair)]', i % 2 === 1 && 'bg-muted']}>
						<td class="px-3 py-1.5 whitespace-nowrap">{row.layer}</td>
						<td class="px-3 py-1.5">{row.current}</td>
						<td class="px-3 py-1.5">{row.next}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<Tokens />
	<Subatomic />
	<Atoms />
	<Molecules />
	<Organisms {treeGroups} />
	<Pages design={data.design} blog={data.blog} engineer={data.engineer} />

	<details class="hair mt-8 p-3 text-xs">
		<summary class="cursor-pointer tracking-widest uppercase">Review summary</summary>
		<pre class="mt-3 whitespace-pre-wrap">{review.summary}</pre>
	</details>
</div>
