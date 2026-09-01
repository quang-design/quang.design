<script lang="ts">
	import { toast } from 'svelte-sonner';
	import MailIcon from '@lucide/svelte/icons/mail';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
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
	<div class="stack-x flex h-8 w-full items-stretch">
		<Input
			name="email"
			type="email"
			placeholder="xinchao@quang.design"
			bind:value={email}
			required
			class="h-8 min-w-0 flex-1 border-0"
		/>
		<Button type="submit" variant="default" disabled={loading} class="h-8 shrink-0 border-0">
			<MailIcon class="size-3.5" />
			{loading ? 'Capturing...' : 'Subscribe'}
		</Button>
	</div>
</form>
