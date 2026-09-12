<script lang="ts">
	import { resolve } from '$app/paths';
	import { getContext } from 'svelte';
	import { cn } from '$lib/utils';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import { MicroLabel, KeySlot, Count } from '$lib/components/primitives';
	import { PREVIEW_KEY, type PreviewState } from '$lib/preview.svelte';
	import type { TreeGroup } from '$lib/config/tree';

	let {
		groups,
		active,
		class: className
	}: { groups: TreeGroup[]; active?: string; class?: string } = $props();

	const preview = getContext<PreviewState | undefined>(PREVIEW_KEY);
</script>

<nav id="site-index" class={cn('flex flex-col', className)}>
	{#each groups as group (group.label)}
		<div class="flex flex-col">
			<MicroLabel class="px-[var(--grid)]">{group.label}</MicroLabel>
			<div class="stack stack-flush flex flex-col">
				{#each group.rows as row (row.code)}
					<a
						href={row.external ? row.href : resolve(row.href as '/')}
						target={row.external ? '_blank' : undefined}
						rel={row.external ? 'noopener noreferrer' : undefined}
						class={cn(
							'ink-invert flex h-[calc(var(--grid)*2)] items-center gap-[var(--grid)]',
							row.nested ? 'pl-[calc(var(--grid)*2)]' : 'pl-[var(--grid)]',
							row.external ? 'pr-0' : 'pr-[var(--grid)]',
							active === row.code && 'ink-active'
						)}
						onmouseenter={() => row.preview && preview?.setHover(row.preview)}
						onmouseleave={() => preview?.clearHover()}
						onfocus={() => row.preview && preview?.setHover(row.preview)}
						onblur={() => preview?.clearHover()}
					>
						<KeySlot code={row.code} />
						<span class="ink-row grow truncate">{row.label}</span>
						{#if row.count !== undefined}
							<Count value={row.count} />
						{/if}
						{#if row.external}
							<span
								class="hair-l flex size-[calc(var(--grid)*2)] shrink-0 items-center justify-center"
								aria-hidden="true"
							>
								<ArrowUpRightIcon class="size-4" />
							</span>
						{/if}
					</a>
				{/each}
			</div>
		</div>
	{/each}
</nav>
