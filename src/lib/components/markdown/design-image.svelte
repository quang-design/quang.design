<script lang="ts">
	import { safeSrc } from '$lib/utils/safe-href';

	let { alt, src, ...rest }: { alt?: string; src?: string; [key: string]: unknown } = $props();
	const cleanAlt = $derived(alt === '2col' ? '' : alt || '');
	const cleanSrc = $derived(safeSrc(src));
</script>

{#if cleanSrc}
	<img
		alt={cleanAlt}
		src={cleanSrc}
		class="border-foreground/10 w-full border-[0.5px]"
		loading="lazy"
		{...rest}
	/>
{/if}
