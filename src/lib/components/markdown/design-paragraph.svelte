<script lang="ts">
	import { getAstNode } from 'svelte-exmarkdown';
	import type { Snippet } from 'svelte';

	let { children, ...rest }: { children?: Snippet; [key: string]: unknown } = $props();

	const astRef = getAstNode();
	const node = $derived(astRef.current);

	const imgChildren = $derived(
		(node?.children ?? []).filter(
			(c: { type: string; tagName?: string }) => c.type === 'element' && c.tagName === 'img'
		)
	);

	const is2col = $derived(
		imgChildren.length === 2 &&
			imgChildren.every(
				(c: { properties?: { alt?: string } }) => c.properties?.alt === '2col'
			)
	);

	const isHeading = $derived(
		(node?.children ?? []).length === 1 &&
			node?.children?.[0]?.type === 'element' &&
			node?.children?.[0]?.tagName === 'strong'
	);
</script>

{#if is2col}
	<div class="grid gap-2 md:grid-cols-2 md:gap-8">
		{@render children?.()}
	</div>
{:else if isHeading}
	<p class="text-foreground/40 px-1 pt-4 text-xs tracking-widest uppercase" {...rest}>
		{@render children?.()}
	</p>
{:else}
	<p class="text-foreground/80 px-1 py-4 leading-relaxed" {...rest}>
		{@render children?.()}
	</p>
{/if}
