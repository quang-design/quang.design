<script lang="ts">
	let { onClick } = $props<{
		onClick: () => void;
	}>();
</script>

<button
	class="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full border
           border-amber-500 bg-white/5 px-3 py-1.5 text-white shadow-md backdrop-blur-sm
           transition-all hover:bg-white/15 md:left-4 md:w-full md:max-w-[calc(theme(maxWidth.md)-2rem)] md:translate-x-0"
	onclick={onClick}
>
	Zip up
</button>
