<script lang="ts">
	import type { SelectionState } from '$lib/types/microscopic';
	import { apiPaths } from '$lib/config/api';
	import {
		rangeFromSelection,
		replaceSlice,
		shiftRanges,
		toSegments,
		type ZipRange
	} from '$lib/utils/microscopic-zip';
	import ZipUpButton from './zip-up-button.svelte';

	let { initialText, apiPath = apiPaths.microscopic }: { initialText: string; apiPath?: string } =
		$props();

	const emptySelection: SelectionState = {
		text: '',
		rect: null,
		start: 0,
		end: 0
	};

	// svelte-ignore state_referenced_locally
	let text = $state(initialText);
	let zipping = $state(false);
	let ranges = $state<ZipRange[]>([]);
	let editorEl = $state<HTMLElement | undefined>(undefined);
	let selection = $state<SelectionState>(emptySelection);
	let nextId = 0;
	let zipPointerDown = false;

	const segments = $derived(toSegments(text, ranges));

	function updateSelection() {
		if (zipping || zipPointerDown) return;

		const sel = window.getSelection();
		if (!sel || sel.isCollapsed || !sel.rangeCount || !editorEl) {
			selection = emptySelection;
			return;
		}

		const range = sel.getRangeAt(0);
		const offsets = rangeFromSelection(editorEl, range);
		if (!offsets) {
			selection = emptySelection;
			return;
		}

		selection = {
			text: sel.toString(),
			rect: range.getBoundingClientRect(),
			start: offsets.start,
			end: offsets.end
		};
	}

	async function handleZipUp() {
		const selected = selection.text;
		const start = selection.start;
		const end = selection.end;
		if (!selected || zipping) return;

		zipPointerDown = true;
		zipping = true;
		const previousText = text;
		const previousRanges = ranges;
		const placeholder = 'Zipping...';
		const pendingId = `zip-${nextId++}`;

		text = replaceSlice(previousText, start, end, placeholder);
		ranges = [
			...shiftRanges(previousRanges, start, end, start + placeholder.length),
			{
				id: pendingId,
				start,
				end: start + placeholder.length,
				pending: true
			}
		];
		selection = emptySelection;
		window.getSelection()?.removeAllRanges();

		try {
			const response = await fetch(apiPath, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ context: previousText, selection: selected, start, end })
			});

			if (!response.ok) throw new Error('Failed to zip up text');

			const data: { content?: Array<{ text?: string }> } = await response.json();
			const zippedText = data.content?.[0]?.text ?? '';
			if (!zippedText.trim()) throw new Error('Empty zip result');

			text = replaceSlice(previousText, start, end, zippedText);
			ranges = [
				...shiftRanges(previousRanges, start, end, start + zippedText.length),
				{
					id: pendingId,
					start,
					end: start + zippedText.length
				}
			];
		} catch (_error) {
			text = previousText;
			ranges = previousRanges;
		} finally {
			zipping = false;
			zipPointerDown = false;
		}
	}
</script>

<svelte:document onselectionchange={updateSelection} />

<div class="hair w-full p-3">
	<div
		bind:this={editorEl}
		class="mb-4 p-1 whitespace-pre-wrap selection:bg-[var(--ink)] selection:text-[var(--paper)]"
		style="-webkit-user-select: text; user-select: text;"
		role="textbox"
		aria-multiline="true"
		aria-readonly="true"
		aria-label="Microscopic text"
		aria-busy={zipping}
	>
		{#each segments as segment (segment.id)}
			{#if segment.zipped}
				<span class="ink-mark inline underline underline-offset-4">
					{segment.text}
				</span>
			{:else}
				{segment.text}
			{/if}
		{/each}
	</div>

	{#if selection.text && !zipping}
		<ZipUpButton onClick={handleZipUp} rect={selection.rect} />
	{/if}
</div>
