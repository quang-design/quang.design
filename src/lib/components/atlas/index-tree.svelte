<script lang="ts" module>
	export type TreeRow = {
		code: string;
		label: string;
		count?: number;
		nested?: boolean;
	};
	export type TreeGroup = { label: string; rows: TreeRow[] };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { MicroLabel, KeySlot, Count } from '$lib/components/primitives';

	let {
		groups,
		active,
		class: className
	}: { groups: TreeGroup[]; active?: string; class?: string } = $props();
</script>

<nav class={cn('flex flex-col gap-3 px-0 py-2', className)}>
	{#each groups as group (group.label)}
		<div class="flex flex-col">
			<MicroLabel class="px-2 pb-1">{group.label}</MicroLabel>
			<div class="atlas-stack atlas-stack-flush flex flex-col">
				{#each group.rows as row (row.code)}
					<div
						class={cn(
							'atlas-invert flex items-center gap-2 py-1.5 pr-2',
							row.nested ? 'pl-6' : 'pl-2',
							active === row.code && 'atlas-active'
						)}
					>
						<KeySlot code={row.code} />
						<span class="atlas-row grow">{row.label}</span>
						{#if row.count !== undefined}
							<Count value={row.count} />
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</nav>
