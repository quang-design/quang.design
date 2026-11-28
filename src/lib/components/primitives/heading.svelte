<script lang="ts">
	import { titleCase } from '$lib/title-case';

	let {
		level = 2,
		text,
		class: className
	}: {
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		text: string;
		class?: string;
	} = $props();
</script>

<svelte:element this={'h' + level} class={className}>{titleCase(text)}</svelte:element>
