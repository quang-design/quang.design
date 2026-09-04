<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import LiveFrame from './live-frame.svelte';
	import { MicroLabel } from '$lib/components/primitives';
	import type { PostMetadata } from '$lib/content/loader';
	import type { EngineerProject } from '$lib/content/engineer';

	let {
		design: _design,
		blog: _blog,
		engineer: _engineer
	}: {
		design: PostMetadata[];
		blog: PostMetadata[];
		engineer: EngineerProject[];
	} = $props();
</script>

<h2 id="templates" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">6 · Templates</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	The four-zone shell is the live layout. After panes iframe the real routes so the catalog stays
	canonical with the site.
</p>

<ReviewItem
	id="L1"
	group="templates"
	title="Four-zone shell — status / index / canvas / reading / footer"
	why="Grid origin is viewport-fixed. Columns are multiples of --grid. Hover a row to preview on the right. Quote + subscribe in the footer."
	stacked
>
	{#snippet before()}
		<p class="text-muted-foreground text-xs">Previous layout: max-w-7xl column, navbar, footer.</p>
	{/snippet}
	{#snippet after()}
		<LiveFrame src="/" title="Live shell" />
	{/snippet}
</ReviewItem>

<h2 id="pages" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">
	7 · Pages — live routes
</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	Each after pane is the real page. Anh Nhi stays full-bleed and out of the shell.
</p>

<ReviewItem id="P1" group="pages" title="Home" why="/" stacked>
	{#snippet before()}
		<p class="text-muted-foreground text-xs">Three-column markdown home.</p>
	{/snippet}
	{#snippet after()}
		<LiveFrame src="/" title="Home" />
	{/snippet}
</ReviewItem>

<ReviewItem id="P2" group="pages" title="Design index" why="/design" stacked>
	{#snippet before()}
		<p class="text-muted-foreground text-xs">PostCard grid.</p>
	{/snippet}
	{#snippet after()}
		<LiveFrame src="/design" title="Design" />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P3"
	group="pages"
	title="Design project — Doppio Kaffè"
	why="/design/doppio"
	stacked
>
	{#snippet before()}
		<p class="text-muted-foreground text-xs">Intro + meta + gallery.</p>
	{/snippet}
	{#snippet after()}
		<LiveFrame src="/design/doppio" title="Doppio" />
	{/snippet}
</ReviewItem>

<ReviewItem id="P4" group="pages" title="Engineer index" why="/engineer" stacked>
	{#snippet before()}
		<p class="text-muted-foreground text-xs">Project cards.</p>
	{/snippet}
	{#snippet after()}
		<LiveFrame src="/engineer" title="Engineer" />
	{/snippet}
</ReviewItem>

<ReviewItem id="P5" group="pages" title="Telescopic Text" why="/engineer/telescopic" stacked>
	{#snippet before()}
		<p class="text-muted-foreground text-xs">App + copy in one column.</p>
	{/snippet}
	{#snippet after()}
		<LiveFrame src="/engineer/telescopic" title="Telescopic" />
	{/snippet}
</ReviewItem>

<ReviewItem id="P6" group="pages" title="Microscopic Text" why="/engineer/microscopic" stacked>
	{#snippet before()}
		<p class="text-muted-foreground text-xs">App + copy in one column.</p>
	{/snippet}
	{#snippet after()}
		<LiveFrame src="/engineer/microscopic" title="Microscopic" />
	{/snippet}
</ReviewItem>

<ReviewItem
	id="P7"
	group="pages"
	title="Animation Vocabulary"
	why="/engineer/animation-vocabulary"
	stacked
>
	{#snippet before()}
		<p class="text-muted-foreground text-xs">anime.js cards.</p>
	{/snippet}
	{#snippet after()}
		<LiveFrame src="/engineer/animation-vocabulary" title="Animation vocabulary" />
	{/snippet}
</ReviewItem>

<ReviewItem id="P8" group="pages" title="Minesweeper" why="/engineer/minesweeper" stacked>
	{#snippet before()}
		<p class="text-muted-foreground text-xs">Bevelled cells, emoji mines.</p>
	{/snippet}
	{#snippet after()}
		<LiveFrame src="/engineer/minesweeper" title="Minesweeper" />
	{/snippet}
</ReviewItem>

<ReviewItem id="P9" group="pages" title="Blog index" why="/blog" stacked>
	{#snippet before()}
		<p class="text-muted-foreground text-xs">PostCard grid with descriptions.</p>
	{/snippet}
	{#snippet after()}
		<LiveFrame src="/blog" title="Blog" />
	{/snippet}
</ReviewItem>

<ReviewItem id="P10" group="pages" title="Blog post" why="/blog/posts/this-design-look-sad" stacked>
	{#snippet before()}
		<p class="text-muted-foreground text-xs">Title + date + markdown in one column.</p>
	{/snippet}
	{#snippet after()}
		<LiveFrame src="/blog/posts/this-design-look-sad" title="Blog post" />
	{/snippet}
</ReviewItem>

<ReviewItem id="P11" group="pages" title="Styles" why="/styles" stacked>
	{#snippet before()}
		<p class="text-muted-foreground text-xs">Markdown specimen, previous renderer.</p>
	{/snippet}
	{#snippet after()}
		<LiveFrame src="/styles" title="Styles" />
	{/snippet}
</ReviewItem>

<ReviewItem id="P12" group="pages" title="Anh Nhi — out of scope" why="/anh-nhi" stacked>
	{#snippet before()}
		<LiveFrame src="/anh-nhi" title="Anh Nhi" />
	{/snippet}
	{#snippet after()}
		<div class="hair-dashed flex flex-col gap-2 p-6">
			<MicroLabel>Unchanged</MicroLabel>
			<p class="ink-read">Full-bleed invitation. Same route, same type, no site chrome.</p>
		</div>
	{/snippet}
</ReviewItem>
