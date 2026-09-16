<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { apiPaths } from '$lib/config/api';
	import EditableText from './editable-text.svelte';

	let isLoading = $state(false);

	let text = $state('I made tea.');

	const onTextChange = (newText: string) => {
		text = newText;
	};

	const onWordClick = async (word: string) => {
		if (isLoading) return;

		isLoading = true;
		const loadingToken = '<loading>';
		const tokenizedText = text.replace(word, loadingToken);
		text = tokenizedText;

		try {
			const apiTokenizedText = text.replace(loadingToken, '<word>');
			const response = await fetch(`${apiPaths.telescopic}?expand=${word}`, {
				method: 'POST',
				body: JSON.stringify({ context: apiTokenizedText }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await response.json();
			const expandedText = data.content[0].text;
			text = text.replace(loadingToken, expandedText);
		} catch (_error) {
			text = text.replace(loadingToken, word);
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

<div
	class="grid grid-cols-1 items-start gap-[var(--grid)] px-[var(--grid)] py-[var(--grid)] sm:grid-cols-2 sm:gap-x-[calc(var(--grid)*2)]"
>
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
