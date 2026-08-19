<script lang="ts">
	import { cn } from '$lib/utils';
	import { HintKey } from '$lib/components/primitives';

	let { hints, class: className }: { hints: { glyph: string; label: string }[]; class?: string } =
		$props();
</script>

<footer class={cn('flex flex-wrap items-center gap-3 px-3 py-2', className)}>
	{#each hints as hint, i (hint.label)}
		{#if i > 0}<span class="atlas-label" aria-hidden="true">&middot;</span>{/if}
		<HintKey glyph={hint.glyph} label={hint.label} />
	{/each}
</footer>
