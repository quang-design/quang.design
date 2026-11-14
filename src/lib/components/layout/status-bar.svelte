<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import { onMount } from 'svelte';
	import { mode, setMode } from 'mode-watcher';
	import { lockUserMode } from '$lib/config/theme';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import XIcon from '@lucide/svelte/icons/x';
	import HouseIcon from '@lucide/svelte/icons/house';
	import { resolve } from '$app/paths';
	import { Button } from '@ui-sdk/svelte/button';
	import { Toggle } from '@ui-sdk/svelte/toggle';
	import { StatCell } from '$lib/components/primitives';

	let {
		title = 'quang.design',
		menuOpen = $bindable(false),
		class: className
	}: {
		title?: string;
		menuOpen?: boolean;
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
	const chromeClass =
		'relative inline-flex h-full w-[var(--chrome-btn)] shrink-0 cursor-pointer items-center justify-center rounded-none border-transparent bg-transparent outline-none select-none hover:bg-foreground hover:text-background [&_svg]:pointer-events-none [&_svg]:shrink-0';
	const statClass =
		'stat-cell hair-l h-full w-[calc(var(--grid)*6)] shrink-0 justify-center px-[var(--grid)]';

	function themePressed() {
		return mode.current === 'dark';
	}

	function setThemePressed(pressed: boolean) {
		lockUserMode();
		setMode(pressed ? 'dark' : 'light');
	}
</script>

<header
	class={[
		'flex h-full w-full min-w-0 items-stretch overflow-hidden lg:grid lg:grid-cols-[var(--index-col)_minmax(0,1fr)_var(--reading-col)] lg:grid-rows-1',
		className
	]}
>
	<div class="status-brand">
		<Button class={['hair-r', chromeClass]} aria-label="Go home">
			{#snippet render({ props })}
				<a {...props} href={resolve('/')}>
					<HouseIcon class="size-4" />
				</a>
			{/snippet}
		</Button>
		<div class="home-mark">
			<span class="ink-label">Welcome to</span>
			<span class="truncate">{title}</span>
		</div>
	</div>
	<div class="status-canvas">
		<div class="status-place">
			<StatCell label="Location" value="Nha Trang" class={statClass} />
			<StatCell label="Country" value="Vietnam" class={statClass} />
		</div>
		<div class="status-time">
			<StatCell label="Local time" value={localTime} class={statClass} />
		</div>
	</div>
	<div class="status-meta">
		<Button
			aria-label="Site menu"
			aria-controls="site-index"
			aria-expanded={menuOpen}
			class={[chromeClass, 'hair-l lg:hidden']}
			onclick={() => {
				menuOpen = !menuOpen;
			}}
		>
			{#if menuOpen}
				<XIcon class="size-4" aria-hidden="true" />
			{:else}
				<MenuIcon class="size-4" aria-hidden="true" />
			{/if}
		</Button>
		<Toggle
			bind:pressed={themePressed, setThemePressed}
			aria-label="Dark mode"
			class={[chromeClass, 'hair-l']}
		>
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				aria-hidden="true"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				aria-hidden="true"
			/>
		</Toggle>
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
