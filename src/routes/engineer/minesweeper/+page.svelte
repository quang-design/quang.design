<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import Minesweeper from './Minesweeper.svelte';
	import PagePreview from '$lib/components/layout/page-preview.svelte';
</script>

<SeoHead
	title="Quang | Minesweeper"
	description="A minesweeper game built with SvelteKit and TailwindCSS."
	canonical="https://quang.design/engineer/minesweeper"
/>

<PagePreview
	value={{
		eyebrow: 'Engineer · E4',
		title: 'Minesweeper',
		subtitle: 'A classic, drawn with hatch.',
		description:
			'Click a cell to reveal it. Right-click to flag. Numbers count neighbouring mines. Hatch is a mine. First click is always safe. Clear every empty cell to win.',
		meta: ['9 × 9', '10 mines', 'Left click reveal', 'Right click flag']
	}}
/>

<section class="p-4">
	<Minesweeper />
</section>
