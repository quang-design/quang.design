<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import { onMount } from 'svelte';
	import { toggleMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import XIcon from '@lucide/svelte/icons/x';
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

<header class={cn('flex h-full w-full min-w-0 items-stretch', className)}>
	<a href={resolve('/')} class="home-mark" aria-label="Go home">
		<span class="ink-label home-mark-kicker">
			<span class="home-mark-idle">Welcome to</span>
			<span class="home-mark-go">Go home</span>
		</span>
		<span class="truncate">{title}</span>
	</a>
	<div class="status-place">
		<Rule orientation="vertical" />
		<StatCell label="Location" value="Nha Trang" class="justify-center px-3" />
		<Rule orientation="vertical" />
		<StatCell label="Country" value="Vietnam" class="justify-center px-3" />
	</div>
	<Rule orientation="vertical" />
	<StatCell label="Local time" value={localTime} class="justify-center px-3" />
	<div class="ml-auto flex h-full shrink-0 items-stretch">
		<Rule orientation="vertical" />
		<Button
			variant="ghost"
			size="icon-lg"
			onclick={onMenu}
			aria-expanded={menuOpen}
			aria-controls="site-index"
			class="h-full w-[calc(var(--grid)*2)] rounded-none lg:hidden"
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
			class="h-full w-[calc(var(--grid)*2)] rounded-none"
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
		flex-direction: column;
		justify-content: center;
		padding-inline: calc(var(--spacing) * 3);
		color: inherit;
		text-decoration: none;
	}

	.home-mark:hover,
	.home-mark:focus-visible {
		background-color: var(--ink-10);
	}

	.home-mark:focus-visible {
		outline: var(--hair) solid var(--ink);
		outline-offset: calc(var(--spacing) * -1);
	}

	.home-mark-kicker {
		display: grid;
	}

	.home-mark-idle,
	.home-mark-go {
		grid-area: 1 / 1;
	}

	.home-mark-go {
		opacity: 0;
	}

	.home-mark:hover .home-mark-idle,
	.home-mark:focus-visible .home-mark-idle {
		opacity: 0;
	}

	.home-mark:hover .home-mark-go,
	.home-mark:focus-visible .home-mark-go {
		opacity: 1;
	}
</style>
