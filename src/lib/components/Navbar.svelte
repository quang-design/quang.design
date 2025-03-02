<script lang="ts">
	let { onNavItemClick } = $props();

	let isOpenDev = $state(false);
	let today = $state(
		new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
	let time = $state(new Date().toLocaleTimeString());

	$effect(() => {
		const interval = setInterval(() => {
			time = new Date().toLocaleTimeString();
		}, 1000);

		// Cleanup interval when component is destroyed
		return () => clearInterval(interval);
	});

	function handleSubmenuClick(event: Event) {
		// Stop event propagation to prevent closing the mobile menu
		event.stopPropagation();
	}
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
				<a href="/dev/xoai" class="block py-1 transition-all hover:pl-1" onclick={onNavItemClick}
					>XOAI</a
				>
			</div>
		</div>

		<div class="blog-wrap">
			<a href="/blog" class="block py-1 transition-all hover:pl-1" onclick={onNavItemClick}>blog</a>
		</div>
	</div>

	<div class="mt-2 text-gray-400">
		<p>{today}</p>
		<p>{time}</p>
	</div>
</nav>
