<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, ...rest } = $props();
</script>

<h3 {...rest} class={cn('mt-6 mb-2 text-xl font-semibold', rest.class)}>
	{@render children?.()}
</h3>
