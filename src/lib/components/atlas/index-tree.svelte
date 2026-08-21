<script lang="ts">
	import { cn } from '$lib/utils';
	import { MicroLabel, KeySlot, Count } from '$lib/components/primitives';

	export type TreeRow = { code: string; label: string; count?: number; nested?: boolean };
	export type TreeGroup = { label: string; rows: TreeRow[] };

	let { groups, class: className }: { groups: TreeGroup[]; class?: string } = $props();
</script>

<nav class={cn('flex flex-col gap-3 py-2', className)}>
	{#each groups as group (group.label)}
		<div class="atlas-stack flex flex-col">
			<MicroLabel class="px-2 pb-1">{group.label}</MicroLabel>
			{#each group.rows as row (row.code)}
				<!-- Nesting indents the label, not the box, so every rule stays on one line. -->
				<div
					class={cn(
						'atlas-hair atlas-invert flex items-center gap-2 py-1.5 pr-2',
						row.nested ? 'pl-6' : 'pl-2'
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
	{/each}
</nav>
