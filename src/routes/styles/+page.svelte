<script lang="ts">
	import { Markdown } from '$lib/components/markdown';

	let activeStyle = $state<'current' | 'tufte' | 'typography'>('current');

	const md = `
# Typography Comparison

## The purpose of good typography

Edward Tufte uses a distinctive style in his handouts: simple, with well-set typography, extensive sidenotes, and tight integration of graphics and charts. Good typography is about making content readable and beautiful.

In the words of Tufte himself: "The purpose of an information display is to assist thinking about its content." This principle applies equally to web typography — every design choice should serve the reader's comprehension.

## Lists

### Unordered List
- Typography is the craft of endowing human language with a durable visual form
- Good typography is measured by how well it reinforces the meaning of the text
- The best typography is invisible — it lets the content speak

### Ordered List
1. First, establish a clear hierarchy
2. Second, choose typefaces that complement the content
3. Third, set appropriate line lengths and spacing

## Code Blocks

Inline \`code\` example within a sentence.

\`\`\`javascript
// Code block example
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Blockquotes

> "The minimum we should hope for with any display technology is that it should do no harm." — Edward Tufte

## Links

[Edward Tufte's website](https://www.edwardtufte.com) is a masterclass in information design.

## Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Images

![Placeholder](https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_120x44dp.png)
`;
</script>

<div class="mx-auto w-full max-w-3xl p-4">
	<h1 class="mb-2 text-2xl font-bold">Typography Style Comparison</h1>
	<p class="text-foreground/60 mb-6 text-sm">
		Compare how content looks across different typography approaches.
	</p>

	<div class="mb-8 flex gap-2">
		<button
			class="border px-3 py-1 text-sm {activeStyle === 'current'
				? 'bg-foreground text-background'
				: 'bg-background text-foreground'}"
			onclick={() => (activeStyle = 'current')}
		>
			Current
		</button>
		<button
			class="border px-3 py-1 text-sm {activeStyle === 'tufte'
				? 'bg-foreground text-background'
				: 'bg-background text-foreground'}"
			onclick={() => (activeStyle = 'tufte')}
		>
			Tufte CSS
		</button>
		<button
			class="border px-3 py-1 text-sm {activeStyle === 'typography'
				? 'bg-foreground text-background'
				: 'bg-background text-foreground'}"
			onclick={() => (activeStyle = 'typography')}
		>
			Tailwind Typography
		</button>
	</div>

	{#if activeStyle === 'current'}
		<div>
			<Markdown {md} />
		</div>
	{:else if activeStyle === 'tufte'}
		<div class="tufte">
			<Markdown {md} />
		</div>
	{:else}
		<div class="prose dark:prose-invert max-w-none">
			<Markdown {md} />
		</div>
	{/if}
</div>
