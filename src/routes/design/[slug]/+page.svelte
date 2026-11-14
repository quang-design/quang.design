<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { DesignMarkdown } from '$lib/components/markdown';
	import { creditLink, type DesignFlags } from '$lib/content/design-flags';
	import { setDesignView } from '$lib/content/design-view';
	import { layoutGallery, splitDesignContent } from '$lib/utils/design-content';
	import { page } from '$app/state';
	import { designHeadline } from '$lib/content/headline';
	import { publishedDateValue } from '$lib/content/published-date';
	import { designHref } from '$lib/content/slug';
	import { absUrl } from '$lib/config/site';

	let {
		data
	}: {
		data: {
			md: string;
			meta: { title: string; description: string; thumbnail: string; date: string };
			flags: DesignFlags;
		};
	} = $props();

	setDesignView({
		get layout() {
			return data.flags.layout;
		},
		get credit() {
			return data.flags.credit;
		}
	});

	const { introMd, metaParts, galleryMd } = $derived(splitDesignContent(data.md));
	const galleryRows = $derived(data.flags.layout === 'flat' ? layoutGallery(galleryMd) : []);
	const href = $derived(designHref(page.params.slug));
	const headline = $derived(designHeadline(data.meta.title, page.params.slug ?? ''));
</script>

<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	canonical={href ? absUrl(href) : undefined}
	image={data.meta.thumbnail ? absUrl(data.meta.thumbnail) : undefined}
	type="article"
	publishedTime={data.meta.date ? publishedDateValue(data.meta.date) : undefined}
	author="Quang"
/>

<div class="flex flex-col">
	<div class="flex flex-col px-[var(--grid)] py-[var(--grid)]">
		<div class="mb-[var(--grid)] flex h-[var(--grid)] flex-wrap items-center gap-[var(--grid)]">
			{#if href}
				<a data-slot="badge" class="min-w-[calc(var(--grid)*5)]" href="{href}/llms.txt">llms.txt</a>
				<a data-slot="badge" class="min-w-[calc(var(--grid)*5)]" href="{href}/post.md">post.md</a>
			{/if}
		</div>
		<h1 class="ink-h1 uppercase">{headline.brand}</h1>
		<div
			class="grid grid-cols-1 items-start gap-[var(--grid)] sm:grid-cols-2 sm:gap-x-[calc(var(--grid)*2)]"
		>
			<div class="flex min-w-0 flex-col gap-[var(--grid)]">
				{#if introMd}
					{#each introMd.split('\n\n') as paragraph (paragraph)}
						{@const link = creditLink(paragraph, data.flags.credit)}
						<p class="m-0 text-base leading-[var(--grid)]">
							{#if link}
								{link.before}<a class="underline" href={link.href} target="_blank" rel="noopener"
									>{link.label}</a
								>{link.after}
							{:else}
								{paragraph}
							{/if}
						</p>
					{/each}
				{/if}
			</div>
			<div class="min-w-0">
				{#each metaParts as part (part)}
					<p class="m-0 text-base leading-[var(--grid)]">{part}</p>
				{/each}
			</div>
		</div>
	</div>

	{#if galleryMd}
		<div
			class={[
				'gallery flex flex-col',
				data.flags.layout === 'split' && 'gallery-split',
				data.flags.layout === 'flat' && 'gallery-flat'
			]}
		>
			{#if galleryRows.length}
				{#each galleryRows as row, i (i)}
					{#if row.kind === 'media'}
						<DesignMarkdown md={row.md} />
					{:else}
						<div class="grid grid-cols-1 sm:grid-cols-2">
							{#each row.cells as cell (cell.heading)}
								<div class={cell.side === 1 ? 'sm:col-start-2' : ''}>
									<h2 class="ink-h3 px-[var(--grid)] pt-[var(--grid)] pb-[var(--grid)]">
										{cell.heading}
									</h2>
									{#each cell.body.split('\n\n') as para, pi (pi)}
										<p
											class="ink-read px-[var(--grid)] pb-[var(--grid)] {pi === 0
												? 'pt-0'
												: 'pt-[var(--grid)]'}"
										>
											{para}
										</p>
									{/each}
								</div>
							{/each}
						</div>
					{/if}
				{/each}
			{:else}
				<DesignMarkdown md={galleryMd} />
			{/if}
		</div>
	{/if}
</div>
