<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	import { getContext } from 'svelte';
	import { PREVIEW_KEY, type PreviewState } from '$lib/preview.svelte';
	import { isExternalHref } from '$lib/config/site';
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
</script>

<Markdown {md} plugins={[gfmPlugin()]}>
	{#snippet ol(props)}
		{@const { children, ...rest } = props}
		<ol {...rest} class={['ml-6 list-outside list-decimal', rest.class]}>
			{@render children?.()}
		</ol>
	{/snippet}
	{#snippet ul(props)}
		{@const { children, ...rest } = props}
		<ul {...rest} class={['ml-6 list-outside list-disc [&_p]:my-0', rest.class]}>
			{@render children?.()}
		</ul>
	{/snippet}
	{#snippet li(props)}
		{@const { children, ...rest } = props}
		<li {...rest} class={['py-0', rest.class]}>
			{@render children?.()}
		</li>
	{/snippet}

	{#snippet strong(props)}
		{@const { children, ...rest } = props}
		<strong {...rest} class={['font-bold', rest.class]}>
			{@render children?.()}
		</strong>
	{/snippet}
	{#snippet a(props)}
		{@const { children, ...rest } = props}
		{@const href = typeof rest.href === 'string' ? rest.href : undefined}
		{@const external = isExternalHref(href)}
		<a
			{...rest}
			class={['underline decoration-[var(--ink-40)] underline-offset-4', rest.class]}
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
			class={['ink-h1 mt-[calc(var(--grid)*2)] mb-[var(--grid)] first:mt-0', rest.class]}
		>
			{@render children?.()}
		</h1>
	{/snippet}
	{#snippet h2(props)}
		{@const { children, ...rest } = props}
		<h2
			{...rest}
			class={['ink-h2 mt-[calc(var(--grid)*2)] mb-[var(--grid)] first:mt-0', rest.class]}
		>
			{@render children?.()}
		</h2>
	{/snippet}
	{#snippet h3(props)}
		{@const { children, ...rest } = props}
		<h3 {...rest} class={['ink-h3 mt-[var(--grid)] mb-[var(--grid)] first:mt-0', rest.class]}>
			{@render children?.()}
		</h3>
	{/snippet}
	{#snippet h4(props)}
		{@const { children, ...rest } = props}
		<h4 {...rest} class={['ink-h4 mt-[var(--grid)] mb-[var(--grid)] first:mt-0', rest.class]}>
			{@render children?.()}
		</h4>
	{/snippet}
	{#snippet h5(props)}
		{@const { children, ...rest } = props}
		<h5 {...rest} class={['ink-h5 mt-[var(--grid)] mb-[var(--grid)] first:mt-0', rest.class]}>
			{@render children?.()}
		</h5>
	{/snippet}
	{#snippet h6(props)}
		{@const { children, ...rest } = props}
		<h6 {...rest} class={['ink-h6 mt-[var(--grid)] mb-[var(--grid)] first:mt-0', rest.class]}>
			{@render children?.()}
		</h6>
	{/snippet}
	{#snippet p(props)}
		{@const { children, ...rest } = props}
		<p {...rest} class={['my-[var(--grid)] first:mt-0', rest.class]}>
			{@render children?.()}
		</p>
	{/snippet}
	{#snippet blockquote(props)}
		{@const { children, ...rest } = props}
		<blockquote {...rest} class={['hair-dashed my-4 px-4 py-3 italic', rest.class]}>
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
