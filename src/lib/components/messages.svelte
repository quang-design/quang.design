<script lang="ts">
	import { Markdown } from './markdown';
	let { messages } = $props();
</script>

<div class="mb-4 flex flex-col gap-4">
	{#each messages as message}
		{#if message.role === 'user'}
			<div class="bg-background border-foreground/5 ml-auto w-fit rounded-sm border p-2">
				<Markdown md={message.content} />
			</div>
		{:else if message.role === 'assistant'}
			<div class="mr-auto w-fit p-2">
				<Markdown md={message.content} />
			</div>
		{/if}
	{/each}
</div>
