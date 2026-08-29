<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import LiveFrame from './live-frame.svelte';
	import PreviewScreen from './preview-screen.svelte';
	import { Hatch, GridBackdrop, MicroLabel } from '$lib/components/primitives';
	import type { TreeGroup } from '$lib/components/atlas/index-tree.svelte';
	import type { PostMetadata } from '$lib/content/loader';
	import type { EngineerProject } from '$lib/content/engineer';

	let {
		ink = false,
		localTime,
		treeGroups,
		design,
		blog,
		engineer
	}: {
		ink?: boolean;
		localTime: string;
		treeGroups: TreeGroup[];
		design: PostMetadata[];
		blog: PostMetadata[];
		engineer: EngineerProject[];
	} = $props();

	const screenProps = $derived({
		localTime,
		groups: treeGroups,
		design,
		blog,
		engineer
	});
</script>

<h2 id="templates" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">6 · Templates</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	shadcn examples / atomic templates. Responsive four-zone shell: stacked on small screens, index +
	canvas at 768px, full three columns at 1024px. Status bar scrolls horizontally. Zones share 0.5px
	rules; the page frame is a double hairline.
</p>

<ReviewItem
	id="L1"
	group="templates"
	title="Four-zone shell — status / index / canvas / reading / hints"
	why="Replaces +layout.svelte (max-w-7xl column). Resize to check mobile (stack), tablet (index | canvas, reading below), desktop (three columns). No doubled borders on shared edges."
	stacked
	{ink}
>
	{#snippet before()}
		<LiveFrame src="/" title="Current layout" />
	{/snippet}
	{#snippet after()}
		<PreviewScreen screen="home" {...screenProps} />
	{/snippet}
</ReviewItem>

<h2 id="pages" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">
	7 · Pages — every route
</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	Live iframe of the current route on the left. Atlas composition on the right. Anh Nhi stays
	full-bleed and out of Atlas.
</p>

<ReviewItem id="P1" group="pages" title="Home" why="/" stacked {ink}>
	{#snippet before()}
		<LiveFrame src="/" title="Home" />
	{/snippet}
	{#snippet after()}
		<PreviewScreen screen="home" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P2"
	group="pages"
	title="Design index"
	why="/design — PostCard grid → IndexRows with thumbnails."
	stacked
	{ink}
>
	{#snippet before()}
		<LiveFrame src="/design" title="Design" />
	{/snippet}
	{#snippet after()}
		<PreviewScreen screen="design" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P3"
	group="pages"
	title="Design project — Doppio Kaffè"
	why="/design/doppio — gallery on the canvas, story in the reading column."
	stacked
	{ink}
>
	{#snippet before()}
		<LiveFrame src="/design/doppio" title="Doppio" />
	{/snippet}
	{#snippet after()}
		<PreviewScreen screen="project" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P4"
	group="pages"
	title="Engineer index"
	why="/engineer — project cards → IndexRows. Tools nested under Engineer in the tree."
	stacked
	{ink}
>
	{#snippet before()}
		<LiveFrame src="/engineer" title="Engineer" />
	{/snippet}
	{#snippet after()}
		<PreviewScreen screen="engineer" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P5"
	group="pages"
	title="Telescopic Text"
	why="/engineer/telescopic — E1. Tool on the canvas, instructions in reading."
	stacked
	{ink}
>
	{#snippet before()}
		<LiveFrame src="/engineer/telescopic" title="Telescopic" />
	{/snippet}
	{#snippet after()}
		<PreviewScreen screen="telescopic" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P6"
	group="pages"
	title="Microscopic Text"
	why="/engineer/microscopic — E2. Select a span, zip in place."
	stacked
	{ink}
>
	{#snippet before()}
		<LiveFrame src="/engineer/microscopic" title="Microscopic" />
	{/snippet}
	{#snippet after()}
		<PreviewScreen screen="microscopic" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P7"
	group="pages"
	title="Animation Vocabulary"
	why="/engineer/animation-vocabulary — E3. Replay is inversion, not anime.js tween."
	stacked
	{ink}
>
	{#snippet before()}
		<LiveFrame src="/engineer/animation-vocabulary" title="Animation vocabulary" />
	{/snippet}
	{#snippet after()}
		<PreviewScreen screen="animation" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P8"
	group="pages"
	title="Minesweeper"
	why="/engineer/minesweeper — E4. Board on canvas. Hatch = mine. Gap = hairline."
	stacked
	{ink}
>
	{#snippet before()}
		<LiveFrame src="/engineer/minesweeper" title="Minesweeper" />
	{/snippet}
	{#snippet after()}
		<PreviewScreen screen="minesweeper" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P9"
	group="pages"
	title="Blog index"
	why="/blog — PostCards → IndexRows."
	stacked
	{ink}
>
	{#snippet before()}
		<LiveFrame src="/blog" title="Blog" />
	{/snippet}
	{#snippet after()}
		<PreviewScreen screen="blog" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P10"
	group="pages"
	title="Blog post"
	why="/blog/posts/this-design-look-sad — thumbnail on canvas, opening in reading. Same post on both sides."
	stacked
	{ink}
>
	{#snippet before()}
		<LiveFrame src="/blog/posts/this-design-look-sad" title="Blog post" />
	{/snippet}
	{#snippet after()}
		<PreviewScreen screen="post" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P11"
	group="pages"
	title="Styles"
	why="/styles — markdown specimen. Headings become labels; code loses Shiki chrome."
	stacked
	{ink}
>
	{#snippet before()}
		<LiveFrame src="/styles" title="Styles" />
	{/snippet}
	{#snippet after()}
		<PreviewScreen screen="styles" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P12"
	group="pages"
	title="Anh Nhi — out of scope"
	why="/anh-nhi is a full-bleed invitation (Tenor Sans, no site chrome). It does not take Atlas tokens."
	stacked
	{ink}
>
	{#snippet before()}
		<LiveFrame src="/anh-nhi" title="Anh Nhi" />
	{/snippet}
	{#snippet after()}
		<div class="atlas-hair-dashed flex flex-col gap-2 p-6">
			<MicroLabel>Unchanged</MicroLabel>
			<p class="atlas-read">Full-bleed invitation. Keep the existing route and type.</p>
			<GridBackdrop class="h-24">
				<Hatch class="h-full w-1/3" />
			</GridBackdrop>
		</div>
	{/snippet}
</ReviewItem>
