<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let email = $state('');
	let loading = $state(false);

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		if (loading) return;
		loading = true;
		try {
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);
			// Ensure current state value is sent
			formData.set('email', email);

			const res = await fetch('/api/subscribe', {
				method: 'POST',
				body: formData
			});
			const data = await res.json().catch(() => null);
			if (!res.ok) {
				console.error('Subscribe failed', data ?? res.statusText);
				return;
			}
			console.log('Subscribed', data);
			email = '';
		} finally {
			loading = false;
		}
	};
</script>

<form action="" onsubmit={handleSubmit} class="flex items-center gap-2">
	<Input name="email" type="email" placeholder="Enter your email" bind:value={email} required />
	<Button type="submit" variant="default" disabled={loading}
		>{loading ? 'Subscribing...' : 'Subscribe'}</Button
	>
</form>
