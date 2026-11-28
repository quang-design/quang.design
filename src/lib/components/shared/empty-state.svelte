<script lang="ts">
	import { MicroLabel, Hatch } from '$lib/components/primitives';
	import { titleCase } from '$lib/title-case';

	let { title, description }: { title: string; description: string } = $props();
</script>

<div class="hair-dashed flex flex-col items-center gap-2 p-8 text-center">
	<Hatch class="hair size-10" />
	<MicroLabel>{titleCase(title)}</MicroLabel>
	<p class="ink-row-desc">{description}</p>
</div>
