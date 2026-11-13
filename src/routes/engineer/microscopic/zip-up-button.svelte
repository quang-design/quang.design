<script lang="ts">
	import { Button } from '@ui-sdk/svelte/button';

	let { onClick, rect }: { onClick: () => void; rect: DOMRect | null } = $props();

	let buttonEl = $state<HTMLButtonElement | undefined>(undefined);

	let position = $derived.by(() => {
		if (!rect || !buttonEl) return null;

		const gap = 8;
		const buttonWidth = buttonEl.offsetWidth;
		const buttonHeight = buttonEl.offsetHeight;

		let top = rect.top - buttonHeight - gap;
		let left = rect.left + rect.width / 2 - buttonWidth / 2;

		if (left < 8) left = 8;
		if (left + buttonWidth > window.innerWidth - 8) left = window.innerWidth - buttonWidth - 8;
		if (top < 8) top = rect.bottom + gap;

		return { top, left };
	});

	function captureButton(el: HTMLButtonElement) {
		buttonEl = el;
		return () => {
			if (buttonEl === el) buttonEl = undefined;
		};
	}

	function handlePointerDown(event: PointerEvent) {
		event.preventDefault();
		onClick();
	}

	function handleClick(event: MouseEvent) {
		event.preventDefault();
		onClick();
	}
</script>

<Button
	aria-label="Zip up selection"
	class="zip-up-enter hair ink-active fixed z-50 max-w-sm px-3 py-1.5 select-none"
	style="top: {position?.top ?? -9999}px; left: {position?.left ?? -9999}px;"
	onpointerdown={handlePointerDown}
	onclick={handleClick}
>
	{#snippet render({ props })}
		<button {...props} {@attach captureButton}>Zip up</button>
	{/snippet}
</Button>

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
