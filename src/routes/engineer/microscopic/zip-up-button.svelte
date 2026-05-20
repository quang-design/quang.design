<script lang="ts">
	let { onClick, rect }: { onClick: () => void; rect: DOMRect | null } = $props();

	let buttonEl = $state<HTMLButtonElement | null>(null);

	let position = $derived.by(() => {
		if (!rect || !buttonEl) return null;

		const gap = 8;
		const buttonWidth = buttonEl.offsetWidth;
		const buttonHeight = buttonEl.offsetHeight;

		let top = rect.bottom + gap;
		let left = rect.left + rect.width / 2 - buttonWidth / 2;

		if (left < 8) left = 8;
		if (left + buttonWidth > window.innerWidth - 8) left = window.innerWidth - buttonWidth - 8;
		if (top + buttonHeight > window.innerHeight - 8) top = rect.top - buttonHeight - gap;

		return { top, left };
	});

	function handleInteraction(event: Event) {
		event.preventDefault();
		onClick();
	}
</script>

<button
	bind:this={buttonEl}
	class="zip-up-enter fixed z-50 max-w-sm rounded border border-amber-500
           bg-amber-500 px-3 py-1.5 text-white shadow-md backdrop-blur-xs hover:bg-amber-600"
	style="top: {position?.top ?? -9999}px; left: {position?.left ?? -9999}px;"
	onclick={handleInteraction}
	ontouchend={handleInteraction}
>
	Zip up
</button>

<style>
	@keyframes zip-up-enter {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.zip-up-enter {
		animation: zip-up-enter 0.15s ease-out both;
	}
</style>
