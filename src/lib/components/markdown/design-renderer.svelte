<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	import type { Plugin } from 'svelte-exmarkdown';
	import DesignParagraph from './design-paragraph.svelte';
	import DesignImage from './design-image.svelte';

	let { md }: { md: string } = $props();

	const designPlugin: Plugin = {
		renderer: {
			p: DesignParagraph,
			img: DesignImage
		}
	};
</script>

<Markdown {md} plugins={[gfmPlugin(), designPlugin]} />
