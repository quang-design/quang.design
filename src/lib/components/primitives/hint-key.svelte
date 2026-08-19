<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		glyph,
		label,
		class: className
	}: { glyph: string; label: string; class?: string } = $props();
</script>

<span class={cn('atlas-label inline-flex items-center gap-1.5', className)}>
	<span aria-hidden="true">{glyph}</span>
	{label}
</span>
