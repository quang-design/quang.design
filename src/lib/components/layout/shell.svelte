<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { afterNavigate } from '$app/navigation';
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
	let menuOpen = $state(false);

	afterNavigate(() => {
		menuOpen = false;
	});

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') menuOpen = false;
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div class="shell" data-menu-open={menuOpen ? '' : undefined}>
	<div class="shell-sheet">
		<div class="shell-head">
			<StatusBar {menuOpen} onMenu={toggleMenu} />
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
					<div class="reading-pane flex h-full min-h-[calc(var(--grid)*2)] flex-col p-3">
						<MicroLabel>Detail</MicroLabel>
						<p class="ink-row-desc">Hover a row or a link to preview.</p>
					</div>
				{/if}
			</div>
		</div>
		<div class="shell-foot">
			<div
				class="grid h-full grid-cols-1 sm:grid-cols-[minmax(0,1fr)_var(--reading-col)] lg:grid-cols-[var(--index-col)_minmax(0,1fr)_var(--reading-col)]"
			>
				<div class="hidden lg:block" aria-hidden="true"></div>
				<div class="flex flex-col justify-center px-3 py-[var(--grid)] sm:h-full sm:py-0">
					<blockquote class="italic">
						"The best person ever to exist."
						<a href="http://quang.urbanup.com/9858947">Urban Dictionary</a>
					</blockquote>
					<p class="ink-label">&copy; {year} Quang Design. All rights reserved.</p>
				</div>
				<div class="flex items-center px-3 pb-[var(--grid)] sm:h-full sm:py-0">
					<Subscribe />
				</div>
			</div>
		</div>
		<div class="shell-rule shell-rule-index" aria-hidden="true"></div>
		<div class="shell-rule shell-rule-reading" aria-hidden="true"></div>
	</div>
</div>
