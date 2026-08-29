<script lang="ts">
	let { src, title }: { src: string; title: string } = $props();
</script>

<iframe {src} {title} class="bg-background block h-[32rem] w-full" loading="lazy"></iframe>
