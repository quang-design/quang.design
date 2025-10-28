<script lang="ts">
	import { browser } from '$app/environment';
	import type { SelectionState } from '$lib/types/microscopic';
	import ZipUpButton from './zip-up-button.svelte';

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
			if (!sel?.toString()) {
				// Clear selection state when no text is selected
				selection = {
					...selection,
					text: '',
					rect: null
				};
				return;
			}

			selection = {
				...selection,
				text: sel.toString(),
				rect: sel.getRangeAt(0)?.getBoundingClientRect() ?? null
			};
		};

		// Handle both mouse and touch selection events
		document.addEventListener('selectionchange', updateSelection);
		document.addEventListener('touchend', updateSelection);
		document.addEventListener('click', updateSelection);

		return () => {
			document.removeEventListener('selectionchange', updateSelection);
			document.removeEventListener('touchend', updateSelection);
			document.removeEventListener('click', updateSelection);
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

			// Clear selection state and UI
			window.getSelection()?.removeAllRanges();
			selection = {
				text: '',
				rect: null,
				indices: new Set()
			};
		} catch (error) {
			// Error zipping up text - reverting to original selection
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

<div class="w-full rounded-sm border p-3">
	<p
		class="focus:ring-opacity-30 mb-4 rounded-sm p-1 whitespace-pre-wrap selection:bg-blue-600 focus:p-1 focus:ring-1 focus:ring-amber-500 focus:outline-hidden dark:selection:bg-blue-800"
		style="-webkit-user-select: text; user-select: text;"
		contenteditable="true"
	>
		{text}
	</p>

	{#if selection.text}
		<div class="mt-2">
			<ZipUpButton onClick={handleZipUp} />
		</div>
	{/if}
</div>

<style>
	/* Empty style block to ensure proper PostCSS processing */
</style>
