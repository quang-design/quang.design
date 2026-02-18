<script lang="ts">
	let { onClick }: { onClick: () => void } = $props();

	function handleInteraction(event: Event) {
		event.preventDefault();
		onClick();
	}
</script>

<button
	class="animate-in slide-in-from-bottom-2 fixed bottom-4 left-4 z-50 max-w-sm rounded border border-amber-500
           bg-amber-500 px-3 py-1.5 text-white shadow-md backdrop-blur-xs transition-all ease-out hover:bg-amber-600"
	onclick={handleInteraction}
	ontouchend={handleInteraction}
>
	Zip up
</button>
