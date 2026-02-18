<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { page } from '$app/state';

	let {
		data
	}: {
		data: {
			md: string;
			meta: { title: string; description: string; thumbnail: string; date: string };
		};
	} = $props();

	type LayoutBlock =
		| { type: 'text'; content: string }
		| { type: 'meta'; parts: string[] }
		| { type: 'img'; src: string }
		| { type: '2col'; left: string; right: string }
		| { type: 'heading'; content: string };

	const blocks = $derived.by(() => {
		const lines = data.md.split('\n');
		const result: LayoutBlock[] = [];
		let i = 0;
		while (i < lines.length) {
			const line = lines[i];
			if (line.startsWith('<!-- 2col -->')) {
				const imgLines: string[] = [];
				let j = i + 1;
				while (j < lines.length && imgLines.length < 2) {
					if (lines[j].startsWith('![')) imgLines.push(lines[j]);
					else if (lines[j].trim()) break;
					j++;
				}
				const left = imgLines[0]?.match(/!\[.*?\]\((.*?)\)/)?.[1] ?? '';
				const right = imgLines[1]?.match(/!\[.*?\]\((.*?)\)/)?.[1] ?? '';
				if (left || right) result.push({ type: '2col', left, right });
				i = j;
			} else if (line.startsWith('![')) {
				const src = line.match(/!\[.*?\]\((.*?)\)/)?.[1];
				if (src) result.push({ type: 'img', src });
				i++;
			} else if ((line.startsWith('*') || line.startsWith('_')) && line.includes('Client:')) {
				const text = line.replace(/^[*_]|[*_]$/g, '');
				const parts = text
					.split('·')
					.map((p) => p.trim())
					.filter(Boolean);
				result.push({ type: 'meta', parts });
				i++;
			} else if (line.startsWith('**') && line.endsWith('**')) {
				result.push({ type: 'heading', content: line.slice(2, -2) });
				i++;
			} else if (line.trim()) {
				result.push({ type: 'text', content: line });
				i++;
			} else {
				i++;
			}
		}
		return result;
	});

	const metaIndex = $derived(blocks.findIndex((b) => b.type === 'meta'));

	const metaBlock = $derived(
		metaIndex >= 0 ? (blocks[metaIndex] as { type: 'meta'; parts: string[] }) : undefined
	);

	const textBlocks = $derived(
		blocks.slice(0, metaIndex >= 0 ? metaIndex : undefined).filter((b) => b.type === 'text') as {
			type: 'text';
			content: string;
		}[]
	);

	const galleryBlocks = $derived(
		blocks
			.slice(metaIndex >= 0 ? metaIndex + 1 : 0)
			.filter(
				(b) => b.type === 'img' || b.type === '2col' || b.type === 'heading' || b.type === 'text'
			) as (
			| { type: 'img'; src: string }
			| { type: '2col'; left: string; right: string }
			| { type: 'heading'; content: string }
			| { type: 'text'; content: string }
		)[]
	);
</script>

<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	canonical={`https://quang.design/design/${page.params.slug}`}
	image={data.meta.thumbnail ? data.meta.thumbnail : undefined}
	type="article"
	publishedTime={data.meta.date ? new Date(data.meta.date).toISOString() : undefined}
	author="Quang"
/>

<div class="flex flex-col">
	<div class="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2">
		<div>
			<h1 class="mb-4 text-2xl font-bold">{data.meta.title}</h1>
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

	<div class="border-foreground/10 flex flex-col gap-2 border-t-[0.5px] pt-4 md:gap-8">
		{#each galleryBlocks as block (JSON.stringify(block))}
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
</div>
