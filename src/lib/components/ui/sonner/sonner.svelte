<script lang="ts">
	import { Toast, ToastDescription, ToastRegion, ToastTitle } from '@ui-sdk/svelte/toast';
</script>

<ToastRegion side="top" align="center" class="toaster" aria-label="Notifications">
	<Toast class="toast">
		<div class="toast-body">
			<ToastTitle />
			<ToastDescription />
		</div>
	</Toast>
</ToastRegion>

<style>
	:global([data-slot='toast-region'].toaster) {
		width: min(22rem, calc(100vw - 2 * var(--grid)));
		padding: var(--grid);
		pointer-events: none;
	}

	:global([data-slot='toast-region'].toaster [data-slot='toast-list']) {
		position: relative;
		width: 100%;
		height: var(--toast-front-height);
	}

	:global([data-slot='toast-region'].toaster [data-slot='toast']) {
		position: absolute;
		inset-inline: 0;
		top: 0;
		z-index: calc(100 - var(--toast-index));
		pointer-events: auto;
		height: var(--toast-height);
		border: var(--hair) solid var(--ink);
		background: var(--ink);
		color: var(--paper);
		padding: calc(var(--grid) * 0.5) var(--grid);
		font-size: var(--text-base);
		letter-spacing: var(--tracking-normal);
		user-select: none;
		translate: var(--toast-swipe-x, 0px)
			calc(var(--toast-index) * 0.35rem + var(--toast-swipe-y, 0px));
		transition-property: translate, opacity, height;
		transition-duration: 280ms;
	}

	:global([data-slot='toast-region'].toaster [data-slot='toast'][data-starting-style]),
	:global([data-slot='toast-region'].toaster [data-slot='toast'][data-ending-style]) {
		opacity: 0;
		translate: var(--toast-swipe-x, 0px) calc(-0.75rem + var(--toast-swipe-y, 0px));
	}

	:global([data-slot='toast-region'].toaster [data-slot='toast'][data-swiping]) {
		transition: none;
	}

	.toast-body {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing) * 1);
	}

	.toast-body :global([data-slot='toast-description']) {
		text-transform: none;
		letter-spacing: var(--tracking-normal);
		opacity: 0.85;
	}
</style>
