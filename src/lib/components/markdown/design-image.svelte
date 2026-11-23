<script lang="ts">
	import imageSizes from 'virtual:image-sizes';

	let { alt, src }: { alt?: string; src?: string } = $props();

	const cleanAlt = $derived(alt === '2col' ? '' : alt || '');
	const contain = $derived(/logo|diagram|wordmark|symbol/i.test(`${src ?? ''} ${cleanAlt}`));
	const size = $derived.by(() => {
		if (!src) return;
		let pathname = src;
		if (src.startsWith('http://') || src.startsWith('https://')) {
			try {
				pathname = new URL(src).pathname;
			} catch {
				return;
			}
		}
		pathname = pathname.split(/[?#]/)[0];
		try {
			pathname = decodeURIComponent(pathname);
		} catch {
			return;
		}
		return imageSizes[pathname];
	});
</script>

<div class={['design-media', { 'design-media--contain': contain }]}>
	<img
		alt={cleanAlt}
		{src}
		width={size?.w}
		height={size?.h}
		style={size ? `--ratio: ${size.w}/${size.h}` : undefined}
		loading="lazy"
	/>
</div>
