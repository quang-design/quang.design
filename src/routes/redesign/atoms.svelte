<script lang="ts">
	import ReviewItem from './review-item.svelte';
	import { toast } from 'svelte-sonner';
	import { toggleMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Kbd } from '$lib/components/ui/kbd/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import {
		MicroLabel,
		Mark,
		KeySlot,
		Count,
		Action,
		HintKey,
		StatCell,
		Rule
	} from '$lib/components/primitives';
	import { ReadingPane } from '$lib/components/layout';
	import { IndexTree } from '$lib/components/layout';
</script>

{#snippet tabWhat()}
	<p>Tab one. Click the other tab to switch.</p>
{/snippet}
{#snippet tabHow()}
	<p>Tab two. The reading pane keeps this switch in sync.</p>
{/snippet}

<h2 id="atoms" class="mt-8 scroll-mt-28 text-sm tracking-widest uppercase">3 · Atoms</h2>
<p class="text-muted-foreground max-w-3xl text-xs">
	Live <code>ui/</code> components. Ghost has no border. Spinner spins. Kbd is only for shortcuts.
	Select is not part of the site chrome.
</p>

<ReviewItem
	id="A1"
	group="atoms"
	title="Button"
	why="Hairline, uppercase, instant invert, cursor-pointer. Ghost has no border."
>
	{#snippet before()}
		<div class="flex flex-wrap items-center gap-2">
			<button class="rounded-lg border bg-black px-2.5 py-1 text-sm text-white">Default</button>
			<button class="rounded-lg border px-2.5 py-1 text-sm">Outline</button>
			<button class="rounded-lg border px-2.5 py-1 text-sm">Ghost</button>
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
				<Action glyph="↺">Reset view</Action>
			</div>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="A2"
	group="atoms"
	title="Input + Textarea"
	why="0.5px hair, no radius, hairline focus outline. Same height as buttons (h-8)."
>
	{#snippet before()}
		<div class="flex max-w-sm flex-col gap-2">
			<input class="h-8 rounded-lg border px-2.5" placeholder="Enter your email" />
			<textarea class="min-h-16 rounded-lg border px-2.5 py-2" placeholder="Note…" rows={2}></textarea>
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
	id="A3"
	group="atoms"
	title="Badge + Kbd"
	why="Square badge for llms.txt / post.md. Kbd is only a shortcut glyph — not navigation hints."
>
	{#snippet before()}
		<div class="flex flex-wrap items-center gap-2">
			<span class="rounded-full border px-2 py-0.5 text-xs">llms.txt</span>
			<span class="rounded-full border px-2 py-0.5 text-xs">post.md</span>
			<kbd class="rounded-sm bg-neutral-100 px-1">⌘</kbd>
		</div>
	{/snippet}
	{#snippet after()}
		<div class="flex flex-wrap items-center gap-3">
			<Badge variant="outline">llms.txt</Badge>
			<Badge variant="outline">post.md</Badge>
			<Kbd>⌘</Kbd>
			<Kbd>K</Kbd>
			<HintKey glyph="⌘K" label="Command" />
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="A4"
	group="atoms"
	title="Avatar + Separator + Spinner"
	why="Square hair avatar. 0.5px rule. Spinner spins — hatch is a texture, not a loading glyph."
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
			<img src="/avatar.avif" alt="" width="32" height="32" class="hair size-8 object-cover" />
			<Rule orientation="vertical" />
			<Spinner />
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="A5"
	group="atoms"
	title="Select"
	why="Select is not used on the live site. IndexTree is the navigation on every breakpoint."
>
	{#snippet before()}
		<select class="h-8 rounded-lg border px-2 text-sm">
			<option>Quang</option>
			<option>Design</option>
			<option>Engineer</option>
			<option>Blog</option>
		</select>
	{/snippet}
	{#snippet after()}
		<div class="hair">
			<IndexTree
				groups={[
					{
						label: 'Index',
						rows: [
							{ code: 'H', label: 'Home', href: '/' },
							{ code: 'D', label: 'Design', href: '/design', count: 17 },
							{ code: 'E', label: 'Engineer', href: '/engineer', count: 6 },
							{ code: 'B', label: 'Blog', href: '/blog', count: 3 }
						]
					}
				]}
				active="H"
			/>
		</div>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="A6"
	group="atoms"
	title="Label, Mark, Tab, KeySlot, Count"
	why="Tabs switch. Mark is inversion. KeySlot + Count address every index row."
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
			<div class="flex flex-wrap items-stretch gap-3">
				<StatCell label="Location" value="Nha Trang" />
				<Rule orientation="vertical" />
				<StatCell label="Country" value="Vietnam" />
			</div>
			<p>Emphasis is <Mark>an inverted block</Mark>.</p>
			<div class="hair">
				<ReadingPane
					tabs={['What it does', "How it's built"]}
					eyebrow="Tabs"
					title="Switch me"
					sections={[
						{ label: 'What it does', body: tabWhat },
						{ label: "How it's built", body: tabHow }
					]}
				/>
			</div>
			<div class="stack">
				<div class="flex items-center gap-2 px-2 py-1.5">
					<KeySlot code="D" />
					<span class="ink-row grow">Design</span>
					<Count value={17} />
				</div>
				<div class="flex items-center gap-2 px-2 py-1.5">
					<KeySlot code="E" />
					<span class="ink-row grow">Engineer</span>
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
	why="Subscribe still uses toasts, so the component stays. Restyled to ink/paper, no extra hue."
>
	{#snippet before()}
		<Button variant="outline" size="sm" onclick={() => toast.success('Subscribed.')}>
			Show toast
		</Button>
	{/snippet}
	{#snippet after()}
		<Button variant="outline" size="sm" onclick={() => toast.success('Subscribed.')}>
			Show toast
		</Button>
	{/snippet}
</ReviewItem>

<ReviewItem
	id="A8"
	group="atoms"
	title="Theme toggle"
	why="Original sun/moon control in the status bar. Keep the rotate/scale swap."
>
	{#snippet before()}
		<Button variant="outline" size="icon" onclick={toggleMode} class="cursor-pointer">
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	{/snippet}
	{#snippet after()}
		<Button variant="outline" size="icon" onclick={toggleMode} class="cursor-pointer">
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	{/snippet}
</ReviewItem>
