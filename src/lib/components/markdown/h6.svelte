<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, ...rest } = $props();
</script>

<h6 {...rest} class={cn('mt-6 mb-2 text-sm font-semibold', rest.class)}>
	{@render children?.()}
</h6>
