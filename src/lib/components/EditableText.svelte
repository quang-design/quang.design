<script lang="ts">
	let { text, onTextChange, onWordClick } = $props<{
		text: string;
		onTextChange: (text: string) => void;
		onWordClick: (word: string) => void;
	}>();

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
		class="w-full rounded {isEditing
			? 'border border-amber-500'
			: 'border border-amber-500 bg-amber-500 text-white'} px-3 py-1"
		onclick={handleClick}
	>
		{isEditing ? 'Done' : 'Edit'}
	</button>
</div>

{#if isEditing}
	<div
		contenteditable="true"
		bind:textContent={text}
		class="w-full rounded-sm border border-amber-500 p-3"
	></div>
{:else}
	<div class="w-full rounded-sm border p-3 text-left">
		{#each words as word}
			<button
				class="underline underline-offset-4 hover:bg-amber-200"
				onclick={() => onWordClick(word)}
			>
				{word}
			</button>
			{' '}
		{/each}
	</div>
{/if}

<div class="mt-2 flex w-full justify-between">
	<button
		class="border-black-500 w-full rounded-sm border bg-black px-3 py-1 text-white"
		onclick={handleCopy}
	>
		{isCopying ? 'Copied' : 'Copy'}
	</button>
</div>
