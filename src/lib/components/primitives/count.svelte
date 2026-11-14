<script lang="ts">
	let { value, class: className }: { value: number; class?: string } = $props();
</script>

<span class={['ink-label shrink-0 tabular-nums', className]}>{value}</span>
