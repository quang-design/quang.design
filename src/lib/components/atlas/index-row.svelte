<script lang="ts">
	import { cn } from '$lib/utils';
	import { KeySlot, MicroLabel } from '$lib/components/primitives';

	let {
		code,
		title,
		date,
		description,
		href = '#',
		class: className
	}: {
		code: string;
		title: string;
		date?: string;
		description?: string;
		href?: string;
		class?: string;
	} = $props();
</script>

<a {href} class={cn('atlas-hair atlas-invert flex items-start gap-3 px-3 py-2', className)}>
	<KeySlot {code} />
	<span class="flex grow flex-col gap-1">
		<span class="atlas-row">{title}</span>
		{#if description}<span class="text-[var(--ink-60)]">{description}</span>{/if}
	</span>
	{#if date}<MicroLabel class="shrink-0">{date}</MicroLabel>{/if}
</a>
