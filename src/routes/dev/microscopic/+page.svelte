<script lang="ts">
	// TODO:
	// - Make the selection box more accurate
	// - Fix the zip up button position to be at the bottom

	import { browser } from '$app/environment';

	let text = $state(
		"Yawning, and smearing my eyes with my fingers, I walked bleary eyed into the kitchen and filled the kettle with fresh water from the tap, checking with my hands to make sure it was cold enough (The best tea comes from the coldest water). I glanced outside for a minute at the city mist. I could almost taste the grey. I plugged the kettle in and switched it on. As the kettle began to hiss, I looked for biscuits. Anything above loose crumbs would do. Thankfully I found some fusty digestives. For some reason, biscuits are always nicer when they've gone a bit dry and stale. I took the milk out of the fridge and poured some into a cup that I'd left out from having used earlier. The kettle began grumbling fiercely so I took it from the cord, threw a teabag into my cup and poured boiling water onto it. I watched brown swirls rise up through the muted white of milky water. A few minutes passed. I removed and squeezed the teabag, then flicked it into the bin. I picked up my mug and left the kitchen with a nice, hot cup of strong tea."
	);

	let selection = $state('');
	let selectionRect = $state<DOMRect | null>(null);
	let selectedIndices = $state(new Set<number>());

	$effect(() => {
		if (!browser) return;

		const updateSelection = () => {
			const sel = window.getSelection();
			selection = sel?.toString() ?? '';
		};

		document.addEventListener('selectionchange', updateSelection);
		return () => document.removeEventListener('selectionchange', updateSelection);
	});

	function handleIndexSelect(index: number, checked: boolean) {
		if (checked) {
			selectedIndices.add(index);
		} else {
			selectedIndices.delete(index);
		}
		// Create new Set to trigger reactivity
		selectedIndices = new Set(selectedIndices);
	}

	let zipUpButtonPosition = $derived.by(() => {
		if (!browser) return;
		const container = document.querySelector('.relative')?.getBoundingClientRect();
		if (!selectionRect || !container) return;

		return {
			left: selectionRect.left - container.left + selectionRect.width / 2,
			top: selectionRect.top - container.top - 48
		};
	});

	async function handleZipUp() {
		replaceSelection('<Zipping...>');
		try {
			const response = await fetch(`/api/microscopic`, {
				method: 'POST',
				body: JSON.stringify({ context: text, selection })
			});
			const data = await response.json();
			replaceSelection(data.content[0].text);
			window.getSelection()?.removeAllRanges();
		} catch (error) {
			console.error(error);
			replaceSelection(selection); // Restore original text if error occurs
		}
	}

	function replaceSelection(newText: string) {
		const sel = window.getSelection();
		if (!sel?.rangeCount) return;

		const range = sel.getRangeAt(0);
		range.deleteContents();

		// Create a span element with amber text color
		const span = document.createElement('span');
		span.className = 'text-amber-500';
		span.textContent = newText;

		range.insertNode(span);
	}

	let showZipUpButton = $derived.by(() => !!selection);
</script>

<svelte:head>
	<title>Quang | AI Microscopic Text</title>
	<meta
		name="description"
		content="A tool to use AI to zip up long texts into short, concise words."
	/>
</svelte:head>

<section class="max-w-sm">
	<div class="select-none">
		<h1 class="uppercase">Welcome to AI Microscopic Text</h1>
		<br />
		<p>
			Another tool inspired by <a href="/dev/telescopic">AI Telescopic Text</a>, this tool uses AI
			to zip up long texts into short, concise words.
		</p>
		<br />
		<p>
			Select <span class="underline underline-offset-4">text</span> to see them zip up into concise words.
		</p>
		<br />
		<p>
			For example, try to paste your own text and see it
			<span
				class="rounded-full border border-amber-500 bg-white/10 px-1.5 py-0.5 text-white shadow-md backdrop-blur-md hover:bg-white/20"
			>
				Zip up
			</span>
			into concise words:
		</p>
		<br />
	</div>

	<div class="relative w-full rounded border p-3">
		{#if showZipUpButton}
			<button
				class="fixed bottom-4 left-1/2 -translate-x-1/2 transform rounded-full border border-amber-500 bg-white/5 px-3 py-1 text-white shadow-md backdrop-blur-sm hover:bg-white/15 md:bottom-8 md:left-32 md:right-auto md:translate-x-1/2"
				onclick={handleZipUp}
			>
				Zip up
			</button>
		{/if}

		<p>{text}</p>
	</div>
</section>
