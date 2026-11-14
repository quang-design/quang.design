<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className
	}: { children?: Snippet; class?: string | Array<string | false | null | undefined> } = $props();
</script>

<div class={['hatch', className]}>{@render children?.()}</div>
