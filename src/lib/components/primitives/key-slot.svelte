<script lang="ts">
	import { cn } from '$lib/utils';

	let { code, class: className }: { code: string; class?: string } = $props();
</script>

<span
	class={cn('ink-label hair-x flex size-[calc(var(--grid)*2)] shrink-0 items-center', className)}
	>{code}</span
>
