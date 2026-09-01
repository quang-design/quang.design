<script lang="ts">
	let { alt, ...rest }: { alt?: string; src?: string; [key: string]: unknown } = $props();
	const cleanAlt = $derived(alt === '2col' ? '' : alt || '');
</script>

<img alt={cleanAlt} class="hair w-full" loading="lazy" {...rest} />
