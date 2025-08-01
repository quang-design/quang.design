<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import { toggleMode } from 'mode-watcher';
	import { Sun, Moon, ArrowUpRight } from '@lucide/svelte';
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

	const navLinks = [
		{ label: 'Quang', href: '/' },
		{ label: 'Design', href: 'https://www.behance.net/quanglatoi', external: true },
		{ label: 'Engineer', href: '/engineer' },
		{ label: 'Blog', href: '/blog' }
	];

	let selectedHref = $derived.by(() => {
		const path = page.url.pathname;
		const link = navLinks.find((item) => item.href === path || path.startsWith(item.href + '/'));
		return link?.href ?? '/';
	});

	const selectedLabel = $derived.by(() => {
		const path = page.url.pathname;
		const link = navLinks.find((item) => item.href === path || path.startsWith(item.href + '/'));
		return link?.label ?? '';
	});
</script>

<header class="mx-auto flex w-full items-center justify-between py-4">
	<div class="flex items-center gap-2">
		<a href="/" aria-label="Quang Design">
			<Avatar.Root
				class="size-9 border-gray-600 transition-all duration-300 ease-in-out hover:scale-105"
			>
				<Avatar.Image src="/avatar.avif" alt="@quang.design" />

				<Avatar.Fallback>QN</Avatar.Fallback>
			</Avatar.Root>
		</a>
		<!-- MOBILE -->
		<nav class="block sm:hidden">
			<Select.Root type="single" name="current-page" bind:value={selectedHref}>
				<Select.Trigger class="">
					{selectedLabel}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each navLinks as item (item.href)}
							<Select.Item
								value={item.href}
								label={item.label}
								onclick={() => {
									if (item.external) {
										window.location.href = item.href;
									} else {
										goto(item.href);
									}
								}}
							>
								{item.label}
								{#if item.external}
									<ArrowUpRight class="h-3 w-3" />
								{/if}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</nav>
		<!-- DESKTOP -->
		<nav class="hidden items-center gap-4 sm:flex">
			{#each navLinks as item, i (item.href)}
				<a
					href={item.href}
					class="flex items-center gap-1"
					target={item.external ? '_blank' : undefined}
					rel={item.external ? 'noopener noreferrer' : undefined}
				>
					{item.label}
					{#if item.external}
						<ArrowUpRight class="h-3 w-3" />
					{/if}
				</a>
				{#if i < navLinks.length - 1}
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
