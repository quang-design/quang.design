<script lang="ts">
	import Maximize2Icon from '@lucide/svelte/icons/maximize-2';
	import Minimize2Icon from '@lucide/svelte/icons/minimize-2';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
	import UserIcon from '@lucide/svelte/icons/user';
	import CloudIcon from '@lucide/svelte/icons/cloud';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { pages } from '$lib/seo/copy';
	import { IndexRow } from '$lib/components/layout';
	import { engineerProjects } from '$lib/content/engineer';
	import { engineerCode } from '$lib/config/tree';

	const icons = {
		'/engineer/telescopic': Maximize2Icon,
		'/engineer/microscopic': Minimize2Icon,
		'/engineer/animation-vocabulary': SparklesIcon,
		'/engineer/minesweeper': LayoutGridIcon,
		'https://user-info.quang.design/': UserIcon,
		'https://bluesky.quang.design/': CloudIcon,
		'https://world.quang.design/': GlobeIcon
	};
</script>

<SeoHead
	title={pages.engineer.title}
	description={pages.engineer.description}
	canonical="https://quang.design/engineer"
/>

<div class="min-w-0">
	<h1 class="sr-only">Engineer</h1>
	<div class="stack stack-flush flex flex-col">
		{#each engineerProjects as project, i (project.href)}
			{@const Icon = icons[project.href as keyof typeof icons]}
			<IndexRow
				code={engineerCode(project.href, i)}
				title={project.title}
				description={project.description}
				href={project.href}
				external={project.external}
				placeholder={!Icon}
				preview={{
					eyebrow: 'Engineer',
					title: project.title,
					description: project.description,
					href: project.href
				}}
			>
				{#snippet icon()}
					{#if Icon}
						<Icon class="size-4" />
					{/if}
				{/snippet}
			</IndexRow>
		{/each}
	</div>
</div>
