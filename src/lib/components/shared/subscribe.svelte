<script lang="ts">
	import { toast } from 'svelte-sonner';
	import MailIcon from '@lucide/svelte/icons/mail';
	import { apiPaths } from '$lib/config/api';
	import { MicroLabel } from '$lib/components/primitives';

	let email = $state('');
	let loading = $state(false);

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		if (loading) return;
		loading = true;
		try {
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);
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
			toast.success('Email captured — thank you!');
			email = '';
		} finally {
			loading = false;
		}
	};
</script>

<form action="" onsubmit={handleSubmit} class="flex w-full flex-col gap-1">
	<MicroLabel>Email</MicroLabel>
	<div class="field">
		<input
			name="email"
			type="email"
			placeholder="xinchao@quang.design"
			bind:value={email}
			required
		/>
		<button type="submit" disabled={loading}>
			<MailIcon class="size-3.5" />
			{loading ? 'Capturing...' : 'Subscribe'}
		</button>
	</div>
</form>

<style>
	.field {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		height: calc(var(--spacing) * 8);
		border: var(--hair) solid var(--ink-25);
		align-items: stretch;
	}

	.field input,
	.field button {
		height: 100%;
		margin: 0;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: var(--text-sm);
		line-height: 1;
		letter-spacing: var(--tracking-widest);
		outline: none;
	}

	.field input {
		min-width: 0;
		padding: 0 calc(var(--spacing) * 3);
		text-transform: none;
		letter-spacing: var(--tracking-normal);
	}

	.field button {
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

	.field button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.field input:focus-visible,
	.field button:focus-visible {
		outline: var(--hair) solid var(--ink);
		outline-offset: calc(var(--spacing) * -1);
	}
</style>
