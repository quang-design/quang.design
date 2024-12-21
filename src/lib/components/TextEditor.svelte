<script lang="ts">
	import { browser } from '$app/environment';
	import type { SelectionState } from '$lib/types/microscopic';
	import ZipUpButton from './ZipUpButton.svelte';

	let { initialText } = $props<{ initialText: string }>();

	let text = $state(initialText);
	let selection = $state<SelectionState>({
		text: '',
		rect: null,
		indices: new Set()
	});

	// Selection handling for both mouse and touch events
	$effect(() => {
		if (!browser) return;

		const updateSelection = () => {
			const sel = window.getSelection();
			if (!sel?.toString()) return;

			selection = {
				...selection,
				text: sel.toString(),
				rect: sel.getRangeAt(0)?.getBoundingClientRect() ?? null
			};
		};

		// Handle both mouse and touch selection events
		document.addEventListener('selectionchange', updateSelection);
		document.addEventListener('touchend', updateSelection);

		return () => {
			document.removeEventListener('selectionchange', updateSelection);
			document.removeEventListener('touchend', updateSelection);
		};
	});

	async function handleZipUp() {
		if (!selection.text) return;

		replaceSelection('<Zipping...>');
		try {
			const response = await fetch(`/api/microscopic`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ context: text, selection: selection.text })
			});

			if (!response.ok) throw new Error('Failed to zip up text');

			const data = await response.json();
			replaceSelection(data.content[0].text);
			window.getSelection()?.removeAllRanges();
		} catch (error) {
			console.error(error);
			replaceSelection(selection.text);
		}
	}

	function replaceSelection(newText: string) {
		const sel = window.getSelection();
		if (!sel?.rangeCount) return;

		const range = sel.getRangeAt(0);
		range.deleteContents();

		const span = document.createElement('span');
		span.className = 'text-amber-500';
		span.textContent = newText;

		range.insertNode(span);
	}
</script>

<div class="editor-container relative w-full rounded border p-3">
	{#if selection.text}
		<ZipUpButton onClick={handleZipUp} />
	{/if}
	<p
		class="whitespace-pre-wrap selection:bg-blue-200 dark:selection:bg-blue-800"
		style="-webkit-user-select: text; user-select: text;"
	>
		{text}
	</p>
</div>

<style>
	/* Prevent text selection highlight from being hidden under the button on mobile */
	.editor-container {
		padding-bottom: 4rem;
	}

	@media (min-width: 768px) {
		.editor-container {
			padding-bottom: 1rem;
		}
	}
</style>
