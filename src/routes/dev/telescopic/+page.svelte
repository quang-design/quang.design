<script lang="ts">
	import EditableText from '$components/EditableText.svelte';

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
			const response = await fetch(`/api/telescopic?expand=${word}`, {
				method: 'POST',
				body: JSON.stringify({ context: apiTokenizedText }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await response.json();
			const expandedText = data.content[0].text;
			text = text.replace(loadingToken, expandedText);
		} catch (error) {
			console.error('Error expanding text:', error);
			text = text.replace(loadingToken, word);
		} finally {
			isLoading = false;
		}
	};
</script>

<svelte:head>
	<title>Quang | AI Telescopic Text</title>
	<meta
		name="description"
		content="A tool to use AI to progressively expand simple sentences into more detailed narratives."
	/>
</svelte:head>

<section class="max-w-sm">
	<h1 class="uppercase">Welcome to AI Telescopic Text</h1>
	<br />
	<p>
		Inspired by <a href="https://www.telescopictext.org">Telescopic Text</a>, this tool uses AI to
		progressively expand simple sentences into more detailed narratives.
	</p>
	<br />
	<p>
		Click on <span class="underline underline-offset-4">underlined</span> words to see them expand into
		richer descriptions, transforming basic statements into vivid, detailed passages.
	</p>
	<br />
	<p>
		For example, starting with a simple phrase like "I made tea," each click could reveal more
		detail:
	</p>
	<br />
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
