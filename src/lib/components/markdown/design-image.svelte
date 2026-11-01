<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	let { alt, src }: { alt?: string; src?: string } = $props();
	const cleanAlt = $derived(alt === '2col' ? '' : alt || '');

	const snapToGrid: Attachment<HTMLImageElement> = (node) => {
		const gridPx = () => {
			const raw = getComputedStyle(node).getPropertyValue('--grid').trim();
			if (raw.endsWith('px')) {
				const parsed = Number.parseFloat(raw);
				if (parsed > 0) return parsed;
			}
			return 24;
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
