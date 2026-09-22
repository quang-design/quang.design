<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { apiPaths } from '$lib/config/api';
	import EditableText from './editable-text.svelte';

	let isLoading = $state(false);

	let text = $state('I made tea.');

	const onTextChange = (newText: string) => {
		text = newText;
	};

	const onWordClick = async (index: number) => {
		if (isLoading) return;

		const snapshot = text;
		const words = snapshot.split(' ');
		if (!words[index]) return;

		isLoading = true;
		words[index] = '<loading>';
		text = words.join(' ');

		try {
			const response = await fetch(apiPaths.telescopic, {
				method: 'POST',
				body: JSON.stringify({ context: snapshot, index }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (!response.ok) throw new Error('expand failed');
			const data = await response.json();
			const sentence = data.content?.[0]?.text;
			if (typeof sentence !== 'string') throw new Error('expand failed');
			text = sentence;
		} catch (_error) {
			text = snapshot;
		} finally {
			isLoading = false;
		}
	};
</script>

<SeoHead
	title="Quang | AI Telescopic Text"
	description="A tool to use AI to progressively expand simple sentences into more detailed narratives."
	canonical="https://quang.design/engineer/telescopic"
/>

<div class="canvas-split">
	<h1 class="ink-h1 uppercase sm:col-start-1">Welcome to AI Telescopic Text</h1>
	<div class="ink-read space-y-[var(--grid)] sm:col-start-1">
		<p>
			Inspired by <a href="https://www.telescopictext.org">Telescopic Text</a>, this tool uses AI to
			progressively expand simple sentences into more detailed narratives.
		</p>
		<p>
			Click on <span class="underline underline-offset-4">underlined</span> words to see them expand into
			richer descriptions, transforming basic statements into vivid, detailed passages.
		</p>
	</div>
	<div class="min-w-0 sm:col-start-2 sm:row-start-2">
		<EditableText {text} {onTextChange} {onWordClick} busy={isLoading} />
	</div>
</div>
