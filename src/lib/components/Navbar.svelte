<script lang="ts">
	let isOpenDev = $state(false);

	let today = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	let time = $state(new Date().toLocaleTimeString());

	// Update time every second
	setInterval(() => {
		time = new Date().toLocaleTimeString();
	}, 1000);
</script>

<nav class="flex w-full select-none flex-col gap-2 text-sm uppercase">
	<div class="flex flex-wrap gap-1">
		<div class="home-wrap">
			<a href="/">quang</a>
		</div>

		<span>/</span>

		<div class="design-wrap">
			<a href="/design">design</a>
		</div>

		<span>/</span>

		<div class="dev-wrap">
			<a href="/dev">dev</a>
			<button onclick={() => (isOpenDev = !isOpenDev)}>[+]</button>
			<div class="dev-wrap-inner flex flex-col gap-1" class:hidden={!isOpenDev}>
				<a href="/dev/telescopic">AI Telescopic Text</a>
				<a href="/dev/microscopic">AI Microscopic Text</a>
				<a href="/dev/minesweeper">Minesweeper</a>
				<a href="/dev/xoai">XOAI</a>
			</div>
		</div>

		<span>/</span>

		<div class="blog-wrap">
			<a href="/blog">blog</a>
		</div>
	</div>
	<p>{today}</p>
	<p>{time}</p>
</nav>
