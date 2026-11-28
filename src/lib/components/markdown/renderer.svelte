<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	import { getContext } from 'svelte';
	import { cn } from '$lib/utils';
	import { PREVIEW_KEY, type PreviewState } from '$lib/preview.svelte';
	import { isExternalHref } from '$lib/config/site';
	import type { HastNode } from 'svelte-exmarkdown';
	import CodeBlock from './code-block.svelte';
	let { md }: { md: string } = $props();

	const preview = getContext<PreviewState | undefined>(PREVIEW_KEY);

	function enter(event: Event) {
		const a = event.currentTarget as HTMLAnchorElement;
		const href = a.getAttribute('href') ?? a.href;
		preview?.hoverLink(href, a.textContent?.trim() || undefined);
	}

	function leave() {
		preview?.clearHover();
	}

	function plainText(node: HastNode): string {
		if (node.type === 'text' || node.type === 'raw') return node.value;
		if (node.type === 'element' || node.type === 'root')
			return node.children.map(plainText).join('');
		return '';
	}

	function isImageParagraph(node: HastNode) {
		if (node.type !== 'element' || node.tagName !== 'p') return false;
		const elements = node.children.filter((child) => child.type === 'element');
		return elements.length === 1 && elements[0].tagName === 'img';
	}

	function previousElement(children: HastNode[], index: number) {
		for (let i = index - 1; i >= 0; i--) {
			const child = children[i];
			if (child.type === 'text' && child.value.trim() === '') continue;
			return child;
		}
	}

	function imageCredit() {
		return (tree: HastNode) => {
			if (tree.type !== 'root') return;
			for (let i = 1; i < tree.children.length; i++) {
				const node = tree.children[i];
				const previous = previousElement(tree.children, i);
				if (node.type !== 'element' || node.tagName !== 'p' || !previous) continue;
				if (!isImageParagraph(previous)) continue;
				if (!plainText(node).startsWith('Image:')) continue;
				const properties = (node.properties ??= {});
				const current = Array.isArray(properties.className) ? properties.className : [];
				properties.className = [...current, 'ink-caption'];
			}
		};
	}
</script>

<Markdown {md} plugins={[gfmPlugin(), { rehypePlugin: imageCredit }]}>
	{#snippet ol(props)}
		{@const { children, ...rest } = props}
		<ol {...rest} class={cn('ml-6 list-outside list-decimal', rest.class)}>
			{@render children?.()}
		</ol>
	{/snippet}
	{#snippet ul(props)}
		{@const { children, ...rest } = props}
		<ul {...rest} class={cn('ml-6 list-outside list-disc [&_p]:my-0', rest.class)}>
			{@render children?.()}
		</ul>
	{/snippet}
	{#snippet li(props)}
		{@const { children, ...rest } = props}
		<li {...rest} class={cn('py-0', rest.class)}>
			{@render children?.()}
		</li>
	{/snippet}

	{#snippet strong(props)}
		{@const { children, ...rest } = props}
		<strong {...rest} class={cn('font-bold', rest.class)}>
			{@render children?.()}
		</strong>
	{/snippet}
	{#snippet a(props)}
		{@const { children, ...rest } = props}
		{@const href = typeof rest.href === 'string' ? rest.href : undefined}
		{@const external = isExternalHref(href)}
		<a
			{...rest}
			class={cn('underline decoration-[var(--ink-40)] underline-offset-4', rest.class)}
			target={external ? '_blank' : undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			onmouseenter={enter}
			onmouseleave={leave}
			onfocus={enter}
			onblur={leave}
		>
			{@render children?.()}
		</a>
	{/snippet}

	{#snippet h1(props)}
		{@const { children, ...rest } = props}
		<h1
			{...rest}
			class={cn('ink-h1 mt-[calc(var(--grid)*2)] mb-[var(--grid)] first:mt-0', rest.class)}
		>
			{@render children?.()}
		</h1>
	{/snippet}
	{#snippet h2(props)}
		{@const { children, ...rest } = props}
		<h2
			{...rest}
			class={cn('ink-h2 mt-[calc(var(--grid)*2)] mb-[var(--grid)] first:mt-0', rest.class)}
		>
			{@render children?.()}
		</h2>
	{/snippet}
	{#snippet h3(props)}
		{@const { children, ...rest } = props}
		<h3 {...rest} class={cn('ink-h3 mt-[var(--grid)] mb-[var(--grid)] first:mt-0', rest.class)}>
			{@render children?.()}
		</h3>
	{/snippet}
	{#snippet h4(props)}
		{@const { children, ...rest } = props}
		<h4 {...rest} class={cn('ink-h4 mt-[var(--grid)] mb-[var(--grid)] first:mt-0', rest.class)}>
			{@render children?.()}
		</h4>
	{/snippet}
	{#snippet h5(props)}
		{@const { children, ...rest } = props}
		<h5 {...rest} class={cn('ink-h5 mt-[var(--grid)] mb-[var(--grid)] first:mt-0', rest.class)}>
			{@render children?.()}
		</h5>
	{/snippet}
	{#snippet h6(props)}
		{@const { children, ...rest } = props}
		<h6 {...rest} class={cn('ink-h6 mt-[var(--grid)] mb-[var(--grid)] first:mt-0', rest.class)}>
			{@render children?.()}
		</h6>
	{/snippet}
	{#snippet p(props)}
		{@const { children, ...rest } = props}
		<p {...rest} class={cn('my-[var(--grid)] first:mt-0', rest.class)}>
			{@render children?.()}
		</p>
	{/snippet}
	{#snippet blockquote(props)}
		{@const { children, ...rest } = props}
		<blockquote {...rest} class={cn('hair-dashed my-4 px-4 py-3 italic', rest.class)}>
			{@render children?.()}
		</blockquote>
	{/snippet}
	{#snippet pre(props)}
		{@const { children } = props}
		<div class="not-prose my-4">
			<div class="hair ink-code overflow-x-auto p-3">
				{@render children?.()}
			</div>
		</div>
	{/snippet}
	{#snippet code(props)}
		{@const { children, class: className, ...rest } = props}
		<CodeBlock {...rest} class={className || undefined}>
			{@render children?.()}
		</CodeBlock>
	{/snippet}
</Markdown>
