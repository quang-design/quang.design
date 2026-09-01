<script lang="ts">
	import { cn } from '$lib/utils';

	let { code, class: className }: { code: string; class?: string } = $props();
</script>

<span class={cn('ink-label w-7 shrink-0', className)}>{code}</span>
