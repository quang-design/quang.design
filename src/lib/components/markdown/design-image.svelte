<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	let { alt, src }: { alt?: string; src?: string } = $props();
	const cleanAlt = $derived(alt === '2col' ? '' : alt || '');

	const snapToGrid: Attachment<HTMLImageElement> = (node) => {
		const apply = () => {
			const grid = Number.parseFloat(getComputedStyle(node).getPropertyValue('--grid')) || 24;
			const { naturalWidth: nw, naturalHeight: nh, clientWidth: w } = node;
			if (!nw || !nh || !w) return;
			node.style.height = `${Math.round((w * nh) / nw / grid) * grid}px`;
		};

		const onLoad = () => apply();
		if (node.complete) apply();
		node.addEventListener('load', onLoad);
		const ro = new ResizeObserver(apply);
		ro.observe(node);

		return () => {
			node.removeEventListener('load', onLoad);
			ro.disconnect();
		};
	};
</script>

<img alt={cleanAlt} class="w-full object-cover" loading="lazy" {src} {@attach snapToGrid} />
