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

	const style = $derived(variant === 'dashed' ? 'hair-dashed' : 'hair');
</script>

<div
	role="separator"
	aria-orientation={orientation}
	class={cn(
		orientation === 'horizontal'
			? [style, 'w-full border-x-0 border-t-0']
			: 'self-stretch w-0 shrink-0 border-l-[length:var(--hair)] border-solid border-[var(--ink-25)]',
		className
	)}
></div>
