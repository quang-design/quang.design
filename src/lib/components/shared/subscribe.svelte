<script lang="ts">
	import MailIcon from '@lucide/svelte/icons/mail';
	import { Field, FieldLabel } from '@ui-sdk/svelte/field';
	import { Input } from '@ui-sdk/svelte/input';
	import { Button } from '@ui-sdk/svelte/button';
	import { apiPaths } from '$lib/config/api';
	import { toast } from '$lib/toast';

	let email = $state('');

	async function subscribe() {
		const formData = new FormData();
		formData.set('email', email);

		const res = await fetch(apiPaths.subscribe, {
			method: 'POST',
			body: formData
		});
		const data = await res.json().catch(() => null);
		if (!res.ok) {
			const errorMessage = data?.message || res.statusText;
			toast.error(`Subscription failed: ${errorMessage}`);
			return;
		}
		toast.success('Email captured. Thank you!');
		email = '';
	}
</script>

<form
	action=""
	onsubmit={(event) => {
		event.preventDefault();
		const submit = (event.currentTarget as HTMLFormElement).querySelector('[data-slot="button"]');
		if (submit instanceof HTMLElement) submit.click();
	}}
>
	<Field name="email" class="grid h-full w-full grid-rows-[var(--grid)_calc(var(--grid)*2)]">
		<FieldLabel class="ink-label block">Email</FieldLabel>
		<div class="field">
			<Input
				type="email"
				autocomplete="email"
				placeholder="xinchao@quang.design"
				value={email}
				onValueChange={(value) => {
					email = value;
				}}
				required
			/>
			<Button
				type="button"
				pendingAnnouncement="Capturing"
				data-agent-confirm="Subscribes this email to the quang.design newsletter"
				onclick={subscribe}
			>
				<MailIcon class="size-3.5" data-show="idle" aria-hidden="true" />
				<span data-show="idle">Subscribe</span>
				<span data-show="pending">Capturing…</span>
			</Button>
		</div>
	</Field>
</form>

<style>
	.field {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		height: calc(var(--grid) * 2);
		border: var(--hair) solid var(--ink-25);
		align-items: stretch;
	}

	.field :global([data-slot='input']),
	.field :global([data-slot='button']) {
		height: 100%;
		margin: 0;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: var(--text-base);
		line-height: var(--grid);
		letter-spacing: var(--tracking-widest);
		outline: none;
	}

	.field :global([data-slot='input']) {
		min-width: 0;
		padding: 0 calc(var(--spacing) * 3);
		text-transform: none;
		letter-spacing: var(--tracking-normal);
	}

	.field :global([data-slot='button']) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: calc(var(--spacing) * 2);
		padding: 0 calc(var(--spacing) * 3);
		border-left: var(--hair) solid var(--ink-25);
		background: var(--ink);
		color: var(--paper);
		text-transform: uppercase;
		cursor: pointer;
	}

	.field :global([data-slot='button']:not([data-pending]) [data-show='pending']),
	.field :global([data-slot='button'][data-pending] [data-show='idle']) {
		display: none;
	}

	.field :global([data-slot='button'][data-pending]),
	.field :global([data-slot='button'][aria-disabled='true']) {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.field :global([data-slot='input']:focus-visible),
	.field :global([data-slot='button']:focus-visible) {
		outline: var(--hair) solid var(--ink);
		outline-offset: calc(var(--spacing) * -1);
	}

	@media (min-width: 640px) {
		:global(.shell-foot) .field {
			border-bottom: 0;
		}
	}
</style>
