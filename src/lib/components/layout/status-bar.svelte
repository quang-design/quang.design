<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import { onMount } from 'svelte';
	import { toggleMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';
	import { StatCell, Rule } from '$lib/components/primitives';

	let {
		title = 'quang.design',
		class: className
	}: {
		title?: string;
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
	<div class="flex min-w-0 flex-col justify-center gap-1 px-3 py-1">
		<span class="ink-label">Welcome to</span>
		<span class="truncate leading-none">{title}</span>
	</div>
	<div class="hidden h-full items-stretch lg:flex">
		<Rule orientation="vertical" />
		<StatCell label="Location" value="Nha Trang" class="justify-center px-3 py-1" />
		<Rule orientation="vertical" />
		<StatCell label="Country" value="Vietnam" class="justify-center px-3 py-1" />
		<Rule orientation="vertical" />
		<StatCell label="Local time" value={localTime} class="justify-center px-3 py-1" />
	</div>
	<div class="ml-auto flex shrink-0 items-center px-2">
		<Button variant="outline" size="icon" onclick={toggleMode} class="size-7 cursor-pointer">
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
