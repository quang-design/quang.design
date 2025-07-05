<script lang="ts">
	import { optimize } from '$lib/utils/image';

	interface Props {
		src: string;
		alt: string;
	}

	let { src, alt, ...props }: Props = $props();
</script>

<img class="absolute top-0 left-0 h-full w-full" srcset={optimize(src)} {alt} {...props} />
