<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	let { alt, src }: { alt?: string; src?: string } = $props();
	const cleanAlt = $derived(alt === '2col' ? '' : alt || '');

	const snapToGrid: Attachment<HTMLImageElement> = (node) => {
		if (CSS.supports('height', 'calc-size(auto, round(nearest, size, 1px))')) return;

		const gridPx = () => {
			const raw = getComputedStyle(node).getPropertyValue('--grid').trim();
			if (raw.endsWith('px')) {
				const parsed = Number.parseFloat(raw);
				if (parsed > 0) return parsed;
			}
			const probe = document.createElement('div');
			probe.style.cssText = 'position:absolute;height:var(--grid);visibility:hidden';
			(node.parentElement ?? document.body).append(probe);
			const measured = probe.getBoundingClientRect().height;
			probe.remove();
			return measured || 24;
		};

		const apply = () => {
			const grid = gridPx();
			const { naturalWidth, naturalHeight, clientWidth } = node;
			if (!naturalWidth || !naturalHeight || !clientWidth || !grid) return;
			const next = `${Math.round((clientWidth * naturalHeight) / naturalWidth / grid) * grid}px`;
			if (node.style.height !== next) node.style.height = next;
		};

		node.addEventListener('load', apply);
		if (node.complete) apply();
		const ro = new ResizeObserver(apply);
		ro.observe(node.parentElement ?? node);

		return () => {
			node.removeEventListener('load', apply);
			ro.disconnect();
		};
	};
</script>

<img alt={cleanAlt} class="w-full object-cover" loading="lazy" {src} {@attach snapToGrid} />
