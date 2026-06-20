<script lang="ts">
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';

	let { title, description }: { title: string; description: string } = $props();
</script>

<div
	class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900"
>
	<CircleAlertIcon aria-hidden="true" />
	<h2 class="mt-2 text-2xl font-semibold">{title}</h2>
	<p class="text-muted-foreground mt-2">{description}</p>
</div>
