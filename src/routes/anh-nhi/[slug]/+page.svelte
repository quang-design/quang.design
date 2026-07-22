<script lang="ts">
	import Invitation from '$lib/components/anh-nhi/invitation.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#key data.slug}
	<Invitation
		slug={data.slug}
		initialName={data.displayName}
		initialLang={data.lang}
		defaultGuests={data.guests}
	/>
{/key}
