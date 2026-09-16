<script lang="ts">
	let {
		text,
		onTextChange,
		onWordClick,
		busy = false
	}: {
		text: string;
		onTextChange: (text: string) => void;
		onWordClick: (word: string) => void;
		busy?: boolean;
	} = $props();

	let isEditing = $state(false);
	let isCopying = $state(false);
	let words = $derived(text.split(' '));

	function handleClick() {
		isEditing = !isEditing;
		if (!isEditing) {
			onTextChange(text);
		}
	}

	function handleCopy() {
		isCopying = true;
		navigator.clipboard.writeText(text);
		setTimeout(() => {
			isCopying = false;
		}, 1000);
	}
</script>

<div class="mb-2 flex w-full justify-between">
	<button
		class="hair ink-invert w-full px-3 py-1 {isEditing ? '' : 'ink-active'}"
		onclick={handleClick}
	>
		{isEditing ? 'Done' : 'Edit'}
	</button>
</div>

{#if isEditing}
	<div
		contenteditable="true"
		role="textbox"
		aria-multiline="true"
		aria-label="Telescopic text"
		aria-busy={busy}
		bind:textContent={text}
		class="hair w-full p-3"
	></div>
{:else}
	<div class="hair w-full p-3 text-left" aria-busy={busy}>
		{#each words as word, i (`${i}:${word}`)}
			<button class="ink-invert underline underline-offset-4" onclick={() => onWordClick(word)}>
				{word}
			</button>{i < words.length - 1 ? ' ' : ''}
		{/each}
	</div>
{/if}

<div class="mt-2 flex w-full justify-between">
	<button
		class="hair ink-invert w-full bg-[var(--ink)] px-3 py-1 text-[var(--paper)]"
		onclick={handleCopy}
	>
		{isCopying ? 'Copied' : 'Copy'}
	</button>
</div>
