<script lang="ts">
	import { page } from '$app/state';
	import Invitation from '$lib/components/anh-nhi/invitation.svelte';

	// Backwards-compatible prefill via ?to= for links without a slug.
	const initialName = $derived((page.url.searchParams.get('to') ?? '').trim().slice(0, 80));
</script>

<Invitation {initialName} defaultGuests={2} />
