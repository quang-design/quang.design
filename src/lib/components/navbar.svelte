<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import { toggleMode } from 'mode-watcher';
	import { Sun, Moon } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let date = $state(new SvelteDate());

	const formatter = new Intl.DateTimeFormat(undefined, {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	});

	$effect(() => {
		const interval = setInterval(() => {
			date.setTime(Date.now());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	const navItems = [
		{ label: 'Quang', href: '/' },
		{ label: 'Design', href: '/design' },
		{ label: 'Engineer', href: '/engineer' },
		{ label: 'Blog', href: '/blog' }
	];

	let currentPage = $derived(page.url.pathname);

	const triggerContent = $derived(navItems.find((f) => f.href === currentPage)?.label);
</script>

<header class="mx-auto flex w-full items-center justify-between py-4">
	<div class="flex items-center gap-2">
		<a href="/" aria-label="Quang Design">
			<Avatar.Root
				class="size-9 border-gray-600 transition-all duration-300 ease-in-out hover:scale-105"
			>
				<Avatar.Image src="/avatar.jpg" alt="@quang.design" />
				<Avatar.Fallback>QN</Avatar.Fallback>
			</Avatar.Root>
		</a>
		<!-- MOBILE -->
		<nav class="block sm:hidden">
			<Select.Root type="single" name="current-page" bind:value={currentPage}>
				<Select.Trigger class="">
					{triggerContent}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each navItems as item (item.href)}
							<Select.Item value={item.href} label={item.label} onclick={() => goto(item.href)}>
								{item.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</nav>
		<!-- DESKTOP -->
		<nav class="hidden items-center gap-4 sm:flex">
			{#each navItems as item, i (item.href)}
				<a href={item.href}>
					{item.label}
				</a>
				{#if i < navItems.length - 1}
					<span class="text-muted-foreground">/</span>
				{/if}
			{/each}
		</nav>
	</div>

	<div class="flex items-center gap-2">
		<p class="hidden sm:block">{formatter.format(date)}</p>
		<Button variant="outline" size="icon" onclick={toggleMode} class="cursor-pointer">
			<Sun
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
			/>

			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</header>
