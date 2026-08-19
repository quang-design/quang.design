<script lang="ts">
	import '$lib/styles/atlas.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import PostCard from '$lib/components/shared/post-card.svelte';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import HorizontalDivider from '$lib/components/shared/horizontal-divider.svelte';
	import { Markdown } from '$lib/components/markdown';
	import {
		MicroLabel,
		StatCell,
		KeySlot,
		Count,
		Rule,
		Mark,
		Tab,
		Action,
		Hatch,
		GridBackdrop,
		HintKey
	} from '$lib/components/primitives';
	import { StatusBar, IndexTree, ReadingPane, HintBar, IndexRow } from '$lib/components/atlas';
	import ReviewItem from './review-item.svelte';
	import { review } from './review.svelte';

	let ink = $state(false);
	let copied = $state(false);

	const samplePost = {
		slug: 'doppio-kaffe',
		title: "5 Years of Crafting Doppio Kaffè's Cozy Character",
		description:
			'As a designer and loyal patron, it&rsquo;s been my privilege to help shape the branding for Doppio Kaffè over the past 5 years.',
		thumbnail: '',
		date: '2023-01-01'
	};

	const treeGroups = [
		{
			label: 'The Work',
			rows: [
				{ code: 'D', label: 'Design', count: 8 },
				{ code: 'D1', label: 'Brand Identity', count: 5, nested: true },
				{ code: 'D2', label: 'Editorial', count: 3, nested: true },
				{ code: 'E', label: 'Engineer', count: 4 },
				{ code: 'B', label: 'Blog', count: 12 }
			]
		},
		{
			label: 'Supporting',
			rows: [
				{ code: 'S', label: 'Styles', count: 1 },
				{ code: 'T', label: 'Telescopic Text', count: 2 }
			]
		}
	];

	const homeMd = `## Xin Chào!

My name is Quang – a Vietnamese Graphic Designer skilled at crafting **impactful brand identities**.

- Design Director @FlexOS
- Design Manager @FlexOS`;

	async function copySummary() {
		await navigator.clipboard.writeText(review.summary);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<svelte:head>
	<title>Atlas redesign review</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex w-full flex-col gap-6 pb-16">
	<header
		class="border-foreground/25 bg-background sticky top-0 z-10 flex flex-wrap items-center gap-4 border-b-[0.5px] py-3"
	>
		<h1 class="text-lg">Atlas redesign review</h1>
		<p class="text-muted-foreground text-xs">
			{review.count('approved')} approved / {review.count('revise')} revise / {review.count(
				'pending'
			)} pending
		</p>
		<div class="ml-auto flex items-center gap-2">
			<Button variant="outline" size="sm" class="cursor-pointer" onclick={() => (ink = !ink)}>
				{ink ? 'Paper theme' : 'Ink theme'}
			</Button>
			<Button variant="outline" size="sm" class="cursor-pointer" onclick={copySummary}>
				{copied ? 'Copied' : 'Copy review'}
			</Button>
			<Button variant="ghost" size="sm" class="cursor-pointer" onclick={() => review.reset()}>
				Reset
			</Button>
		</div>
	</header>

	<p class="text-muted-foreground max-w-3xl text-xs">
		Throwaway route. Left column is the current site, right column is the proposed Atlas layer
		(tokens scoped to <code>.atlas</code>, nothing global changed). Approve or mark revise on each
		item, add notes, then hit “Copy review” and paste it back to me.
	</p>

	<!-- ============================ SUB-ATOMIC ============================ -->
	<h2 class="mt-4 text-sm tracking-widest uppercase">1 &middot; Sub-atomic — tokens</h2>

	<ReviewItem
		id="T1"
		group="tokens"
		title="Surface: one warm paper tone, no elevation"
		why="Reference uses a single #cdc499 paper for canvas, sidebar and bars — oklch(0.817 0.058 97.6). Current site is pure white / neutral dark with no warmth."
		{ink}
	>
		{#snippet before()}
			<div class="flex flex-col gap-2 text-xs">
				<div class="border-foreground/25 h-16 border-[0.5px] bg-white"></div>
				<code>--background: oklch(1 0 0)</code>
				<div class="border-foreground/25 h-16 border-[0.5px] bg-[oklch(0.145_0_0)]"></div>
				<code>.dark --background: oklch(0.145 0 0)</code>
			</div>
		{/snippet}
		{#snippet after()}
			<div class="flex flex-col gap-2">
				<div class="atlas-hair h-16 bg-[var(--paper)]"></div>
				<code class="atlas-label">--paper: oklch(0.817 0.058 97.6)</code>
				<div class="atlas-hair h-16 bg-[var(--ink)]"></div>
				<code class="atlas-label">--ink: oklch(0.155 0.032 86.6)</code>
				<div class="flex gap-1">
					{#each ['--ink', '--ink-60', '--ink-40', '--ink-25', '--ink-10'] as step (step)}
						<div class="flex grow flex-col gap-1">
							<div class="atlas-hair h-8" style="background-color: var({step})"></div>
							<code class="atlas-label">{step}</code>
						</div>
					{/each}
				</div>
			</div>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="T2"
		group="tokens"
		title="No accent colour — emphasis by inversion"
		why="Reference has zero hue variation: emphasis is an inverted ink block. Current site uses blue-500 links with an animated underline, which is the loudest thing on the page."
		{ink}
	>
		{#snippet before()}
			<p class="text-sm">
				Read the <a href="/design">design work</a> or the
				<a href="/blog">blog</a>. Emphasis today is
				<strong class="font-semibold">bold weight</strong> plus blue links.
			</p>
		{/snippet}
		{#snippet after()}
			<p>
				Read the <span class="underline decoration-[var(--ink-40)] underline-offset-4"
					>design work</span
				>
				or the <span class="underline decoration-[var(--ink-40)] underline-offset-4">blog</span>.
				Emphasis is <Mark>an inverted block</Mark> — no hue at all.
			</p>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="T3"
		group="tokens"
		title="Hierarchy by case + tracking, not size or weight"
		why="Reference keeps one weight and 4 sizes; hierarchy comes from UPPERCASE + 0.08em tracking on labels. Current renderer uses font-semibold on h1–h6 with near-identical sizes, so headings read as noise."
		{ink}
	>
		{#snippet before()}
			<div class="text-sm">
				<h1 class="mt-0 mb-2 text-3xl font-semibold">The Evolution Harness</h1>
				<h2 class="mt-4 mb-2 text-2xl font-semibold">What this is</h2>
				<h3 class="mt-4 mb-2 text-xl font-semibold">How to read it</h3>
			</div>
		{/snippet}
		{#snippet after()}
			<div class="flex flex-col gap-3">
				<MicroLabel>Rivers of Empire</MicroLabel>
				<h1 class="atlas-display">The Evolution Harness</h1>
				<MicroLabel>What this is</MicroLabel>
				<p>Body sits at 13px / 1.55 with a single weight.</p>
				<MicroLabel>How to read it</MicroLabel>
			</div>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="T4"
		group="tokens"
		title="Hairlines: 1px solid + dashed = latent"
		why="Reference separates every cell with a 1px ink@25% rule and uses dashed for latent/not-wired things. Current site mixes 0.5px borders, border-foreground/25, gray-600 dashed and a !important layer that flattens radius and shadow."
		{ink}
	>
		{#snippet before()}
			<div class="text-sm">
				<div class="border-foreground/25 border-[0.5px] p-3">border-foreground/25 at 0.5px</div>
				<HorizontalDivider />
				<div class="border border-dashed border-gray-600 p-3">hardcoded gray-600 dashed</div>
			</div>
		{/snippet}
		{#snippet after()}
			<div class="flex flex-col gap-3">
				<div class="atlas-hair p-3">solid — wired</div>
				<Rule />
				<div class="atlas-hair-dashed p-3">dashed — latent / not switched on</div>
				<div class="flex items-stretch gap-3">
					<span>vertical</span>
					<Rule orientation="vertical" />
					<span>separator</span>
				</div>
			</div>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="T5"
		group="tokens"
		title="Texture instead of colour: hatch + grid"
		why="Reference differentiates surfaces with a 45° hatch and a faint grid rather than tints. Nothing like this exists today."
		{ink}
	>
		{#snippet before()}
			<div class="bg-muted h-32 w-full p-3 text-sm">flat muted fill</div>
		{/snippet}
		{#snippet after()}
			<GridBackdrop class="atlas-hair flex h-32 items-end gap-3 p-3">
				<Hatch class="h-16 w-24" />
				<Hatch class="h-24 w-16" />
				<div class="atlas-hair-dashed h-10 w-20"></div>
			</GridBackdrop>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="T6"
		group="tokens"
		title="Motion: instant, inversion only"
		why="Reference has no transitions — state changes by inverting. Current site animates underlines over 0.3s and scales thumbnails/avatar on hover."
		{ink}
	>
		{#snippet before()}
			<div class="flex items-center gap-4 text-sm">
				<img
					src="/avatar.avif"
					alt=""
					width="32"
					height="32"
					class="size-8 rounded-full border object-cover transition-all duration-300 hover:scale-105"
				/>
				<a href="/blog">hover me — underline grows over 0.3s</a>
			</div>
		{/snippet}
		{#snippet after()}
			<div class="flex flex-col gap-2">
				<div class="atlas-hair atlas-invert w-fit px-3 py-1.5">hover me — instant inversion</div>
				<MicroLabel>transition: none</MicroLabel>
			</div>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="T7"
		group="tokens"
		title="Density on a 4px grid"
		why="Reference is dense: 8/12/16 padding, 1.15 leading on labels. Current --spacing is 0.2rem (off-grid) while cards use p-6 and prose leading-7."
		{ink}
	>
		{#snippet before()}
			<div class="text-sm">
				<div class="border-foreground/25 border-[0.5px] p-6">p-6, leading-7, --spacing: 0.2rem</div>
			</div>
		{/snippet}
		{#snippet after()}
			<div class="flex flex-col gap-1">
				{#each ['Strategy Archive', 'Parent Selection', 'Doctrine Writers'] as row, i (row)}
					<div class="atlas-hair flex items-center gap-2 px-2 py-1.5">
						<KeySlot code={['P', 'S', 'D'][i]} />
						<span class="atlas-row grow">{row}</span>
						<Count value={i + 1} />
					</div>
				{/each}
				<MicroLabel>--step: 0.25rem · padding 8/12 · leading 1.15</MicroLabel>
			</div>
		{/snippet}
	</ReviewItem>

	<!-- ============================ ATOMIC ============================ -->
	<h2 class="mt-8 text-sm tracking-widest uppercase">2 &middot; Atomic — primitives</h2>

	<ReviewItem
		id="A1"
		group="primitives"
		title="MicroLabel + StatCell"
		why="The uppercase micro-label is the backbone of the reference UI; stat cells pair it with a value. Closest thing today is small muted text and the navbar clock."
		{ink}
	>
		{#snippet before()}
			<div class="flex items-center gap-4 text-sm">
				<p class="text-muted-foreground text-xs">January 1, 2023</p>
				<p class="min-w-20 tabular-nums">03:22:41</p>
			</div>
		{/snippet}
		{#snippet after()}
			<div class="flex items-stretch gap-3">
				<StatCell label="Runs" value="18 · 8 in era 4" />
				<Rule orientation="vertical" />
				<StatCell label="Games on record" value="41,340" />
				<Rule orientation="vertical" />
				<StatCell label="Local time" value="03:22:41" />
			</div>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="A2"
		group="primitives"
		title="KeySlot + Count gutter"
		why="Every index row in the reference carries a short code on the left and a count on the right. The site has no such addressing vocabulary — lists are bullets."
		{ink}
	>
		{#snippet before()}
			<ul class="ml-6 list-outside list-disc text-sm">
				<li>Design</li>
				<li>Engineer</li>
				<li>Blog</li>
			</ul>
		{/snippet}
		{#snippet after()}
			<div class="flex flex-col gap-1">
				{#each [['D', 'Design', 8], ['E', 'Engineer', 4], ['B', 'Blog', 12]] as row (row[1])}
					<div class="atlas-hair flex items-center gap-2 px-2 py-1.5">
						<KeySlot code={String(row[0])} />
						<span class="atlas-row grow">{row[1]}</span>
						<Count value={Number(row[2])} />
					</div>
				{/each}
			</div>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="A3"
		group="primitives"
		title="Tab pair + Action command"
		why="Reference tabs invert fully when active; actions are bracketed all-caps command boxes. Today these are bits-ui buttons/selects with rounded bases defeated by an !important override layer."
		{ink}
	>
		{#snippet before()}
			<div class="flex flex-wrap items-center gap-2">
				<Button variant="default" size="sm">What it does</Button>
				<Button variant="outline" size="sm">How it's built</Button>
				<Badge variant="outline">badge</Badge>
			</div>
		{/snippet}
		{#snippet after()}
			<div class="flex flex-col gap-3">
				<div class="atlas-hair flex">
					<Tab active>What it does</Tab>
					<Tab>How it's built</Tab>
				</div>
				<div class="flex flex-wrap gap-2">
					<Action>Resume the flow</Action>
					<Action glyph="→">Trace one step</Action>
					<Action glyph="↺">Reset view</Action>
				</div>
			</div>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="A4"
		group="primitives"
		title="HintKey legend"
		why="Reference ends every screen with a glyph legend of available moves. The current footer is a quote plus copyright."
		{ink}
	>
		{#snippet before()}
			<p class="text-xs italic">"The best person ever to exist." — Urban Dictionary</p>
		{/snippet}
		{#snippet after()}
			<div class="flex flex-wrap gap-3">
				<HintKey glyph="→" label="Go inside" />
				<HintKey glyph="←" label="Come back out" />
				<HintKey glyph="↓↑" label="Move" />
				<HintKey glyph="·" label="Hover to read" />
			</div>
		{/snippet}
	</ReviewItem>

	<!-- ============================ MOLECULAR ============================ -->
	<h2 class="mt-8 text-sm tracking-widest uppercase">3 &middot; Molecular — assemblies</h2>

	<ReviewItem
		id="M1"
		group="assemblies"
		title="StatusBar replaces the navbar"
		why="Reference frames the page with a stat bar: repository cell, measured values, command group. The current navbar is avatar + slash-separated links + clock + theme toggle."
		stacked
		{ink}
	>
		{#snippet before()}
			<Navbar />
		{/snippet}
		{#snippet after()}
			<StatusBar
				title="quang.design"
				stats={[
					{ label: 'Design', value: '8 projects' },
					{ label: 'Blog', value: '12 posts' },
					{ label: 'Local time', value: '03:22:41' }
				]}
				actions={['Ink theme']}
			/>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="M2"
		group="assemblies"
		title="IndexTree replaces flat nav"
		why="Reference navigates through a grouped tree with codes and counts; nesting is indent only. Site nav is four inline links."
		{ink}
	>
		{#snippet before()}
			<nav class="flex items-center gap-4 text-sm">
				<a href="/">Quang</a><span class="text-muted-foreground">/</span>
				<a href="/design">Design</a><span class="text-muted-foreground">/</span>
				<a href="/engineer">Engineer</a><span class="text-muted-foreground">/</span>
				<a href="/blog">Blog</a>
			</nav>
		{/snippet}
		{#snippet after()}
			<IndexTree groups={treeGroups} />
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="M3"
		group="assemblies"
		title="IndexRow replaces the post card"
		why="Reference lists things as dense addressable rows. post-card.svelte is a bordered box with p-6, a square thumbnail and a scale-105 hover."
		{ink}
	>
		{#snippet before()}
			<div class="max-w-sm">
				<PostCard post={samplePost} hrefPrefix="/design" />
			</div>
		{/snippet}
		{#snippet after()}
			<div class="flex flex-col gap-1">
				<IndexRow
					code="D1"
					title="Doppio Kaffè"
					date="2023-01-01"
					description="Five years of brand character for a Hanoi coffee shop."
				/>
				<IndexRow
					code="D2"
					title="Wedding Invitation"
					date="2023-01-01"
					description="Typographic care for six years of love and commitment."
				/>
				<IndexRow code="D3" title="Dream Sweets" date="2022-11-04" />
			</div>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="M4"
		group="assemblies"
		title="ReadingPane replaces prose columns"
		why="Reference reading column is eyebrow → display title → subtitle → labelled sections, with marks for emphasis. Home is currently three markdown columns with semibold headings."
		stacked
		{ink}
	>
		{#snippet before()}
			<div class="prose max-w-none text-sm">
				<Markdown md={homeMd} />
			</div>
		{/snippet}
		{#snippet after()}
			<ReadingPane
				class="atlas-hair"
				tabs={['What it does', "How it's built"]}
				eyebrow="Quang Nguyen"
				title="Design Engineer"
				subtitle="how a brand gets designed, built and shipped"
				sections={[
					{ label: 'What this is', body: whatThisIs },
					{ label: 'Work', body: work }
				]}
			/>
			{#snippet whatThisIs()}
				<p>
					A Vietnamese graphic designer who <Mark>builds the things he designs</Mark>. Brand
					systems, naming, story — then the site that carries them.
				</p>
			{/snippet}
			{#snippet work()}
				<div class="flex flex-col gap-1">
					<IndexRow code="01" title="Design Director @FlexOS" date="2023 — now" />
					<IndexRow code="02" title="Design Manager @FlexOS" date="2022 — 2023" />
				</div>
			{/snippet}
		{/snippet}
	</ReviewItem>

	<!-- ============================ TEMPLATE ============================ -->
	<h2 class="mt-8 text-sm tracking-widest uppercase">4 &middot; Template — full page shell</h2>

	<ReviewItem
		id="P1"
		group="pages"
		title="Four-zone shell (status / index / canvas / reading / hints)"
		why="This is the whole reference layout applied to the site: StatusBar on top, IndexTree left, canvas centre, ReadingPane right, HintBar bottom. Compare with the current centered max-w-7xl column."
		stacked
		{ink}
	>
		{#snippet before()}
			<div class="border-foreground/25 flex flex-col border-[0.5px]">
				<Navbar />
				<div class="grid grid-cols-1 gap-6 p-3 text-sm md:grid-cols-3">
					<div class="prose max-w-none"><Markdown md={homeMd} /></div>
					<div class="prose max-w-none"><Markdown md={homeMd} /></div>
					<div class="prose max-w-none"><Markdown md={homeMd} /></div>
				</div>
			</div>
		{/snippet}
		{#snippet after()}
			<div class="atlas-hair flex flex-col">
				<StatusBar
					title="quang.design · portfolio"
					stats={[
						{ label: 'Design', value: '8' },
						{ label: 'Engineer', value: '4' },
						{ label: 'Blog', value: '12' },
						{ label: 'Local time', value: '03:22:41' }
					]}
					actions={['Ink theme']}
				/>
				<div class="grid grid-cols-1 md:grid-cols-[13rem_1fr_20rem]">
					<IndexTree groups={treeGroups} class="atlas-hair border-y-0 border-l-0" />
					<GridBackdrop class="flex min-h-64 items-end gap-4 p-4">
						<Hatch class="h-24 w-32" />
						<Hatch class="h-32 w-24" />
						<Hatch class="h-16 w-40" />
						<div class="atlas-hair-dashed h-12 w-24"></div>
					</GridBackdrop>
					<ReadingPane
						class="atlas-hair border-y-0 border-r-0"
						tabs={['What it does', "How it's built"]}
						eyebrow="Quang Nguyen"
						title="Design Engineer"
						subtitle="brand systems, built end to end"
						sections={[{ label: 'What this is', body: shellBody }]}
					/>
					{#snippet shellBody()}
						<p>
							Every page is one <Mark>index</Mark> plus one reading column. Hover anything for a plain
							description; the tab gives the implementation.
						</p>
					{/snippet}
				</div>
				<Rule />
				<HintBar
					hints={[
						{ glyph: '→', label: 'Go inside' },
						{ glyph: '←', label: 'Come back out' },
						{ glyph: '↓↑', label: 'Move' },
						{ glyph: '·', label: 'Hover to read' }
					]}
				/>
			</div>
		{/snippet}
	</ReviewItem>

	<details class="border-foreground/25 mt-8 border-[0.5px] p-3 text-xs">
		<summary class="cursor-pointer tracking-widest uppercase"
			>Review summary (paste to Devin)</summary
		>
		<pre class="mt-3 whitespace-pre-wrap">{review.summary}</pre>
	</details>
</div>
