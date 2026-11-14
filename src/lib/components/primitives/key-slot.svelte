<script lang="ts">
	let { code, class: className }: { code: string; class?: string } = $props();
</script>

<span class={['ink-label w-[calc(var(--grid)*2)] shrink-0', className]}>{code}</span>
