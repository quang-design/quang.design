<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import { cn } from '$lib/utils';
	import { MicroLabel, KeySlot, Count } from '$lib/components/primitives';
	import * as Select from '$lib/components/ui/select/index.js';
	import { PREVIEW_KEY, type PreviewState } from '$lib/preview.svelte';
	import type { TreeGroup } from '$lib/config/tree';

	let {
		groups,
		active,
		class: className
	}: { groups: TreeGroup[]; active?: string; class?: string } = $props();

	const preview = getContext<PreviewState | undefined>(PREVIEW_KEY);
	const rows = $derived(groups.flatMap((group) => group.rows));
	const currentHref = $derived(rows.find((row) => row.code === active)?.href ?? '/');
	const currentLabel = $derived(rows.find((row) => row.code === active)?.label ?? 'Index');

	function go(href: string) {
		const row = rows.find((item) => item.href === href);
		if (!row) return;
		if (row.external) {
			window.open(row.href, '_blank', 'noopener,noreferrer');
			return;
		}
		goto(resolve(row.href as '/'));
	}
</script>

<div class="p-2 lg:hidden">
	<Select.Root type="single" value={currentHref} onValueChange={go}>
		<Select.Trigger class="w-full">{currentLabel}</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each rows as row (row.code)}
					<Select.Item value={row.href} label={row.label}>{row.label}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>

<nav class={cn('hidden flex-col gap-3 px-0 py-2 lg:flex', className)}>
	{#each groups as group (group.label)}
		<div class="flex flex-col">
			<MicroLabel class="px-2 pb-1">{group.label}</MicroLabel>
			<div class="stack stack-flush flex flex-col">
				{#each group.rows as row (row.code)}
					<a
						href={row.external ? row.href : resolve(row.href as '/')}
						target={row.external ? '_blank' : undefined}
						rel={row.external ? 'noopener noreferrer' : undefined}
						class={cn(
							'ink-invert flex items-center gap-2 py-1.5 pr-2',
							row.nested ? 'pl-6' : 'pl-2',
							active === row.code && 'ink-active'
						)}
						onmouseenter={() => row.preview && preview?.setHover(row.preview)}
						onmouseleave={() => preview?.clearHover()}
						onfocus={() => row.preview && preview?.setHover(row.preview)}
						onblur={() => preview?.clearHover()}
					>
						<KeySlot code={row.code} />
						<span class="ink-row grow">{row.label}</span>
						{#if row.count !== undefined}
							<Count value={row.count} />
						{/if}
					</a>
				{/each}
			</div>
		</div>
	{/each}
</nav>
