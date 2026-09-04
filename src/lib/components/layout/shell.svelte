<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { page } from '$app/state';
	import StatusBar from './status-bar.svelte';
	import IndexTree from './index-tree.svelte';
	import ReadingPane from './reading-pane.svelte';
	import MicroLabel from '$lib/components/primitives/micro-label.svelte';
	import Subscribe from '$lib/components/shared/subscribe.svelte';
	import { buildIndexTree, type NavData } from '$lib/config/tree';
	import { PreviewState, PREVIEW_KEY } from '$lib/preview.svelte';

	let { nav, children }: { nav: NavData; children: Snippet } = $props();

	const preview = new PreviewState();
	setContext(PREVIEW_KEY, preview);

	const current = $derived(preview.current);
	const tree = $derived(buildIndexTree(nav, page.url.pathname));
	const year = new Date().getFullYear();
</script>

<div class="shell">
	<div class="shell-head">
		<StatusBar />
	</div>
	<div class="shell-body">
		<div class="shell-index">
			<IndexTree groups={tree.groups} active={tree.active} />
		</div>
		<div class="shell-canvas">
			{@render children()}
		</div>
		<div class="shell-reading">
			{#if current}
				<ReadingPane preview={current} />
			{:else}
				<div class="reading-pane flex h-full min-h-32 flex-col gap-2 p-3">
					<MicroLabel>Detail</MicroLabel>
					<p class="ink-row-desc">Hover a row or a link to preview.</p>
				</div>
			{/if}
		</div>
	</div>
	<div class="shell-foot">
		<div class="grid grid-cols-1 items-stretch sm:grid-cols-[minmax(0,1fr)_calc(var(--grid)*14)]">
			<div class="flex flex-col justify-center gap-2 px-3 py-3">
				<blockquote class="italic">
					"The best person ever to exist."
					<a href="http://quang.urbanup.com/9858947">Urban Dictionary</a>
				</blockquote>
				<p class="ink-label">&copy; {year} Quang Design. All rights reserved.</p>
			</div>
			<div class="flex items-center px-3 py-3 sm:border-l-[length:var(--hair)]">
				<Subscribe />
			</div>
		</div>
	</div>
</div>
