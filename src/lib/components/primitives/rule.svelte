<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		orientation = 'horizontal',
		variant = 'solid',
		class: className
	}: {
		orientation?: 'horizontal' | 'vertical';
		variant?: 'solid' | 'dashed';
		class?: string;
	} = $props();

	const style = $derived(variant === 'dashed' ? 'atlas-hair-dashed' : 'atlas-hair');
</script>

<div
	role="separator"
	aria-orientation={orientation}
	class={cn(
		style,
		orientation === 'horizontal'
			? 'w-full border-x-0 border-t-0'
			: 'self-stretch border-y-0 border-r-0',
		className
	)}
></div>
