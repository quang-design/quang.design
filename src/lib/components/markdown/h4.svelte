<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, ...rest } = $props();
</script>

<h4 {...rest} class={cn('mt-6 mb-2 text-lg font-semibold', rest.class)}>
	{@render children?.()}
</h4>
