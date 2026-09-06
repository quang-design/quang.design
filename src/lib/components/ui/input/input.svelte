<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		'data-slot': dataSlot = 'input',
		...restProps
	}: Props = $props();
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			'placeholder:text-muted-foreground disabled:bg-input/50 file:text-foreground aria-invalid:border-destructive border-input h-[var(--grid)] w-full min-w-0 border-[length:var(--hair)] bg-transparent px-3 text-base outline-none file:inline-flex file:h-[var(--grid)] file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			'placeholder:text-muted-foreground disabled:bg-input/50 file:text-foreground aria-invalid:border-destructive border-input h-[var(--grid)] w-full min-w-0 border-[length:var(--hair)] bg-transparent px-3 text-base outline-none file:inline-flex file:h-[var(--grid)] file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
