<script lang="ts">
	import { Shell, IndexRow, ReadingPane } from '$lib/components/atlas';
	import { Hatch, GridBackdrop, Mark, MicroLabel, Action } from '$lib/components/primitives';
	import type { TreeGroup } from '$lib/components/atlas/index-tree.svelte';
	import type { PostMetadata } from '$lib/content/loader';
	import type { EngineerProject } from '$lib/content/engineer';

	let {
		screen,
		localTime,
		groups,
		design,
		blog,
		engineer
	}: {
		screen:
			| 'home'
			| 'design'
			| 'project'
			| 'engineer'
			| 'telescopic'
			| 'blog'
			| 'post'
			| 'minesweeper';
		localTime: string;
		groups: TreeGroup[];
		design: PostMetadata[];
		blog: PostMetadata[];
		engineer: EngineerProject[];
	} = $props();

	const active = $derived(
		(
			{
				home: 'Q',
				design: 'D',
				project: 'D',
				engineer: 'E',
				telescopic: 'E1',
				blog: 'B',
				post: 'B',
				minesweeper: 'E4'
			} as const
		)[screen]
	);

	const stats = $derived([
		{ label: 'Location', value: 'Nha Trang' },
		{ label: 'Country', value: 'Vietnam' },
		{ label: 'Local time', value: localTime }
	]);

	const designRows = $derived(design.slice(0, 6));
	const blogRows = $derived(blog);
	const selectedDesign = $derived(design[0]);
	const selectedPost = $derived(blog[0]);

	const mineMask = [
		0, 1, 0, 0, 2, 9, 1, 0, 0, 1, 1, 0, 2, 2, 1, 0, 1, 2, 1, 0, 0, 0, 0, 0, 9, 2, 1, 1, 1, 1, 0, 0,
		1, 1, 0, 1, 9, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 9
	];

	let tea = $state('I made tea.');
	function expandTea() {
		tea = tea === 'I made tea.' ? 'I brewed a small pot of tea.' : 'I made tea.';
	}
</script>

