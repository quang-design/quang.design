<script lang="ts">
	import { Button } from '@ui-sdk/svelte/button';
	import {
		createWordBoardController,
		WordBoardRoot,
		WordBoardWord
	} from '$lib/components/primitives/telescopic';

	let {
		text = $bindable(),
		onTextChange,
		onWordClick,
		busy = false
	}: {
		text: string;
		onTextChange: (text: string) => void;
		onWordClick: (index: number) => void;
		busy?: boolean;
	} = $props();

	const board = createWordBoardController();
	let editing = $state(false);
	let words = $derived(text.split(' '));

	function toggleEditing() {
		const next = !editing;
		board.setEditing(next);
	}

	function handleCopy() {
		void board.copy();
	}
</script>

<WordBoardRoot
	controller={board}
	{text}
	{busy}
	{editing}
	onEditingChange={(next) => {
		editing = next;
		if (!next) onTextChange(text);
	}}
	onExpand={onWordClick}
	class="flex w-full flex-col gap-[var(--grid)]"
>
	{#snippet children(state)}
		<Button
			aria-label={state.editing ? 'Done editing' : 'Edit text'}
			class="hair ink-invert flex h-[var(--grid)] w-full items-center justify-center {state.editing
				? ''
				: 'ink-active'}"
			onclick={toggleEditing}
		>
			{state.editing ? 'Done' : 'Edit'}
		</Button>

		<div
			class="min-h-[calc(var(--grid)*3)] w-full px-[var(--grid)] py-[var(--grid)] leading-[var(--grid)] shadow-[inset_0_0_0_var(--hair)_var(--ink-25)]"
		>
			{#if state.editing}
				<div
					contenteditable="true"
					role="textbox"
					aria-multiline="true"
					aria-label="Telescopic text"
					aria-busy={busy}
					bind:textContent={text}
					class="min-h-[calc(var(--grid)*3)] w-full leading-[var(--grid)] outline-none"
				></div>
			{:else}
				<div aria-busy={busy}>
					{#each words as word, i (`${i}:${word}`)}
						<WordBoardWord index={i} class="ink-invert underline underline-offset-4">
							{word}
						</WordBoardWord>{i < words.length - 1 ? ' ' : ''}
					{/each}
				</div>
			{/if}
		</div>

		<Button
			aria-label="Copy text"
			class="hair ink-invert flex h-[var(--grid)] w-full items-center justify-center bg-[var(--ink)] text-[var(--paper)]"
			onclick={handleCopy}
		>
			{state.copying ? 'Copied' : 'Copy'}
		</Button>
	{/snippet}
</WordBoardRoot>
