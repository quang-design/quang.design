<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, ...rest } = $props();
</script>

<p {...rest} class={cn('[&:not(:last-child)]:mb-4', rest.class)}>
	{@render children()}
</p>
