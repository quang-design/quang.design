<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { codeToHtml } from 'shiki';
	import { onMount } from 'svelte';

	let {
		inline,
		class: c,
		children,
		text,
		...rest
	}: {
		inline?: boolean;
		class?: ClassValue;
		children?: Snippet;
		text?: string;
	} = $props();

	let highlightedCode = $state<string>('');
	let codeElement: HTMLElement | undefined = $state();

	// Extract language from class prop (e.g., "language-typescript")
	const lang = $derived.by(() => {
		const langMatch = c ? String(c).match(/language-(\w+)/) : null;
		return langMatch ? langMatch[1] : 'plaintext';
	});

	onMount(() => {
		// Extract text from the rendered code element
		if (codeElement && !inline) {
			const codeText = codeElement.textContent || '';

			if (codeText && lang) {
				codeToHtml(codeText, {
					lang: lang,
					themes: {
						light: 'vitesse-light',
						dark: 'night-owl'
					},
					defaultColor: 'light-dark()'
				})
					.then((html) => {
						// Remove overflow-related inline styles from the generated HTML
						const cleanedHtml = html
							.replace(/style="([^"]*?)overflow[^;]*;?([^"]*)"/gi, (match, before, after) => {
								const cleaned = (before + after).trim();
								return cleaned ? `style="${cleaned}"` : '';
							});
						highlightedCode = cleanedHtml;
					})
					.catch((error) => {
						// Shiki highlighting failed - fallback to plain code
						highlightedCode = '';
					});
			}
		}
	});
</script>

<style>
	:global(.shiki-wrapper pre) {
		margin: 0 !important;
		padding: 0 !important;
		background: transparent !important;
	}

	:global(.shiki-wrapper code) {
		display: block;
	}
</style>

{#if inline}
	<code class={cn(`rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800`, c)} {...rest}>
		{@render children?.()}
	</code>
{:else}
	<div class="not-prose my-4">
		<div
			class="rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
		>
			<div class="overflow-x-auto">
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
			</div>
		</div>
	</div>
{/if}
