<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import {
		MicroLabel,
		Mark,
		KeySlot,
		Count,
		Tab,
		Action,
		HintKey,
		StatCell,
		Rule,
		Hatch
	} from '$lib/components/primitives';
	import { navLinks } from '$lib/config/nav';
</script>

<h2 id="atoms" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">3 · Atoms</h2>
<p class="atlas-row-desc max-w-3xl">
	shadcn-svelte <code>ui/</code>: Svelte 5 runes, <code>data-slot</code>, OKLCH, Tailwind v4,
	<code>tv()</code> variants. Real components inside <code>.atlas</code> so tokens do the restyle. Atlas-only
	atoms sit beside them.
</p>

<ReviewItem
	id="A1"
	group="atoms"
	title="Button"
	why="ui/button — hairline, uppercase, instant invert. Default maps to ink/paper via --primary. Action is the Atlas-native variant."
>
	{#snippet children()}
		<div class="flex flex-col gap-3">
			<div class="flex flex-wrap items-center gap-2">
				<Button>Default</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
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
	id="A2"
	group="atoms"
	title="Input + Textarea"
	why="Subscribe and forms. Atlas: 0.5px hair, no radius, hairline focus outline."
>
	{#snippet children()}
		<div class="flex max-w-sm flex-col gap-2">
			<MicroLabel>Email</MicroLabel>
			<Input type="email" placeholder="Enter your email" />
			<MicroLabel>Note</MicroLabel>
			<Textarea placeholder="What to change…" rows={2}></Textarea>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="A3"
	group="atoms"
	title="Badge + Kbd"
	why="Blog post llms.txt / post.md badges. HintKey is the Atlas analog to Kbd."
>
	{#snippet children()}
		<div class="flex flex-wrap items-center gap-3">
			<Badge variant="outline">llms.txt</Badge>
			<Badge variant="outline">post.md</Badge>
			<HintKey glyph="⌘K" label="Command" />
			<HintKey glyph="→" label="Go inside" />
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="A4"
	group="atoms"
	title="Avatar + Separator + Spinner"
	why="Navbar avatar. Atlas: square hair, 0.5px rule, spinner static."
>
	{#snippet children()}
		<div class="flex items-center gap-3">
			<img
				src="/avatar.avif"
				alt=""
				width="32"
				height="32"
				class="atlas-hair size-8 object-cover"
			/>
			<Rule orientation="vertical" />
			<Spinner />
			<Hatch class="atlas-hair size-4" />
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="A5"
	group="atoms"
	title="Select"
	why="Mobile navbar. Atlas restyles the trigger; preview disables the portal so tokens reach the menu. Desktop nav is IndexTree."
>
	{#snippet children()}
		<div class="flex flex-col gap-2">
			<Select.Root type="single" value="/">
				<Select.Trigger>
					{navLinks[0].label}
				</Select.Trigger>
				<Select.Content portalProps={{ disabled: true }}>
					<Select.Group>
						{#each navLinks as item (item.href)}
							<Select.Item value={item.href} label={item.label}>{item.label}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<MicroLabel>Desktop uses the index tree instead</MicroLabel>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="A6"
	group="atoms"
	title="Label, Mark, Tab, KeySlot, Count"
	why="Atlas atoms with no shadcn twin. Mark is inversion, not hue. Tabs invert when active."
>
	{#snippet children()}
		<div class="flex flex-col gap-3">
			<div class="flex flex-wrap items-stretch gap-3">
				<StatCell label="Location" value="Nha Trang" />
				<Rule orientation="vertical" />
				<StatCell label="Country" value="Vietnam" />
			</div>
			<p>Emphasis is <Mark>an inverted block</Mark>.</p>
			<div class="atlas-hair flex">
				<Tab active>What it does</Tab>
				<Tab>How it's built</Tab>
			</div>
			<div class="atlas-stack">
				<div class="flex items-center gap-2 px-2 py-1.5">
					<KeySlot code="D" />
					<span class="atlas-row grow">Design</span>
					<Count value={17} />
				</div>
				<div class="flex items-center gap-2 px-2 py-1.5">
					<KeySlot code="E" />
					<span class="atlas-row grow">Engineer</span>
					<Count value={6} />
				</div>
			</div>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="A7"
	group="atoms"
	title="Sonner toast"
	why="ui/sonner uses lucide status icons and a spinning loader. Atlas: inverted Mark, no hue, no spin."
>
	{#snippet children()}
		<div class="atlas-mark w-fit px-3 py-2">
			<MicroLabel class="text-[var(--paper)]">Notice</MicroLabel>
			<p>Subscribed.</p>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="A8"
	group="atoms"
	title="Theme toggle"
	why="Atlas paper/ink is a single invert — Action, no rotate, no scale."
>
	{#snippet children()}
		<Action>Subscribe</Action>
	{/snippet}
</ReviewItem>
