<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	import { getContext } from 'svelte';
	import { cn } from '$lib/utils';
	import { PREVIEW_KEY, type PreviewState } from '$lib/preview.svelte';
	import CodeBlock from './code-block.svelte';
	let { md }: { md: string } = $props();

	const preview = getContext<PreviewState | undefined>(PREVIEW_KEY);

	function enter(event: Event) {
		const a = event.currentTarget as HTMLAnchorElement;
		const href = a.getAttribute('href') ?? a.href;
		preview?.setHover({
			eyebrow: 'Link',
			title: a.textContent?.trim() || href,
			subtitle: href,
			href
		});
	}

	function leave() {
		preview?.clearHover();
	}
</script>

<Markdown {md} plugins={[gfmPlugin()]}>
	{#snippet ol(props)}
		{@const { children, ...rest } = props}
		<ol {...rest} class={cn('ml-6 list-outside list-decimal', rest.class)}>
			{@render children?.()}
		</ol>
	{/snippet}
	{#snippet ul(props)}
		{@const { children, ...rest } = props}
		<ul {...rest} class={cn('ml-6 list-outside list-disc', rest.class)}>
			{@render children?.()}
		</ul>
	{/snippet}
	{#snippet li(props)}
		{@const { children, ...rest } = props}
		<li {...rest} class={cn('py-1', rest.class)}>
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
		<a
			{...rest}
			class={cn('underline decoration-[var(--ink-40)] underline-offset-4', rest.class)}
			target="_blank"
			rel="noopener noreferrer"
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
		<h1 {...rest} class={cn('ink-display mt-8 mb-4', rest.class)}>
			{@render children?.()}
		</h1>
	{/snippet}
	{#snippet h2(props)}
		{@const { children, ...rest } = props}
		<h2 {...rest} class={cn('ink-label mt-8 mb-4', rest.class)}>
			{@render children?.()}
		</h2>
	{/snippet}
	{#snippet h3(props)}
		{@const { children, ...rest } = props}
		<h3 {...rest} class={cn('ink-label mt-6 mb-3', rest.class)}>
			{@render children?.()}
		</h3>
	{/snippet}
	{#snippet h4(props)}
		{@const { children, ...rest } = props}
		<h4 {...rest} class={cn('ink-label mt-6 mb-3', rest.class)}>
			{@render children?.()}
		</h4>
	{/snippet}
	{#snippet h5(props)}
		{@const { children, ...rest } = props}
		<h5 {...rest} class={cn('ink-label mt-4 mb-2', rest.class)}>
			{@render children?.()}
		</h5>
	{/snippet}
	{#snippet h6(props)}
		{@const { children, ...rest } = props}
		<h6 {...rest} class={cn('ink-label mt-4 mb-2', rest.class)}>
			{@render children?.()}
		</h6>
	{/snippet}
	{#snippet p(props)}
		{@const { children, ...rest } = props}
		<p {...rest} class={cn('my-4 leading-relaxed', rest.class)}>
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
			<div class="hair bg-[var(--paper)]">
				<div class="overflow-x-auto">
					{@render children?.()}
				</div>
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
