<script lang="ts">
	let { src, alt, title, ...rest }: { src?: string; alt?: string; title?: string; [key: string]: unknown } = $props();
</script>

<img {src} {alt} {title} loading="lazy" {...rest} />
