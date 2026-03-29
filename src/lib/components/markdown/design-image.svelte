<script lang="ts">
	let { alt, ...rest }: { alt?: string; src?: string; [key: string]: unknown } = $props();
	const cleanAlt = $derived(alt === '2col' ? '' : (alt || ''));
</script>

<img alt={cleanAlt} class="border-foreground/10 w-full border-[0.5px]" loading="lazy" {...rest} />
