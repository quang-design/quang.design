<script lang="ts">
	let { image }: { image: File | null } = $props();

	const imageUrl = $derived(image ? URL.createObjectURL(image) : null);

	// Clean up on destroy
	$effect(() => {
		return () => {
			if (imageUrl) URL.revokeObjectURL(imageUrl);
		};
	});
</script>

<div class="flex h-full items-center justify-center">
	{#if imageUrl}
		<img src={imageUrl} alt={image?.name ?? ''} class="h-auto max-w-full rounded-xs" />
	{/if}
</div>
