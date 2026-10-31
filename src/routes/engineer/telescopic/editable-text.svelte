<script lang="ts">
	let {
		text,
		onTextChange,
		onWordClick,
		busy = false
	}: {
		text: string;
		onTextChange: (text: string) => void;
		onWordClick: (index: number) => void;
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

<div class="flex w-full flex-col gap-[var(--grid)]">
	<button
		class="hair ink-invert flex h-[var(--grid)] w-full items-center justify-center {isEditing
			? ''
			: 'ink-active'}"
		onclick={handleClick}
	>
		{isEditing ? 'Done' : 'Edit'}
	</button>

	{#if isEditing}
		<div
			contenteditable="true"
			role="textbox"
			aria-multiline="true"
			aria-label="Telescopic text"
			aria-busy={busy}
			bind:textContent={text}
			class="min-h-[calc(var(--grid)*3)] w-full px-[var(--grid)] py-[var(--grid)] leading-[var(--grid)] shadow-[inset_0_0_0_var(--hair)_var(--ink-25)]"
		></div>
	{:else}
		<div
			class="min-h-[calc(var(--grid)*3)] w-full px-[var(--grid)] py-[var(--grid)] text-left leading-[var(--grid)] shadow-[inset_0_0_0_var(--hair)_var(--ink-25)]"
			aria-busy={busy}
		>
			{#each words as word, i (`${i}:${word}`)}
				<button class="ink-invert underline underline-offset-4" onclick={() => onWordClick(i)}>
					{word}
				</button>{i < words.length - 1 ? ' ' : ''}
			{/each}
		</div>
	{/if}

	<button
		class="hair ink-invert flex h-[var(--grid)] w-full items-center justify-center bg-[var(--ink)] text-[var(--paper)]"
		onclick={handleCopy}
	>
		{isCopying ? 'Copied' : 'Copy'}
	</button>
</div>