{#snippet homeWhat()}
	<p>
		A Vietnamese graphic designer who <Mark>builds the things he designs</Mark>. Brand systems,
		naming, story — then the site that carries them.
	</p>
{/snippet}
{#snippet homeWork()}
	<div class="atlas-stack flex flex-col">
		<IndexRow code="01" title="Design Director @FlexOS" date="2023 — now" />
		<IndexRow code="02" title="Design Manager @FlexOS" date="2022 — 2023" />
		<IndexRow code="03" title="Lead Graphic Designer @Dreamplex" date="2021 — 2022" />
	</div>
{/snippet}
{#snippet designSelected()}
	{#if selectedDesign}
		<p>{selectedDesign.description}</p>
		<p class="atlas-label">{selectedDesign.date}</p>
	{/if}
{/snippet}
{#snippet doppioWhat()}
	<p>
		Soft textures, earth tones and handwritten fonts for a welcoming oasis — a home away from home
		where you're always greeted with a smile.
	</p>
{/snippet}
{#snippet doppioMeta()}
	<p>Client: Doppio Kaffè</p>
	<p>Project: Brand Identity</p>
	<p>Location: Hanoi, Vietnam</p>
{/snippet}
{#snippet engInside()}
	<p>
		Telescopic Text, Microscopic Text, Animation Vocabulary and Minesweeper live
		<Mark>under Engineer</Mark> — same tree, nested rows, one shared rule.
	</p>
{/snippet}
{#snippet teleHow()}
	<p>
		A simple sentence sits on the canvas. Each click asks the model to expand one word in place —
		the reading column stays still.
	</p>
{/snippet}
{#snippet blogLatest()}
	{#if selectedPost}
		<p>{selectedPost.description}</p>
		<p class="atlas-label">{selectedPost.date}</p>
	{/if}
{/snippet}
{#snippet postOpen()}
	<p>
		So, I sent my Christmas poster to the Marketing Team for their feedback today. It's November
		2021, and we're at the tail end of this turbulent year.
	</p>
	<p>“I don't know, but this design looks sad.”</p>
{/snippet}
{#snippet mineRules()}
	<p>
		Numbers are <Mark>labels</Mark>. Mines are hatch. Empty cells stay paper. No fill colour, no
		radius, no shadow.
	</p>
{/snippet}

<Shell title="quang.design" {stats} actions={['Ink theme']} {groups} {active}>
	{#snippet canvas()}
		{#if screen === 'home'}
			<GridBackdrop class="flex h-full min-h-64 flex-col justify-end gap-3 p-3">
				<div class="atlas-stack-x flex items-end">
					<Hatch class="h-24 w-28" />
					<Hatch class="h-36 w-20" />
					<Hatch class="h-16 w-32" />
					<div class="atlas-hair-dashed h-20 w-16"></div>
				</div>
			</GridBackdrop>
		{:else if screen === 'design'}
			<div class="atlas-stack atlas-stack-flush flex flex-col">
				{#each designRows as post, i (post.slug)}
					<IndexRow
						code="D{i + 1}"
						thumbnail={post.thumbnail}
						placeholder={!post.thumbnail}
						title={post.title}
						date={post.date}
						description={post.description}
						href="/design/{post.slug}"
					/>
				{/each}
			</div>
		{:else if screen === 'project'}
			<GridBackdrop class="grid grid-cols-2 gap-0">
				{#each [1, 5, 3, 8] as n (n)}
					<img
						src="/design/posts/doppio/doppio_{n}.avif"
						alt=""
						class="aspect-3/2 h-full w-full object-cover"
					/>
				{/each}
			</GridBackdrop>
		{:else if screen === 'engineer'}
			<div class="atlas-stack atlas-stack-flush flex flex-col">
				{#each engineer as project, i (project.href)}
					<IndexRow
						code="E{i + 1}"
						placeholder
						title={project.title}
						description={project.description}
						href={project.href}
					/>
				{/each}
			</div>
		{:else if screen === 'telescopic'}
			<div class="flex h-full flex-col justify-center gap-4 p-4">
				<MicroLabel>Canvas · click a word</MicroLabel>
				<p class="atlas-read">
					{tea}
				</p>
				<div class="flex gap-2">
					<Action onclick={expandTea}>Expand “made”</Action>
					<Action glyph="↺" onclick={() => (tea = 'I made tea.')}>Reset</Action>
				</div>
			</div>
		{:else if screen === 'blog'}
			<div class="atlas-stack atlas-stack-flush flex flex-col">
				{#each blogRows as post, i (post.slug)}
					<IndexRow
						code="B{i + 1}"
						thumbnail={post.thumbnail}
						placeholder={!post.thumbnail}
						title={post.title}
						date={post.date}
						description={post.description}
						href="/blog/posts/{post.slug}"
					/>
				{/each}
			</div>
		{:else if screen === 'post'}
			<GridBackdrop class="p-3">
				{#if selectedPost?.thumbnail}
					<img
						src={selectedPost.thumbnail}
						alt=""
						class="atlas-hair aspect-3/2 w-full object-cover"
					/>
				{/if}
			</GridBackdrop>
		{:else}
			<div class="flex h-full flex-col justify-center gap-3 p-4">
				<MicroLabel>Minesweeper · 8 × 8</MicroLabel>
				<div
					class="grid w-fit grid-cols-8 gap-[length:var(--hair)] bg-[var(--ink-25)] p-[length:var(--hair)]"
				>
					{#each mineMask as cell, i (i)}
						<div
							class="flex size-7 items-center justify-center bg-[var(--paper)] {cell === 9
								? 'atlas-hatch'
								: ''}"
						>
							{#if cell > 0 && cell < 9}
								<span class="atlas-label">{cell}</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/snippet}

	{#snippet reading()}
		{#if screen === 'home'}
			<ReadingPane
				tabs={['What it does', "How it's built"]}
				eyebrow="Quang Nguyen"
				title="Design Engineer"
				subtitle="how a brand gets designed, built and shipped"
				sections={[
					{ label: 'What this is', body: homeWhat },
					{ label: 'Work', body: homeWork }
				]}
			/>
		{:else if screen === 'design'}
			<ReadingPane
				eyebrow="Index · Design"
				title="Design work"
				subtitle="{design.length} projects"
				sections={[{ label: 'Selected', body: designSelected }]}
			/>
		{:else if screen === 'project'}
			<ReadingPane
				eyebrow="Design · Doppio Kaffè"
				title="Five years of cozy character"
				subtitle="Brand identity · Hanoi · 2018"
				sections={[
					{ label: 'What this is', body: doppioWhat },
					{ label: 'Meta', body: doppioMeta }
				]}
			/>
		{:else if screen === 'engineer'}
			<ReadingPane
				eyebrow="Index · Engineer"
				title="All things engineering"
				subtitle="Most of them are built with Svelte and Tailwind CSS."
				sections={[{ label: 'Inside this index', body: engInside }]}
			/>
		{:else if screen === 'telescopic'}
			<ReadingPane
				tabs={['What it does', "How it's built"]}
				eyebrow="Engineer · E1"
				title="Telescopic Text"
				subtitle="Click a word. It grows."
				sections={[{ label: 'How to read it', body: teleHow }]}
			/>
		{:else if screen === 'blog'}
			<ReadingPane
				eyebrow="Index · Blog"
				title="Blog posts"
				subtitle="{blog.length} notes"
				sections={[{ label: 'Latest', body: blogLatest }]}
			/>
		{:else if screen === 'post'}
			<ReadingPane
				eyebrow="Blog · {selectedPost?.date ?? ''}"
				title={selectedPost?.title ?? 'Post'}
				subtitle={selectedPost?.description ?? ''}
				sections={[{ label: 'Opening', body: postOpen }]}
			/>
		{:else}
			<ReadingPane
				eyebrow="Engineer · E4"
				title="Minesweeper"
				subtitle="A classic, drawn with hatch instead of colour."
				sections={[{ label: 'Rules', body: mineRules }]}
			/>
		{/if}
	{/snippet}
</Shell>
