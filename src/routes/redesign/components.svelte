<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Kbd } from '$lib/components/ui/kbd/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
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

	let { ink = false }: { ink?: boolean } = $props();
</script>

<h2 id="components" class="mt-8 text-sm tracking-widest uppercase">
	2 · Components — atoms (shadcn ui + atlas)
</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	Latest shadcn-svelte: Svelte 5 runes, <code>data-slot</code>, OKLCH, Tailwind v4
	<code>@theme inline</code>, <code>tv()</code> variants. After panes render the real
	<code>ui/</code> components inside <code>.atlas</code> so tokens do the restyle. Atlas-only atoms sit
	beside them.
</p>

<ReviewItem
	id="C1"
	group="components"
	title="Button"
	why="ui/button — data-slot, tv variants, cursor default in latest shadcn. Atlas: hairline, uppercase, instant invert, cursor-pointer. Default maps to ink/paper via --primary."
	{ink}
>
	{#snippet before()}
		<div class="flex flex-wrap items-center gap-2">
			<Button>Default</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive" size="sm">Destructive</Button>
		</div>
	{/snippet}
	{#snippet after()}
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
	id="C2"
	group="components"
	title="Input + Textarea"
	why="Subscribe and forms. Latest: h-8, rounded-lg, ring-3. Atlas: 0.5px hair, no radius, hairline focus outline. Same components, token restyle."
	{ink}
>
	{#snippet before()}
		<div class="flex max-w-sm flex-col gap-2">
			<Input type="email" placeholder="Enter your email" />
			<Textarea placeholder="Note…" rows={2}></Textarea>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex max-w-sm flex-col gap-2">
			<MicroLabel>Email</MicroLabel>
			<Input type="email" placeholder="Enter your email" />
			<MicroLabel>Note</MicroLabel>
			<Textarea placeholder="What to change…" rows={2}></Textarea>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="C3"
	group="components"
	title="Badge + Kbd"
	why="Blog post llms.txt / post.md badges. Kbd is the closest shadcn analog to HintKey. Atlas drops the pill radius; kbd becomes a tracked label."
	{ink}
>
	{#snippet before()}
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outline">llms.txt</Badge>
			<Badge variant="outline">post.md</Badge>
			<Kbd>⌘</Kbd><Kbd>K</Kbd>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-wrap items-center gap-3">
			<Badge variant="outline">llms.txt</Badge>
			<Badge variant="outline">post.md</Badge>
			<HintKey glyph="⌘K" label="Command" />
			<HintKey glyph="→" label="Go inside" />
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="C4"
	group="components"
	title="Avatar + Separator + Spinner"
	why="Navbar avatar (round, scale on hover). Separator is 1px bg-border. Spinner spins. Atlas: square hair, 0.5px rule, spinner static."
	{ink}
>
	{#snippet before()}
		<div class="flex items-center gap-3">
			<Avatar.Root>
				<Avatar.Image src="/avatar.avif" alt="Quang" />
				<Avatar.Fallback>Q</Avatar.Fallback>
			</Avatar.Root>
			<Separator orientation="vertical" class="h-8" />
			<Spinner />
		</div>
	{/snippet}
	{#snippet after()}
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
	id="C5"
	group="components"
	title="Select"
	why="Mobile navbar. Latest select-trigger: rounded-lg, ring-3, chevron. Atlas restyles the trigger; desktop nav is IndexTree, not a select."
	{ink}
>
	{#snippet before()}
		<Select.Root type="single" value="/">
			<Select.Trigger>
				{navLinks[0].label}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each navLinks as item (item.href)}
						<Select.Item value={item.href} label={item.label}>{item.label}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-2">
			<Select.Root type="single" value="/">
				<Select.Trigger>
					{navLinks[0].label}
				</Select.Trigger>
				<Select.Content>
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
	id="C6"
	group="components"
	title="Label, Mark, Tab, KeySlot, Count"
	why="Atlas atoms with no shadcn twin. Mark is inversion (not hue). Tabs invert when active. KeySlot + Count address every index row."
	{ink}
>
	{#snippet before()}
		<p class="text-sm">
			<small class="text-muted-foreground">January 1, 2023</small>
			<strong class="font-semibold"> bold </strong>
			and a count in a sentence.
		</p>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-col gap-3">
			<div class="flex items-stretch gap-3">
				<StatCell label="Location" value="Nha Trang" />
				<Rule orientation="vertical" />
				<StatCell label="Country" value="Vietnam" />
			</div>
			<p>Emphasis is <Mark>an inverted block</Mark>.</p>
			<div class="atlas-hair flex">
				<Tab active>What it does</Tab>
				<Tab>How it's built</Tab>
			</div>
			<div class="atlas-stack flex flex-col">
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
