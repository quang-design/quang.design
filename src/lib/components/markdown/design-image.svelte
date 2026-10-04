<script lang="ts">
	let { alt, src }: { alt?: string; src?: string } = $props();
	const cleanAlt = $derived(alt === '2col' ? '' : alt || '');
</script>

<img alt={cleanAlt} class="w-full" loading="lazy" {src} />
