<script lang="ts">
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<h1>Welcome to SvelteKit</h1>
<pre>{JSON.stringify(data, null, 2)}</pre>
