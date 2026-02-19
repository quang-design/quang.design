<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	import { cn } from '$lib/utils';
	import CodeBlock from './code-block.svelte';
	import { Image } from '@sveltejs/enhanced-img';

	let { md }: { md: string } = $props();

	const plugins = [gfmPlugin(), { renderer: { img: Image } }];
</script>

<Markdown {md} {plugins}>
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
		<a {...rest} class={cn('text-blue-500', rest.class)} target="_blank" rel="noopener noreferrer">
			{@render children?.()}
		</a>
	{/snippet}

	{#snippet h1(props)}
		{@const { children, ...rest } = props}
		<h1 {...rest} class={cn('mt-8 mb-4 text-3xl font-semibold', rest.class)}>
			{@render children?.()}
		</h1>
	{/snippet}
	{#snippet h2(props)}
		{@const { children, ...rest } = props}
		<h2 {...rest} class={cn('mt-8 mb-4 text-2xl font-semibold', rest.class)}>
			{@render children?.()}
		</h2>
	{/snippet}
	{#snippet h3(props)}
		{@const { children, ...rest } = props}
		<h3 {...rest} class={cn('mt-8 mb-4 text-xl font-semibold', rest.class)}>
			{@render children?.()}
		</h3>
	{/snippet}
	{#snippet h4(props)}
		{@const { children, ...rest } = props}
		<h4 {...rest} class={cn('mt-8 mb-4 text-lg font-semibold', rest.class)}>
			{@render children?.()}
		</h4>
	{/snippet}
	{#snippet h5(props)}
		{@const { children, ...rest } = props}
		<h5 {...rest} class={cn('mt-8 mb-4 text-base font-semibold', rest.class)}>
			{@render children?.()}
		</h5>
	{/snippet}
	{#snippet h6(props)}
		{@const { children, ...rest } = props}
		<h6 {...rest} class={cn('mt-8 mb-4 text-sm font-semibold', rest.class)}>
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
		<blockquote
			{...rest}
			class={cn(
				'my-4 border-l-4 border-amber-400 bg-amber-100/50 px-4 py-3 text-amber-950 italic',
				rest.class
			)}
		>
			{@render children?.()}
		</blockquote>
	{/snippet}
	{#snippet pre(props)}
		{@const { children } = props}
		<div class="not-prose my-4">
			<div
				class="rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
			>
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
