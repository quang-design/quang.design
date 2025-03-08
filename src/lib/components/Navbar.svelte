<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';

	let { onNavItemClick } = $props();

	let date = $state(new SvelteDate());
	let isOpenDev = $state(false);

	function handleSubmenuClick(event: Event) {
		event.stopPropagation();
	}

	$effect(() => {
		const interval = setInterval(() => {
			date.setTime(Date.now());
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<nav class="flex w-full select-none flex-col gap-3">
	<div class="flex flex-col gap-2 text-sm uppercase">
		<div class="home-wrap">
			<a href="/" class="block py-1 transition-all hover:pl-1" onclick={onNavItemClick}>quang</a>
		</div>

		<div class="design-wrap">
			<a href="/design" class="block py-1 transition-all hover:pl-1" onclick={onNavItemClick}
				>design</a
			>
		</div>

		<div class="dev-wrap">
			<div class="flex items-center">
				<a href="/dev" class="block py-1 transition-all hover:pl-1" onclick={onNavItemClick}>dev</a>
				<button
					class="ml-2 text-gray-400 hover:text-white"
					onclick={(e) => {
						isOpenDev = !isOpenDev;
						handleSubmenuClick(e);
					}}
				>
					{isOpenDev ? '[-]' : '[+]'}
				</button>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="dev-wrap-inner ml-4 flex flex-col gap-1 pt-1"
				class:hidden={!isOpenDev}
				onclick={handleSubmenuClick}
			>
				<a
					href="/dev/telescopic"
					class="block py-1 transition-all hover:pl-1"
					onclick={onNavItemClick}
				>
					AI Telescopic Text
				</a>
				<a
					href="/dev/microscopic"
					class="block py-1 transition-all hover:pl-1"
					onclick={onNavItemClick}
				>
					AI Microscopic Text
				</a>
				<a
					href="/dev/minesweeper"
					class="block py-1 transition-all hover:pl-1"
					onclick={onNavItemClick}
				>
					Minesweeper
				</a>
				<a href="/dev/xoai" class="block py-1 transition-all hover:pl-1" onclick={onNavItemClick}>
					XOAI
				</a>
			</div>
		</div>

		<div class="blog-wrap">
			<a href="/blog" class="block py-1 transition-all hover:pl-1" onclick={onNavItemClick}>blog</a>
		</div>
	</div>

	<div class="mt-2 text-gray-400">
		<p>{date}</p>
	</div>
</nav>
