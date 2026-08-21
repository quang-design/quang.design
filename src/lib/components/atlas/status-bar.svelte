<script lang="ts">
	import { cn } from '$lib/utils';
	import { StatCell, Rule, Action } from '$lib/components/primitives';

	let {
		title,
		stats = [],
		actions = [],
		class: className
	}: {
		title: string;
		stats?: { label: string; value: string }[];
		actions?: string[];
		class?: string;
	} = $props();
</script>

<header class={cn('flex items-stretch', className)}>
	<div class="flex flex-col justify-center gap-1 px-3 py-2">
		<span class="atlas-label">Repository</span>
		<span class="leading-none">{title}</span>
	</div>
	{#each stats as stat (stat.label)}
		<Rule orientation="vertical" />
		<StatCell label={stat.label} value={stat.value} class="justify-center px-3 py-2" />
	{/each}
	<div class="ml-auto flex items-center gap-2 px-3">
		{#each actions as action (action)}
			<Action>{action}</Action>
		{/each}
	</div>
</header>
