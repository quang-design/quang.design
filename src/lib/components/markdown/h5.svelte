<script lang="ts">
	import { cn } from '$lib/utils/shadcn';

	let { children, ...rest } = $props();
</script>

<h5 {...rest} class={cn('mt-6 mb-2 text-base font-semibold', rest.class)}>
	{@render children?.()}
</h5>
