<script lang="ts">
	import { getAstNode } from 'svelte-exmarkdown';
	import type { HastNode } from 'svelte-exmarkdown';
	import type { Snippet } from 'svelte';
	import { Heading } from '$lib/components/primitives';

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
			imgChildren.every((c: { properties?: { alt?: string } }) => c.properties?.alt === '2col')
	);

	const isSingleImg = $derived(imgChildren.length === 1 && (node?.children ?? []).length === 1);

	const isHeading = $derived(
		(node?.children ?? []).length === 1 &&
			node?.children?.[0]?.type === 'element' &&
			node?.children?.[0]?.tagName === 'strong'
	);

	const headingText = $derived(strongText(node));

	function strongText(current: HastNode | undefined) {
		const strong = current?.children?.[0];
		if (!strong || strong.type !== 'element' || strong.tagName !== 'strong') return '';
		return strong.children
			.filter((child) => child.type === 'text')
			.map((child) => child.value)
			.join('');
	}
</script>

{#if is2col}
	<div class="grid gap-[var(--grid)] md:grid-cols-2 md:gap-[calc(var(--grid)*2)]">
		{@render children?.()}
	</div>
{:else if isSingleImg}
	<div>
		{@render children?.()}
	</div>
{:else if isHeading}
	<Heading
		level={2}
		class="ink-h3 px-[var(--grid)] pt-[var(--grid)] pb-[var(--grid)]"
		text={headingText}
	/>
{:else}
	<p class="ink-read px-[var(--grid)] py-[var(--grid)]" {...rest}>
		{@render children?.()}
	</p>
{/if}
