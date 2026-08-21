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
		HintKey,
		GridBackdrop
	} from '$lib/components/primitives';
	import { StatusBar, IndexTree, ReadingPane, IndexRow } from '$lib/components/atlas';
	import ReviewItem from './review-item.svelte';
	import { review } from './review.svelte';
	import LiveFrame from './live-frame.svelte';
	import PreviewScreen from './preview-screen.svelte';
	import type { EngineerProject } from '$lib/content/engineer';
	import type { PostMetadata } from '$lib/content/loader';

	let {
		data
	}: { data: { design: PostMetadata[]; blog: PostMetadata[]; engineer: EngineerProject[] } } =
		$props();

	let ink = $state(false);
	let copied = $state(false);

	let now = $state(new Date());
	$effect(() => {
		const id = setInterval(() => (now = new Date()), 1000);
		return () => clearInterval(id);
	});

	const localTime = $derived(
		new Intl.DateTimeFormat('en-GB', {
			timeZone: 'Asia/Ho_Chi_Minh',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		}).format(now)
	);
	const place = 'Nha Trang, Vietnam';

	const samplePost = {
		slug: 'doppio-kaffe',
		title: "5 Years of Crafting Doppio Kaffè's Cozy Character",
		description:
			"As a designer and loyal patron, it's been my privilege to help shape the branding for Doppio Kaffè over the past 5 years.",
		thumbnail: '/design/posts/doppio/doppio_1.avif',
		date: '2023-01-01'
	};

	const treeGroups = $derived([
		{
			label: 'Index',
			rows: [
				{ code: 'Q', label: 'Quang' },
				{ code: 'D', label: 'Design', count: data.design.length },
				{ code: 'E', label: 'Engineer', count: data.engineer.length },
				{ code: 'E1', label: 'Telescopic Text', nested: true },
				{ code: 'E2', label: 'Microscopic Text', nested: true },
				{ code: 'E3', label: 'Animation Vocabulary', nested: true },
				{ code: 'E4', label: 'Minesweeper', nested: true },
				{ code: 'B', label: 'Blog', count: data.blog.length }
			]
		},
		{
			label: 'Reference',
			rows: [{ code: 'S', label: 'Styles' }]
		}
	]);

	const homeMd = `## Xin Chào!

My name is Quang – a Vietnamese Graphic Designer skilled at crafting **impactful brand identities**.

- Design Director @FlexOS
- Design Manager @FlexOS`;

	const typeScale = [
		{ token: '--fs-micro', px: '10', use: 'labels, counts', sample: 'LOCATION' },
		{
			token: '--fs-row',
			px: '11',
			use: 'captions, descriptions',
			sample: 'Five years of brand character.'
		},
		{ token: '--fs-body', px: '12', use: 'UI body, row titles, dates', sample: 'Design Engineer' },
		{
			token: '--fs-read',
			px: '13',
			use: 'long-form prose only',
			sample: 'A Vietnamese graphic designer who builds the things he designs.'
		},
		{ token: '--fs-display', px: '20', use: 'page titles', sample: 'The Evolution Harness' }
	];

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
		<nav
			class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs tracking-widest uppercase"
		>
			<a href="#tokens">Tokens</a>
			<span>/</span>
			<a href="#primitives">Primitives</a>
			<span>/</span>
			<a href="#assemblies">Assemblies</a>
			<span>/</span>
			<a href="#screens">Screens</a>
		</nav>
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
		Throwaway route. Left column is the current site (live iframe on screens), right column is Atlas
		(tokens scoped to <code>.atlas</code>). Approve or mark revise, add notes, then “Copy review”.
	</p>

	<h2 id="tokens" class="mt-4 text-sm tracking-widest uppercase">1 · Sub-atomic — tokens</h2>

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
		why="UI body is 12px (Tailwind text-xs). Labels 10, captions 11, prose 13, titles 20 — a 1.2 modular scale at one weight. Hierarchy is UPPERCASE + 0.08em tracking. Global heading sizes and leading-7 are reset inside .atlas so they cannot leak."
		{ink}
	>
		{#snippet before()}
			<div class="text-sm">
				<h1 class="mt-0 mb-2 text-3xl font-semibold">The Evolution Harness</h1>
				<h2 class="mt-4 mb-2 text-2xl font-semibold">What this is</h2>
				<h3 class="mt-4 mb-2 text-xl font-semibold">How to read it</h3>
				<p class="leading-7">
					Body today is ~13.6px / leading-7, with semibold headings a few pixels apart.
				</p>
			</div>
		{/snippet}
		{#snippet after()}
			<div class="flex flex-col gap-3">
				<div class="atlas-stack flex flex-col">
					{#each typeScale as row (row.token)}
						<div class="flex items-baseline gap-3 px-2 py-1.5">
							<code class="atlas-label w-28 shrink-0">{row.token}</code>
							<span class="atlas-label w-8 shrink-0">{row.px}</span>
							<span class="atlas-row-desc grow">{row.use}</span>
						</div>
					{/each}
				</div>
				<MicroLabel>Rivers of Empire</MicroLabel>
				<h1 class="atlas-display">The Evolution Harness</h1>
				<p>UI body is 12px / 1.45 — one weight, case and tracking do the rest.</p>
				<p class="atlas-read">
					Prose steps up to 13px / 1.55 so long-form reading stays comfortable while chrome stays
					dense.
				</p>
			</div>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="T4"
		group="tokens"
		title="Hairlines: 0.5px solid, dashed = latent, double = emphasis"
		why="Every rule is 0.5px (--hair). Emphasis is a second hairline inset 2px (atlas-hair-double), never a thicker stroke. Stacked and side-by-side groups draw the outer frame once and share internal rules, so two lines never sit next to each other."
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
				<div class="atlas-hair p-3">0.5px solid — wired</div>
				<div class="atlas-hair-dashed p-3">0.5px dashed — latent / not switched on</div>
				<div class="atlas-hair-double p-3">double hairline — emphasis, 2px paper gap</div>
				<MicroLabel>Stacked cells share one rule</MicroLabel>
				<div class="atlas-stack flex flex-col">
					<div class="px-3 py-1.5">row one</div>
					<div class="px-3 py-1.5">row two</div>
					<div class="px-3 py-1.5">row three</div>
				</div>
				<div class="atlas-stack-x flex">
					<div class="grow px-3 py-1.5">cell</div>
					<div class="grow px-3 py-1.5">cell</div>
					<div class="grow px-3 py-1.5">cell</div>
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
				<Hatch class="atlas-hair h-16 w-24" />
				<Hatch class="atlas-hair h-24 w-16" />
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
			<div class="atlas-stack flex flex-col">
				{#each ['Strategy Archive', 'Parent Selection', 'Doctrine Writers'] as row, i (row)}
					<div class="flex items-center gap-2 px-2 py-1.5">
						<KeySlot code={['P', 'S', 'D'][i]} />
						<span class="atlas-row grow">{row}</span>
						<Count value={i + 1} />
					</div>
				{/each}
			</div>
			<MicroLabel class="pt-2">--step: 0.25rem · padding 8/12 · leading 1.15</MicroLabel>
		{/snippet}
	</ReviewItem>

	<h2 id="primitives" class="mt-8 text-sm tracking-widest uppercase">2 · Atomic — primitives</h2>

	<ReviewItem
		id="A1"
		group="primitives"
		title="MicroLabel + StatCell"
		why="The stat group is location / country / live local time (Asia/Ho_Chi_Minh) — the measured facts the site actually has. Closest thing today is small muted text and the navbar clock."
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
				<StatCell label="Location" value="Nha Trang" />
				<Rule orientation="vertical" />
				<StatCell label="Country" value="Vietnam" />
				<Rule orientation="vertical" />
				<StatCell label="Local time" value={localTime} />
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
			<div class="atlas-stack flex flex-col">
				{#each [['D', 'Design', data.design.length], ['E', 'Engineer', data.engineer.length], ['B', 'Blog', data.blog.length]] as row (row[1])}
					<div class="flex items-center gap-2 px-2 py-1.5">
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

	<h2 id="assemblies" class="mt-8 text-sm tracking-widest uppercase">3 · Molecular — assemblies</h2>

	<ReviewItem
		id="M1"
		group="assemblies"
		title="StatusBar replaces the navbar"
		why="Reference frames the page with a stat bar: repository cell, location, country, live local time, command group. The current navbar is avatar + slash-separated links + clock + theme toggle."
		stacked
		{ink}
	>
		{#snippet before()}
			<Navbar />
		{/snippet}
		{#snippet after()}
			<div class="atlas-hair">
				<StatusBar
					title="quang.design"
					stats={[
						{ label: 'Location', value: 'Nha Trang' },
						{ label: 'Country', value: 'Vietnam' },
						{ label: place, value: localTime }
					]}
					actions={['Ink theme']}
				/>
			</div>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="M2"
		group="assemblies"
		title="IndexTree replaces flat nav"
		why="Reference navigates through a grouped tree with codes and counts; nesting is indent only so every rule stays on one line. Telescopic / microscopic / animation vocabulary / minesweeper sit under Engineer."
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
			<div class="atlas-hair">
				<IndexTree groups={treeGroups} active="E1" />
			</div>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="M3"
		group="assemblies"
		title="IndexRow replaces the post card"
		why="Rows carry a thumbnail, the date matches the title size (12px) and the description drops one step (11px). Two orders are shown — title first and description first — pick one. post-card.svelte is a bordered box with p-6 and a scale-105 hover."
		{ink}
	>
		{#snippet before()}
			<div class="max-w-sm">
				<PostCard post={samplePost} hrefPrefix="/design" />
			</div>
		{/snippet}
		{#snippet after()}
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-1">
					<MicroLabel>Option A — title, then description</MicroLabel>
					<div class="atlas-stack flex flex-col">
						<IndexRow
							code="D1"
							thumbnail="/design/posts/doppio/doppio_1.avif"
							title="Doppio Kaffè"
							date="2023-01-01"
							description="Five years of brand character for a coffee shop."
						/>
						<IndexRow
							code="D2"
							thumbnail="/design/posts/wedding/logo.avif"
							title="Wedding Invitation"
							date="2023-01-01"
							description="Typographic care for six years of love and commitment."
						/>
						<IndexRow placeholder code="D3" title="Dream Sweets" date="2022-11-04" />
					</div>
				</div>
				<div class="flex flex-col gap-1">
					<MicroLabel>Option B — description, then title</MicroLabel>
					<div class="atlas-stack flex flex-col">
						<IndexRow
							reverse
							code="D1"
							thumbnail="/design/posts/doppio/doppio_1.avif"
							title="Doppio Kaffè"
							date="2023-01-01"
							description="Five years of brand character for a coffee shop."
						/>
						<IndexRow
							reverse
							code="D2"
							thumbnail="/design/posts/wedding/logo.avif"
							title="Wedding Invitation"
							date="2023-01-01"
							description="Typographic care for six years of love and commitment."
						/>
						<IndexRow reverse placeholder code="D3" title="Dream Sweets" date="2022-11-04" />
					</div>
				</div>
			</div>
		{/snippet}
	</ReviewItem>

	{#snippet whatThisIs()}
		<p>
			A Vietnamese graphic designer who <Mark>builds the things he designs</Mark>. Brand systems,
			naming, story — then the site that carries them.
		</p>
	{/snippet}
	{#snippet work()}
		<div class="atlas-stack flex flex-col">
			<IndexRow code="01" title="Design Director @FlexOS" date="2023 — now" />
			<IndexRow code="02" title="Design Manager @FlexOS" date="2022 — 2023" />
		</div>
	{/snippet}

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
			<div class="atlas-hair">
				<ReadingPane
					tabs={['What it does', "How it's built"]}
					eyebrow="Quang Nguyen"
					title="Design Engineer"
					subtitle="how a brand gets designed, built and shipped"
					sections={[
						{ label: 'What this is', body: whatThisIs },
						{ label: 'Work', body: work }
					]}
				/>
			</div>
		{/snippet}
	</ReviewItem>

	<h2 id="screens" class="mt-8 text-sm tracking-widest uppercase">
		4 · Screens — live site vs atlas
	</h2>

	<p class="text-muted-foreground max-w-3xl text-xs">
		Each card is a real route on the left and the same page composed in the four-zone shell on the
		right. The shell owns the outer double hairline and the column rules; zones never draw a second
		line on a shared edge.
	</p>

	<ReviewItem
		id="P1"
		group="pages"
		title="Home — four-zone shell"
		why="Status / index / canvas / reading / hints. Telescopic sits under Engineer. Body is 12px, prose 13px, every rule 0.5px, double frame for the page. Compare with the current centered max-w-7xl column."
		stacked
		{ink}
	>
		{#snippet before()}
			<LiveFrame src="/" title="Current home" />
		{/snippet}
		{#snippet after()}
			<PreviewScreen
				screen="home"
				{localTime}
				groups={treeGroups}
				design={data.design}
				blog={data.blog}
				engineer={data.engineer}
			/>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="P2"
		group="pages"
		title="Design index"
		why="The design grid of PostCards becomes IndexRows with thumbnails. Date matches title size; description is one step down."
		stacked
		{ink}
	>
		{#snippet before()}
			<LiveFrame src="/design" title="Current design index" />
		{/snippet}
		{#snippet after()}
			<PreviewScreen
				screen="design"
				{localTime}
				groups={treeGroups}
				design={data.design}
				blog={data.blog}
				engineer={data.engineer}
			/>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="P3"
		group="pages"
		title="Design project — Doppio Kaffè"
		why="Gallery lives on the canvas as a flush image grid; the reading column holds title, story and meta. No extra frame around the images — the shell column is the only vertical rule."
		stacked
		{ink}
	>
		{#snippet before()}
			<LiveFrame src="/design/doppio" title="Current Doppio project" />
		{/snippet}
		{#snippet after()}
			<PreviewScreen
				screen="project"
				{localTime}
				groups={treeGroups}
				design={data.design}
				blog={data.blog}
				engineer={data.engineer}
			/>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="P4"
		group="pages"
		title="Engineer index"
		why="Project cards become IndexRows. Nested tools stay in the tree under Engineer so the page structure matches the real routes."
		stacked
		{ink}
	>
		{#snippet before()}
			<LiveFrame src="/engineer" title="Current engineer index" />
		{/snippet}
		{#snippet after()}
			<PreviewScreen
				screen="engineer"
				{localTime}
				groups={treeGroups}
				design={data.design}
				blog={data.blog}
				engineer={data.engineer}
			/>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="P5"
		group="pages"
		title="Telescopic Text"
		why="The tool sits on the canvas, under Engineer in the tree (E1). Instructions stay in the reading column so the sentence has room to grow."
		stacked
		{ink}
	>
		{#snippet before()}
			<LiveFrame src="/engineer/telescopic" title="Current telescopic text" />
		{/snippet}
		{#snippet after()}
			<PreviewScreen
				screen="telescopic"
				{localTime}
				groups={treeGroups}
				design={data.design}
				blog={data.blog}
				engineer={data.engineer}
			/>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="P6"
		group="pages"
		title="Blog index"
		why="Post cards collapse to IndexRows with thumbnails. Same row language as Design, different code prefix."
		stacked
		{ink}
	>
		{#snippet before()}
			<LiveFrame src="/blog" title="Current blog index" />
		{/snippet}
		{#snippet after()}
			<PreviewScreen
				screen="blog"
				{localTime}
				groups={treeGroups}
				design={data.design}
				blog={data.blog}
				engineer={data.engineer}
			/>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="P7"
		group="pages"
		title="Blog post"
		why="Thumbnail on the canvas, opening on the reading column. Date sits in the eyebrow at body size, not as a tiny caption."
		stacked
		{ink}
	>
		{#snippet before()}
			<LiveFrame src="/blog/posts/this-design-look-sad" title="Current blog post" />
		{/snippet}
		{#snippet after()}
			<PreviewScreen
				screen="post"
				{localTime}
				groups={treeGroups}
				design={data.design}
				blog={data.blog}
				engineer={data.engineer}
			/>
		{/snippet}
	</ReviewItem>

	<ReviewItem
		id="P8"
		group="pages"
		title="Minesweeper"
		why="The board is the canvas. Cells share 0.5px gaps (the gap is the rule, not a second border). Mines are hatch, numbers are labels, empty stays paper."
		stacked
		{ink}
	>
		{#snippet before()}
			<LiveFrame src="/engineer/minesweeper" title="Current minesweeper" />
		{/snippet}
		{#snippet after()}
			<PreviewScreen
				screen="minesweeper"
				{localTime}
				groups={treeGroups}
				design={data.design}
				blog={data.blog}
				engineer={data.engineer}
			/>
		{/snippet}
	</ReviewItem>

	<details class="border-foreground/25 mt-8 border-[0.5px] p-3 text-xs">
		<summary class="cursor-pointer tracking-widest uppercase">Review summary</summary>
		<pre class="mt-3 whitespace-pre-wrap">{review.summary}</pre>
	</details>
</div>
