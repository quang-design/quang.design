<script lang="ts">
	import XIcon from '@lucide/svelte/icons/x';
	import {
		Toast,
		ToastClose,
		ToastDescription,
		ToastRegion,
		ToastTitle
	} from '@ui-sdk/svelte/toast';
</script>

<ToastRegion side="top" align="center" class="toaster" aria-label="Notifications" data-agent-hidden>
	<Toast class="toast">
		<div class="toast-body">
			<ToastTitle />
			<ToastDescription />
		</div>
		<ToastClose aria-label="Close" class="toast-close">
			<XIcon class="size-3.5" aria-hidden="true" />
		</ToastClose>
	</Toast>
</ToastRegion>

<style>
	:global([data-slot='toast-region'].toaster) {
		width: min(22rem, calc(100vw - 2 * var(--grid)));
		padding: var(--grid);
		pointer-events: none;
		height: var(--toast-front-height);
	}

	:global([data-slot='toast-region'].toaster[data-expanded]) {
		height: calc(var(--toast-stack-height) + (var(--toast-count) - 1) * 0.35rem);
	}

	:global([data-slot='toast-region'].toaster [data-slot='toast-list']) {
		position: relative;
		width: 100%;
		height: 100%;
	}

	:global([data-slot='toast-region'].toaster [data-slot='toast']) {
		position: absolute;
		inset-inline: 0;
		top: 0;
		z-index: calc(100 - var(--toast-index));
		pointer-events: auto;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: calc(var(--spacing) * 2);
		align-items: start;
		overflow: hidden;
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

	:global(
		[data-slot='toast-region'].toaster [data-slot='toast']:not([data-front], [data-expanded])
	) {
		height: var(--toast-front-height);
	}

	:global([data-slot='toast-region'].toaster [data-slot='toast'][data-expanded]) {
		translate: var(--toast-swipe-x, 0px)
			calc(var(--toast-offset) + var(--toast-index) * 0.35rem + var(--toast-swipe-y, 0px));
	}

	:global([data-slot='toast-region'].toaster [data-slot='toast'][data-type='success']) {
		background: var(--ink);
		color: var(--paper);
		border-color: var(--ink);
	}

	:global([data-slot='toast-region'].toaster [data-slot='toast'][data-type='error']) {
		background: var(--paper);
		color: var(--ink);
		border-color: var(--ink);
		box-shadow: inset 0 0 0 var(--hair) var(--ink);
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
		min-width: 0;
		flex-direction: column;
		gap: calc(var(--spacing) * 1);
	}

	.toast-body :global([data-slot='toast-description']) {
		text-transform: none;
		letter-spacing: var(--tracking-normal);
		opacity: 0.85;
	}

	:global([data-slot='toast-region'].toaster [data-slot='toast-close'].toast-close) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin: calc(var(--spacing) * -1);
		padding: calc(var(--spacing) * 1);
		border: 0;
		background: transparent;
		color: inherit;
		cursor: pointer;
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-slot='toast-region'].toaster [data-slot='toast']) {
			transition-property: opacity;
		}
	}
</style>
