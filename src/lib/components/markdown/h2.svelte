<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, ...rest } = $props();
</script>

<h2 {...rest} class={cn('mt-6 mb-2 text-2xl font-semibold', rest.class)}>
	{@render children?.()}
</h2>
