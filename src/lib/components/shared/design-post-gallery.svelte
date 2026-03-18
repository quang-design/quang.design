<script lang="ts">
	import type { LayoutBlock } from '$lib/utils/parse-design-markdown';

	type GalleryBlock = Extract<LayoutBlock, { type: 'img' | '2col' | 'heading' | 'text' }>;

	let { blocks }: { blocks: GalleryBlock[] } = $props();
</script>

<div class="border-foreground/10 flex flex-col gap-2 border-t-[0.5px] pt-4 md:gap-8">
	{#each blocks as block, i (i)}
		{#if block.type === 'img'}
			<img
				src={block.src}
				alt=""
				class="border-foreground/10 w-full border-[0.5px]"
				loading="lazy"
			/>
		{:else if block.type === '2col'}
			<div class="grid gap-2 md:grid-cols-2 md:gap-8">
				{#if block.left}
					<img
						src={block.left}
						alt=""
						class="border-foreground/10 w-full border-[0.5px]"
						loading="lazy"
					/>
				{/if}
				{#if block.right}
					<img
						src={block.right}
						alt=""
						class="border-foreground/10 w-full border-[0.5px]"
						loading="lazy"
					/>
				{/if}
			</div>
		{:else if block.type === 'heading'}
			<p class="text-foreground/40 px-1 pt-4 text-xs tracking-widest uppercase">
				{block.content}
			</p>
		{:else if block.type === 'text'}
			<p class="text-foreground/80 px-1 py-4 leading-relaxed">{block.content}</p>
		{/if}
	{/each}
</div>
