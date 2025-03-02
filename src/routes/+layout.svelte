<script lang="ts">
	import '../app.css';
	import { Navbar, HorizontalDivider } from '$components';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { browser } from '$app/environment';

	let { children } = $props();
	let isMobileMenuOpen = $state(false);
	let isMobile = $state(false);

	injectAnalytics();

	// Check if mobile on client side only
	$effect(() => {
		if (browser) {
			const checkMobile = () => {
				isMobile = window.innerWidth < 768;
			};

			checkMobile();
			window.addEventListener('resize', checkMobile);

			return () => {
				window.removeEventListener('resize', checkMobile);
			};
		}
	});

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		if (isMobile && isMobileMenuOpen) {
			isMobileMenuOpen = false;
		}
	}

	function handleAsideClick(event) {
		// Only close if clicking directly on the aside element (not its children)
		if (event.target === event.currentTarget) {
			closeMobileMenu();
		}
	}
</script>

<div class="flex min-h-screen flex-col md:flex-row">
	<!-- Mobile menu button (only visible on small screens) -->
	<button
		class="fixed right-4 top-4 z-50 flex h-9 w-9 items-center justify-center border border-gray-600 bg-black text-white md:hidden"
		onclick={toggleMobileMenu}
	>
		<span class="-mt-1 text-lg">{isMobileMenuOpen ? '✕' : '☰'}</span>
	</button>

	<!-- Left sidebar with navbar at top and footer at bottom -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<aside
		class="fixed inset-0 z-40 flex w-full transform flex-col justify-between overflow-y-auto bg-black transition-transform duration-300 md:relative md:inset-auto md:min-h-screen md:w-1/3 md:max-w-xs md:transform-none md:border-r md:border-gray-600"
		class:translate-x-0={isMobileMenuOpen}
		class:-translate-x-full={!isMobileMenuOpen}
		class:md:translate-x-0={true}
		onclick={handleAsideClick}
	>
		<!-- Top section with navbar -->
		<div class="p-4">
			<Navbar on:navItemClick={closeMobileMenu} />
			<HorizontalDivider />
		</div>

		<!-- Footer section at bottom -->
		<footer class="mt-auto border-t border-gray-600 p-4 text-center text-gray-400">
			<p>© {new Date().getFullYear()} Quang</p>
		</footer>
	</aside>

	<!-- Main content area - larger width (2/3 ratio) -->
	<main
		class="w-full flex-1 p-4 md:ml-[16rem] md:w-2/3 md:p-8"
		class:hidden={isMobileMenuOpen && isMobile}
	>
		{@render children()}
	</main>
</div>
