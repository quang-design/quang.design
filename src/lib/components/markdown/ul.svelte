<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, ...rest } = $props();
</script>

<ul {...rest} class={cn('ml-4 list-outside list-disc', rest.class)}>
	{@render children?.()}
</ul>
