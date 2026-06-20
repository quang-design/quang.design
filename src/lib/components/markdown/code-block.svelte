<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

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

	$effect(() => {
		if (!codeElement || !isBlock) return;
		const codeText = codeElement.textContent || '';
		if (!codeText || !lang) return;

		let cancelled = false;
		(async () => {
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
				if (cancelled) return;
				highlightedCode = html.replace(
					/style="([^"]*?)overflow[^;]*;?([^"]*)"/gi,
					(_match, before, after) => {
						const cleaned = (before + after).trim();
						return cleaned ? `style="${cleaned}"` : '';
					}
				);
			} catch {
				if (!cancelled) highlightedCode = '';
			}
		})();
		return () => {
			cancelled = true;
		};
	});
</script>

{#if !isBlock}
	<code class={cn(`rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800`, c)} {...rest}>
		{@render children?.()}
	</code>
{:else}
	{#if highlightedCode}
		<div
			class="p-4 [&_code]:block [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0 [&_span]:!filter-none"
		>
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
