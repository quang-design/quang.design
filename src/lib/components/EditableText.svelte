<script lang="ts">
	let { text, onTextChange, onWordClick } = $props<{
		text: string;
		onTextChange: (text: string) => void;
		onWordClick: (word: string) => void;
	}>();

	let isEditing = $state(false);
	let words = $derived(text.split(' '));

	function handleClick() {
		isEditing = !isEditing;
		if (!isEditing) {
			onTextChange(text);
		}
	}
</script>

<div class="mb-2 flex justify-between">
	<button
		class="rounded {isEditing
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
		class="w-full rounded border border-amber-500 p-3"
	></div>
{:else}
	<div class="w-full rounded border p-3 text-left">
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
