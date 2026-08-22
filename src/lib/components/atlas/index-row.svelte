<script lang="ts">
	import { cn } from '$lib/utils';
	import { KeySlot, Hatch } from '$lib/components/primitives';

	let {
		code,
		title,
		date,
		description,
		thumbnail,
		placeholder = false,
		reverse = false,
		href = '#',
		class: className
	}: {
		code: string;
		title: string;
		date?: string;
		description?: string;
		thumbnail?: string;
		placeholder?: boolean;
		reverse?: boolean;
		href?: string;
		class?: string;
	} = $props();
</script>

<a
	{href}
	class={cn(
		'atlas-invert flex flex-col gap-1 px-3 py-2 sm:flex-row sm:items-center sm:gap-3',
		className
	)}
>
	<KeySlot {code} />
	{#if thumbnail}
		<img src={thumbnail} alt="" width="40" height="40" class="atlas-hair size-10 object-cover" />
	{:else if placeholder}
		<Hatch class="atlas-hair size-10 shrink-0" />
	{/if}
	<span class="flex min-w-0 grow flex-col gap-0.5">
		{#if reverse}
			{#if description}<span class="atlas-row-desc line-clamp-2">{description}</span>{/if}
			<span class="atlas-row-title">{title}</span>
		{:else}
			<span class="atlas-row-title">{title}</span>
			{#if description}<span class="atlas-row-desc line-clamp-2">{description}</span>{/if}
		{/if}
	</span>
	{#if date}<span class="atlas-row-meta shrink-0 sm:ml-auto">{date}</span>{/if}
</a>
