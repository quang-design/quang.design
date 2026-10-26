<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { onMount, setContext } from 'svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
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
	let menuOpener: HTMLElement | null = null;
	let shell: HTMLDivElement | undefined;
	let activeIndex: number | null = null;
	const shellScroll = readShellScroll();

	const trackShell: Attachment<HTMLDivElement> = (element) => {
		shell = element;
		return () => {
			if (shell === element) shell = undefined;
		};
	};

	function readShellScroll(): Record<string, number> {
		if (typeof sessionStorage === 'undefined') return {};
		try {
			const raw = sessionStorage.getItem('quang:shell-scroll');
			const parsed: unknown = raw ? JSON.parse(raw) : {};
			if (!parsed || typeof parsed !== 'object') return {};
			return Object.fromEntries(
				Object.entries(parsed).filter(
					(entry): entry is [string, number] => typeof entry[1] === 'number'
				)
			);
		} catch {
			return {};
		}
	}

	function historyIndex(): number | null {
		const index = history.state?.['sveltekit:history'];
		return typeof index === 'number' ? index : null;
	}

	function rememberShellScroll() {
		if (!shell || activeIndex == null) return;
		shellScroll[String(activeIndex)] = shell.scrollTop;
		sessionStorage.setItem('quang:shell-scroll', JSON.stringify(shellScroll));
	}

	function showShellTarget(hash: string) {
		if (!shell) return;
		const id = hash.length > 1 ? decodeURIComponent(hash.slice(1)) : '';
		const target = id ? document.getElementById(id) : null;
		if (target) target.scrollIntoView();
		else shell.scrollTo(0, 0);
	}

	beforeNavigate((navigation) => {
		if (navigation.type === 'leave') return;
		rememberShellScroll();
	});

	afterNavigate((navigation) => {
		menuOpen = false;
		if (!shell || navigation.type === 'enter') return;

		if (navigation.type === 'popstate') {
			activeIndex = historyIndex();
			const saved = activeIndex == null ? undefined : shellScroll[String(activeIndex)];
			if (typeof saved === 'number') shell.scrollTo(0, saved);
			return;
		}

		showShellTarget(navigation.to?.url.hash ?? '');
		activeIndex = historyIndex();
		rememberShellScroll();
	});

	onMount(() => {
		activeIndex = historyIndex();
		rememberShellScroll();
	});

	function closeMenu(restoreFocus = false) {
		menuOpen = false;
		if (restoreFocus) menuOpener?.focus();
	}

	function toggleMenu() {
		if (menuOpen) {
			closeMenu(true);
			return;
		}
		menuOpener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		menuOpen = true;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && menuOpen) closeMenu(true);
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div class="shell" {@attach trackShell} data-menu-open={menuOpen ? '' : undefined}>
	<a
		href="#main-content"
		class="sr-only inline-flex h-[var(--grid)] items-center bg-[var(--ink)] px-[var(--grid)] text-[var(--paper)] focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50"
	>
		Skip to content
	</a>
	<div class="shell-sheet">
		<div class="shell-head">
			<StatusBar {menuOpen} onMenu={toggleMenu} />
		</div>
		<div class="shell-body">
			<div class="shell-index">
				<IndexTree groups={tree.groups} active={tree.active} />
			</div>
			<main id="main-content" class="shell-canvas" tabindex="-1">
				{@render children()}
			</main>
			<div class="shell-reading">
				{#if current}
					<ReadingPane preview={current} />
				{:else}
					<div
						class="reading-pane flex h-full min-h-[calc(var(--grid)*2)] flex-col p-[var(--grid)]"
					>
						<MicroLabel>Detail</MicroLabel>
						<p class="ink-row-desc">Hover a row or a link to preview.</p>
					</div>
				{/if}
			</div>
		</div>
		<footer class="shell-foot">
			<div
				class="grid h-full grid-cols-1 lg:grid-cols-[var(--index-col)_minmax(0,1fr)_var(--reading-col)]"
			>
				<div class="hidden lg:block" aria-hidden="true"></div>
				<div
					class="grid grid-cols-1 gap-x-[calc(var(--grid)*2)] px-[var(--grid)] py-[var(--grid)] sm:h-full sm:grid-cols-2 sm:py-0"
				>
					<div class="flex min-w-0 flex-col justify-center">
						<blockquote class="italic">
							"The best person ever to exist."
							<a href="http://quang.urbanup.com/9858947">Urban Dictionary</a>
						</blockquote>
						<p class="ink-label">&copy; {year} Quang Design. All rights reserved.</p>
					</div>
					<div class="flex min-w-0 items-center">
						<Subscribe />
					</div>
				</div>
				<div class="hidden lg:block" aria-hidden="true"></div>
			</div>
		</footer>
		<div class="shell-rule shell-rule-index" aria-hidden="true"></div>
		<div class="shell-rule shell-rule-reading" aria-hidden="true"></div>
	</div>
</div>
