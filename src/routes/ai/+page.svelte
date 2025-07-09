<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import MultimodalInput from '$lib/components/multimodal-input.svelte';
	import ImageDropzone from '$lib/components/image-dropzone.svelte';
	import { Input } from '$lib/components/ui/input';
	import Messages from '$lib/components/messages.svelte';

	let image = $state<File | null>(null);

	function handleFileChange(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files && files[0]) {
			image = files[0];
		}
	}

	let messages = $state([
		{
			role: 'user',
			content: 'Hello, how are you?'
		},
		{
			role: 'assistant',
			content: 'I am a large language model created by OpenAI, how can I help you today?'
		}
	]);

	$inspect(image);
</script>

<svelte:head>
	<title>AI</title>
	<meta name="description" content="AI-powered image editor" />
</svelte:head>

<div class="flex flex-1 flex-col">
	<h1 class="mb-4 text-center text-2xl font-bold">AI Image Editor</h1>

	<div class="hidden flex-1 md:flex">
		<Resizable.PaneGroup
			direction="horizontal"
			class="min-h-[calc(100vh-14rem)] w-full rounded-lg border"
		>
			<Resizable.Pane defaultSize={75} minSize={25}>
				<div class="bg-foreground/5 flex h-full items-center justify-center p-6">
					{#if image}
						<ImageDropzone {image} />
					{:else}
						<Input
							type="file"
							name="image"
							id="image-desktop"
							accept="image/*"
							onchange={handleFileChange}
							class="bg-background"
						/>
					{/if}
				</div>
			</Resizable.Pane>
			<Resizable.Handle withHandle />
			<Resizable.Pane defaultSize={25} minSize={25}>
				<div class="flex h-full flex-col justify-end-safe p-2">
					<Messages {messages} />
					<MultimodalInput />
				</div>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</div>

	<div class="flex flex-1 flex-col md:hidden">
		{#if image}
			<ImageDropzone {image} />
		{:else}
			<div class="flex items-center justify-center">
				<Input
					type="file"
					name="image"
					id="image-mobile"
					accept="image/*"
					onchange={handleFileChange}
				/>
			</div>
		{/if}

		<div class="mt-auto mb-4 w-full">
			<Messages {messages} />
			<MultimodalInput />
		</div>
	</div>
</div>
