<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import { onMount } from 'svelte';
	import { toggleMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import XIcon from '@lucide/svelte/icons/x';
	import HouseIcon from '@lucide/svelte/icons/house';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';
	import { StatCell, Rule } from '$lib/components/primitives';

	let {
		title = 'quang.design',
		menuOpen = false,
		onMenu,
		class: className
	}: {
		title?: string;
		menuOpen?: boolean;
		onMenu?: () => void;
		class?: string;
	} = $props();

	let date = $state<SvelteDate | null>(null);

	const formatter = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Asia/Ho_Chi_Minh',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	});

	onMount(() => {
		date = new SvelteDate();
		const interval = setInterval(() => date?.setTime(Date.now()), 1000);
		return () => clearInterval(interval);
	});

	const localTime = $derived(date ? formatter.format(date) : '--:--:--');
</script>

<header
	class={cn(
		'flex h-full w-full min-w-0 items-stretch lg:grid lg:grid-cols-[var(--index-col)_minmax(0,1fr)_var(--reading-col)]',
		className
	)}
>
	<div class="status-brand">
		<Button
			href={resolve('/')}
			variant="ghost"
			size="icon-lg"
			class="h-full w-[var(--chrome-btn)] rounded-none"
			aria-label="Go home"
		>
			<HouseIcon class="size-4" />
		</Button>
		<Rule orientation="vertical" />
		<div class="home-mark">
			<span class="ink-label">Welcome to</span>
			<span class="truncate">{title}</span>
		</div>
	</div>
	<div class="status-canvas" aria-hidden="true"></div>
	<div class="status-meta">
		<Rule orientation="vertical" />
		<div class="status-place">
			<StatCell label="Location" value="Nha Trang" class="min-w-0 flex-1 justify-center" />
			<Rule orientation="vertical" />
			<StatCell label="Country" value="Vietnam" class="min-w-0 flex-1 justify-center" />
		</div>
		<Rule orientation="vertical" class="hidden lg:block" />
		<div class="status-time">
			<StatCell label="Local time" value={localTime} class="h-full min-w-0 w-full justify-center" />
		</div>
		<Rule orientation="vertical" />
		<Button
			variant="ghost"
			size="icon-lg"
			onclick={onMenu}
			aria-expanded={menuOpen}
			aria-controls="site-index"
			class="h-full w-[var(--chrome-btn)] rounded-none lg:hidden"
		>
			{#if menuOpen}
				<XIcon class="size-4" />
				<span class="sr-only">Close menu</span>
			{:else}
				<MenuIcon class="size-4" />
				<span class="sr-only">Open menu</span>
			{/if}
		</Button>
		<Rule orientation="vertical" class="lg:hidden" />
		<Button
			variant="ghost"
			size="icon-lg"
			onclick={toggleMode}
			class="h-full w-[var(--chrome-btn)] rounded-none"
		>
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</header>

<style>
	.home-mark {
		display: flex;
		min-width: 0;
		height: 100%;
		flex: 1 1 auto;
		flex-direction: column;
		justify-content: center;
		padding-inline: var(--grid);
		color: inherit;
	}
</style>
