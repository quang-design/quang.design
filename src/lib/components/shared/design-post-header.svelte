<script lang="ts">
	let {
		title,
		textBlocks,
		metaBlock
	}: {
		title: string;
		textBlocks: { type: 'text'; content: string }[];
		metaBlock: { type: 'meta'; parts: string[] } | undefined;
	} = $props();
</script>

<div class="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2">
	<div>
		<h1 class="mb-4 text-2xl font-bold">{title}</h1>
		{#each textBlocks as block (block.content)}
			<p class="text-foreground/80 mb-3 leading-relaxed">{block.content}</p>
		{/each}
	</div>
	<div class="text-foreground/60 flex flex-col gap-1 text-sm">
		{#if metaBlock}
			{#each metaBlock.parts as part (part)}
				<p>{part}</p>
			{/each}
		{/if}
	</div>
</div>
