<script lang="ts">
	import { Markdown } from '$lib/components/markdown';
	import PagePreview from '$lib/components/layout/page-preview.svelte';

	const md = `
# Markdown Test Document

## Typography

Normal paragraph text with **bold**, *italic*, and ~~strikethrough~~ formatting.

## Lists

### Unordered List
- Item one
- Item two
- Item three

### Ordered List
1. First item
2. Second item
3. Third item

## Links and Images

[Link to Google](https://www.google.com)

## Code Blocks

Inline \`code\` example.

\`\`\`javascript
// Code block example
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

## Headings (H1-H6)

# This is an example of H1
## This is an example of H2
### This is an example of H3
#### This is an example of H4
##### This is an example of H5
###### This is an example of H6

## Links

[Link to Google](https://www.google.com)

## Images

![Alt Text](https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_120x44dp.png)

`;
</script>

<PagePreview
	value={{
		eyebrow: 'Reference · S',
		title: 'Styles',
		subtitle: 'Markdown specimen',
		description:
			'The live markdown renderer, restyled. Headings are labels. Code sits in a hairline box. Quotes are dashed, not amber.'
	}}
/>

<div class="ink-read mx-auto w-full max-w-xl p-4">
	<Markdown {md} />
</div>
