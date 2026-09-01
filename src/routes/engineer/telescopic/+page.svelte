<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { apiPaths } from '$lib/config/api';
	import EditableText from './editable-text.svelte';
	import PagePreview from '$lib/components/layout/page-preview.svelte';

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

<PagePreview
	value={{
		eyebrow: 'Engineer · E1',
		title: 'AI Telescopic Text',
		subtitle: 'Click a word. It grows.',
		description:
			'Inspired by Telescopic Text, this tool uses AI to progressively expand simple sentences into more detailed narratives. Click underlined words to see them expand into richer descriptions. For example, starting with "I made tea," each click can reveal more detail.',
		links: [{ label: 'Telescopic Text', href: 'https://www.telescopictext.org' }]
	}}
/>

<section class="max-w-sm space-y-4 p-4">
	<EditableText {text} {onTextChange} {onWordClick} />
</section>

<style>
	:global(.loading-animation) {
		animation: loadingDots 1.5s infinite;
	}

	@keyframes loadingDots {
		0%,
		20% {
			content: '<loading.>';
		}
		40% {
			content: '<loading..>';
		}
		60% {
			content: '<loading...>';
		}
		80% {
			content: '<loading....>';
		}
	}
</style>
