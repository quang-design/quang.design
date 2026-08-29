<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import StatusBar from './status-bar.svelte';
	import IndexTree, { type TreeGroup } from './index-tree.svelte';
	import HintBar from './hint-bar.svelte';

	const defaultHints = [
		{ glyph: '→', label: 'Go inside' },
		{ glyph: '←', label: 'Come back out' },
		{ glyph: '↓↑', label: 'Move' },
		{ glyph: '·', label: 'Hover to read' }
	];

	let {
		title,
		stats = [],
		actions = [],
		groups,
		active,
		hints = defaultHints,
		canvas,
		reading,
		class: className
	}: {
		title: string;
		stats?: { label: string; value: string }[];
		actions?: string[];
		groups: TreeGroup[];
		active?: string;
		hints?: { glyph: string; label: string }[];
		canvas: Snippet;
		reading: Snippet;
		class?: string;
	} = $props();
</script>

<div class={cn('atlas-shell', className)}>
	<div class="atlas-shell-head">
		<StatusBar {title} {stats} {actions} />
	</div>
	<div class="atlas-shell-body">
		<div class="atlas-shell-index">
			<IndexTree {groups} {active} />
		</div>
		<div class="atlas-shell-canvas">{@render canvas()}</div>
		<div class="atlas-shell-reading">{@render reading()}</div>
	</div>
	<div class="atlas-shell-foot">
		<HintBar {hints} />
	</div>
</div>
