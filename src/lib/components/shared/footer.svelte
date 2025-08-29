<script lang="ts">
	import Subscribe from '$lib/components/shared/subscribe.svelte';
</script>

<footer
	class="border-foreground/25 mt-4 grid w-full grid-cols-1 items-center gap-8 border-t-[0.5px] py-4 text-xs sm:grid-cols-3"
>
	<p>
		&copy; {new Date().getFullYear()} Quang Design. All rights reserved.
	</p>
	<blockquote class="italic">
		"The best person ever to exist." <a href="http://quang.urbanup.com/9858947">Urban Dictionary</a>
	</blockquote>
	<Subscribe />
</footer>
