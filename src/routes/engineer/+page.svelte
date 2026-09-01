<script lang="ts">
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import Maximize2Icon from '@lucide/svelte/icons/maximize-2';
	import Minimize2Icon from '@lucide/svelte/icons/minimize-2';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
	import UserIcon from '@lucide/svelte/icons/user';
	import CloudIcon from '@lucide/svelte/icons/cloud';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { IndexRow } from '$lib/components/layout';
	import { engineerProjects } from '$lib/content/engineer';
	import { engineerCode } from '$lib/config/tree';

	const icons = {
		'/engineer/telescopic': Maximize2Icon,
		'/engineer/microscopic': Minimize2Icon,
		'/engineer/animation-vocabulary': SparklesIcon,
		'/engineer/minesweeper': LayoutGridIcon,
		'https://user-info.quang.design/': UserIcon,
		'https://bluesky.quang.design/': CloudIcon
	};
</script>

<SeoHead
	title="Quang | Engineer"
	description="This is a collection of all my engineering work."
	canonical="https://quang.design/engineer"
/>

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
				href: project.href,
				meta: project.external ? ['External project'] : undefined
			}}
		>
			{#snippet icon()}
				{#if Icon}
					<Icon class="size-4" />
					{#if project.external}
						<ArrowUpRightIcon class="size-3" />
					{/if}
				{/if}
			{/snippet}
		</IndexRow>
	{/each}
</div>
