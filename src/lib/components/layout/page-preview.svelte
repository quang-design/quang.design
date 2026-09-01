<script lang="ts">
	import { getContext } from 'svelte';
	import { PREVIEW_KEY, type Preview, type PreviewState } from '$lib/preview.svelte';

	let { value }: { value: Preview } = $props();

	const preview = getContext<PreviewState | undefined>(PREVIEW_KEY);

	$effect(() => {
		preview?.setPage(value);
		return () => preview?.setPage(null);
	});
</script>
