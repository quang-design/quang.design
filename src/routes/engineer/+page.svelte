<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import SeoHead from '$lib/components/shared/seo-head.svelte';

	const projects = [
		{
			title: 'AI Telescopic Text',
			description:
				'AI-powered tool that progressively expands simple sentences into more detailed narratives.',
			href: '/engineer/telescopic'
		},
		{
			title: 'AI Microscopic Text',
			description: 'AI-powered tool that zips up long texts into short, concise words.',
			href: '/engineer/microscopic'
		},
		{
			title: 'Minesweeper',
			description: 'A classic minesweeper game built with SvelteKit and TailwindCSS.',
			href: '/engineer/minesweeper'
		},
		{
			title: 'User Agent Poetry Generator',
			description: 'Generates poetry from your browser user agent string.',
			href: 'https://user-info.quang.design/',
			external: true
		},
		{
			title: 'Bluesky Client (WIP)',
			description: 'A custom Bluesky social media client.',
			href: 'https://bluesky.quang.design/',
			external: true
		}
	];
</script>

<SeoHead
	title="Quang | Engineer"
	description="This is a collection of all my engineering work."
	canonical="https://quang.design/engineer"
/>

<h1 class="mb-4 text-2xl font-bold uppercase">All Things Engineering</h1>
<p class="mb-8 text-neutral-400">Most of them are built with Svelte and Tailwind CSS.</p>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each projects as project}
		<a
			href={project.href}
			target={project.external ? '_blank' : undefined}
			rel={project.external ? 'noopener noreferrer' : undefined}
			class="border-foreground/25 flex flex-col justify-between border-[0.5px] p-6 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
		>
			<div>
				<h2 class="mb-2 flex items-center gap-1 text-lg font-semibold">
					{project.title}
					{#if project.external}
						<ArrowUpRight class="h-4 w-4" />
					{/if}
				</h2>
				<p class="text-sm text-neutral-400">{project.description}</p>
			</div>
		</a>
	{/each}
</div>
