<script lang="ts">
	import { MicroLabel, Hatch } from '$lib/components/primitives';

	let { title, description }: { title: string; description: string } = $props();
</script>

<div class="hair-dashed flex flex-col items-center gap-2 p-8 text-center">
	<Hatch class="hair size-10" />
	<MicroLabel>{title}</MicroLabel>
	<p class="ink-row-desc">{description}</p>
</div>
