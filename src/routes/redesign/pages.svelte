<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import PreviewScreen from './preview-screen.svelte';
	import type { TreeGroup } from '$lib/components/atlas/index-tree.svelte';
	import type { PostMetadata } from '$lib/content/loader';
	import type { EngineerProject } from '$lib/content/engineer';

	let {
		localTime,
		treeGroups,
		design,
		blog,
		engineer
	}: {
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
<p class="atlas-row-desc max-w-3xl">
	Responsive four-zone shell: stacked on small screens, index + canvas at 768px, full three columns
	at 1024px. Status bar scrolls horizontally. Zones share 0.5px rules; the page frame is a double
	hairline.
</p>

<ReviewItem
	id="L1"
	group="templates"
	title="Four-zone shell — status / index / canvas / reading / hints"
	why="Resize to check mobile (stack), tablet (index | canvas, reading below), desktop (three columns)."
	fullWidth
>
	{#snippet children()}
		<PreviewScreen screen="home" {...screenProps} />
	{/snippet}
</ReviewItem>

<h2 id="pages" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">
	7 · Pages — every route
</h2>
<p class="atlas-row-desc max-w-3xl">
	Full compositions for each live route. Anh Nhi (/anh-nhi) is out of scope — birthday invitation,
	not site chrome.
</p>

<ReviewItem
	id="P1"
	group="pages"
	title="Home — /"
	why="Hatch hero on canvas, bio in reading."
	fullWidth
>
	{#snippet children()}
		<PreviewScreen screen="home" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P2"
	group="pages"
	title="Design index — /design"
	why="PostCard grid → IndexRows with thumbnails."
	fullWidth
>
	{#snippet children()}
		<PreviewScreen screen="design" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P3"
	group="pages"
	title="Design project — /design/doppio"
	why="Gallery on the canvas, story in the reading column."
	fullWidth
>
	{#snippet children()}
		<PreviewScreen screen="project" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P4"
	group="pages"
	title="Engineer index — /engineer"
	why="Project cards → IndexRows. Tools nested under Engineer in the tree."
	fullWidth
>
	{#snippet children()}
		<PreviewScreen screen="engineer" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P5"
	group="pages"
	title="Telescopic Text — /engineer/telescopic"
	why="E1. Tool on the canvas, instructions in reading."
	fullWidth
>
	{#snippet children()}
		<PreviewScreen screen="telescopic" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P6"
	group="pages"
	title="Microscopic Text — /engineer/microscopic"
	why="E2. Select a span, zip in place."
	fullWidth
>
	{#snippet children()}
		<PreviewScreen screen="microscopic" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P7"
	group="pages"
	title="Animation Vocabulary — /engineer/animation-vocabulary"
	why="E3. Replay is inversion, not anime.js tween."
	fullWidth
>
	{#snippet children()}
		<PreviewScreen screen="animation" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P8"
	group="pages"
	title="Minesweeper — /engineer/minesweeper"
	why="E4. Board on canvas. Hatch = mine. Gap = hairline."
	fullWidth
>
	{#snippet children()}
		<PreviewScreen screen="minesweeper" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem id="P9" group="pages" title="Blog index — /blog" why="PostCards → IndexRows." fullWidth>
	{#snippet children()}
		<PreviewScreen screen="blog" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P10"
	group="pages"
	title="Blog post — /blog/posts/this-design-look-sad"
	why="Thumbnail on canvas, opening in reading."
	fullWidth
>
	{#snippet children()}
		<PreviewScreen screen="post" {...screenProps} />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P11"
	group="pages"
	title="Styles — /styles"
	why="Markdown specimen. Headings become labels; code loses Shiki chrome."
	fullWidth
>
	{#snippet children()}
		<PreviewScreen screen="styles" {...screenProps} />
	{/snippet}
</ReviewItem>
