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
	class="fixed bottom-4 left-4 rounded border border-amber-500 bg-amber-500 px-3 py-1.5 shadow-md
           backdrop-blur-xs transition-all ease-out hover:bg-amber-600 text-white z-50 max-w-sm animate-in slide-in-from-bottom-2"
	onclick={handleInteraction}
	ontouchend={handleInteraction}
>
	Zip up
</button>
