<script lang="ts">
	let { onClick } = $props<{
		onClick: () => void;
	}>();

	function handleInteraction(event: Event) {
		event.preventDefault();
		onClick();
	}
</script>

<button
	class="w-full rounded border border-amber-500 bg-white/5 px-3 py-1.5 shadow-md
           backdrop-blur-xs transition-all hover:bg-white/15"
	onclick={handleInteraction}
	ontouchend={handleInteraction}
>
	Zip up
</button>
