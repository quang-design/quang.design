<script lang="ts">
	import '../app.css';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import Footer from '$lib/components/shared/footer.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	const themeColors = { light: '#ffffff', dark: '#09090b' };

	onMount(() => {
		const hour = new Date().getHours();
		if (hour >= 6 && hour < 18) setMode('light');
		else setMode('dark');
	});

	injectAnalytics();
	injectSpeedInsights();
</script>

<ModeWatcher defaultMode={'light'} {themeColors} />

<Toaster position="top-center" />

<!-- Ink bleed SVG filter: blur (spread) → threshold (sharp) → noise (grain) -->
<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
	<filter id="ink-bleed" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
		<!-- Step 1: subtle blur for ink spread -->
		<feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur" />
		<!-- Step 2: steep transfer curve acts as threshold -->
		<feComponentTransfer in="blur" result="sharp">
			<feFuncR type="linear" slope="5" intercept="-2" />
			<feFuncG type="linear" slope="5" intercept="-2" />
			<feFuncB type="linear" slope="5" intercept="-2" />
		</feComponentTransfer>
		<!-- Step 3: generate paper grain noise -->
		<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="1" stitchTiles="stitch" result="noise" />
		<feColorMatrix in="noise" type="saturate" values="0" result="grayNoise" />
		<!-- Reduce noise intensity (push toward mid-gray so overlay is subtle) -->
		<feComponentTransfer in="grayNoise" result="subtleNoise">
			<feFuncR type="linear" slope="0.15" intercept="0.425" />
			<feFuncG type="linear" slope="0.15" intercept="0.425" />
			<feFuncB type="linear" slope="0.15" intercept="0.425" />
		</feComponentTransfer>
		<!-- Step 4: blend noise as overlay grain -->
		<feBlend in="sharp" in2="subtleNoise" mode="overlay" />
	</filter>
</svg>

<div class="mx-auto flex min-h-screen max-w-7xl flex-col" style="filter: url(#ink-bleed)">
	<Navbar />

	<main class="flex flex-1 flex-col py-4">
		{@render children()}
	</main>

	<Footer />
</div>
