<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { onMount } from 'svelte';

	let {
		class: c,
		children,
		text,
		...rest
	}: {
		class?: ClassValue;
		children?: Snippet;
		text?: string;
	} = $props();

	let highlightedCode = $state<string>('');
	let codeElement: HTMLElement | undefined = $state();

	const isBlock = $derived(c ? /language-\w+/.test(String(c)) : false);

	const lang = $derived.by(() => {
		const langMatch = c ? String(c).match(/language-(\w+)/) : null;
		return langMatch ? langMatch[1] : 'plaintext';
	});

	onMount(async () => {
		if (codeElement && isBlock) {
			const codeText = codeElement.textContent || '';

			if (codeText && lang) {
				try {
					const { codeToHtml } = await import('shiki');
					const html = await codeToHtml(codeText, {
						lang: lang,
						themes: {
							light: 'vitesse-light',
							dark: 'night-owl'
						},
						defaultColor: 'light-dark()'
					});
					highlightedCode = html.replace(
						/style="([^"]*?)overflow[^;]*;?([^"]*)"/gi,
						(match, before, after) => {
							const cleaned = (before + after).trim();
							return cleaned ? `style="${cleaned}"` : '';
						}
					);
				} catch {
					highlightedCode = '';
				}
			}
		}
	});
</script>

{#if !isBlock}
	<code class={cn(`rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800`, c)} {...rest}>
		{@render children?.()}
	</code>
{:else}
	{#if highlightedCode}
		<div class="shiki-wrapper p-4">
			{@html highlightedCode}
		</div>
	{/if}
	<pre
		{...rest}
		class="w-full p-4 text-sm text-zinc-900 dark:text-zinc-50"
		class:hidden={highlightedCode}><code bind:this={codeElement}
			>{text || ''}{@render children?.()}</code
		></pre>
{/if}

<style>
	:global(.shiki-wrapper pre) {
		margin: 0 !important;
		padding: 0 !important;
		background: transparent !important;
	}

	:global(.shiki-wrapper code) {
		display: block;
	}

	/* Shiki wraps every token in a span — opt out of the global ink-bleed filter */
	:global(.shiki-wrapper span) {
		filter: none;
	}
</style>
