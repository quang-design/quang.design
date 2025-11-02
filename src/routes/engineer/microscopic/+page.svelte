<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import TextEditor from './text-editor.svelte';

	const initialText =
		"Yawning, and smearing my eyes with my fingers, I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap, checking with my hands to make sure it was cold enough (The best tea comes from the coldest water). I glanced outside for a minute at the city mist. I could almost taste the grey. I plugged the kettle in and switched it on. As the kettle began to hiss, I looked for biscuits. Anything above loose crumbs would do. Thankfully I found some fusty digestives. For some reason, biscuits are always nicer when they've gone a bit dry and stale. I took the milk out of the fridge and poured some into a cup that I'd left out from having used earlier. The kettle began grumbling fiercely so I took it from the cord, threw a teabag into my cup and poured boiling water onto it. I watched brown swirls rise up through the muted white of milky water. A few minutes passed. I removed and squeezed the teabag, then flicked it into the bin. I picked up my mug and left the kitchen with a nice, hot cup of strong tea.";
</script>

<SeoHead
	title="Quang | AI Microscopic Text"
	description="A tool to use AI to zip up long texts into short, concise words."
	canonical="https://quang.design/engineer/microscopic"
/>

<section class="max-w-sm">
	<div class="prose prose-invert mb-8">
		<h1 class="uppercase">Welcome to AI Microscopic Text</h1>
		<br />
		<p>
			Another tool inspired by <a href="/engineer/telescopic">AI Telescopic Text</a>, this tool uses
			AI to zip up long texts into short, concise words.
		</p>
		<br />
		<p>
			Select <span class="underline underline-offset-4">text</span> to see them zip up into concise words.
		</p>
	</div>

	<TextEditor {initialText} />
</section>

<style lang="postcss">
	:global(.prose) {
		@apply select-none;
	}
</style>
