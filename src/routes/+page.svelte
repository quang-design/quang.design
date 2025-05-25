<script>
	import { HorizontalDivider } from '$lib/components';
</script>

<svelte:head>
	<title>Quang | Home</title>
	<meta name="description" content="A Vietnamese graphic designer with passion to build things." />
</svelte:head>

<!-- Content only needs to be in a single column since the layout already handles the split -->
<div class="w-full">
	<section id="intro" class="mb-8">
		<blockquote class="italic">
			"The best person ever to exist."<br />
			<a href="https://www.urbandictionary.com/define.php?term=Quang#">—Urban Dictionary</a>
		</blockquote>

		<div class="mt-6 flex items-center gap-2">
			<img
				src="/quang-design-avatar.jpg"
				alt="Quang Design Avatar"
				class="h-16 w-16 rounded-full border border-amber-200 transition-all hover:scale-125"
			/>
			<div class="inline-flex">
				<span class="uppercase">Xin Chào! </span>
				<span
					class="transition-all hover:scale-150 hover:rotate-12 hover:animate-[wave_0.5s_ease-in-out_3]"
					>👋</span
				>
			</div>
		</div>
	</section>

	<HorizontalDivider />
	<section id="about" class="mb-8">
		<h2 class="mb-4 uppercase">About</h2>
		<p class="leading-relaxed">
			My name is Quang - a Vietnamese Graphic Designer skilled at crafting impactful brand
			identities. My goal is to deeply understand your vision and translate it into resonating
			visuals like branding system, naming, brand story & messaging.
		</p>
		<p class="mt-4 leading-relaxed">
			Deeply curious about technology, I started learning web development and deep learning a year
			ago.
		</p>
		<p class="mt-4 leading-relaxed">
			Currently, I'm in an exciting experimental phase, exploring NLP and other fascinating areas of
			tech.
		</p>
		<p class="mt-4 leading-relaxed">
			Feel free to <span class="italic"><a href="mailto:xinchao@quang.design">reach out</a></span>
			to me if you'd like to discuss design, branding, technology, or simply chat about the beauty of
			the color black! Happy to connect with y'all.
		</p>
	</section>

	<HorizontalDivider />

	<section id="honors-awards" class="mb-8">
		<h2 class="mb-4 uppercase">Honors & Awards</h2>
		<a
			href="https://www.brandsvietnam.com/congdong/topic/28096-vietnam-young-lions-2020-2021-danh-sach-nhung-chu-su-tu-tre-tai-nang"
			class="block rounded-sm p-4 transition-all hover:bg-stone-900"
		>
			<p>Gold Winner, Film & Integrated Category</p>
			<p class="mt-1 text-amber-500">Vietnam Young Lions · Nov 2020</p>
			<p class="mt-1 text-gray-400">Associated with KI Saigon</p>
		</a>
	</section>

	<HorizontalDivider />

	<section id="publications" class="mb-8">
		<h2 class="mb-4 uppercase">Publications</h2>

		<div class="mb-6">
			<h3 class="mb-2">Creative Boom</h3>
			<ul class="space-y-2">
				<li>
					<a
						href="https://www.creativeboom.com/tips/what-i-wish-id-known-before-breaking-into-the-creative-industry/"
						class="block rounded-sm p-2 transition-all hover:bg-gray-900"
					>
						<p>8 things I wish I'd known before breaking into the creative industry</p>
					</a>
				</li>
			</ul>
		</div>

		<div>
			<h3 class="mb-2">World Brand Design Society</h3>
			<ul class="space-y-2">
				<li>
					<a
						href="https://worldbranddesign.com/design-a-plus-size-clothing-brand-identity-that-support-good-change/"
						class="block rounded-sm p-2 transition-all hover:bg-gray-900"
					>
						<p>Design a Plus-Size Clothing Brand Identity that Support Good Change</p>
					</a>
				</li>
				<li>
					<a
						href="https://worldbranddesign.com/dream-sweets-a-nice-semblance-of-food-aesthetic/"
						class="block rounded-sm p-2 transition-all hover:bg-gray-900"
					>
						<p>Dream Sweets – A Nice Semblance Of Food & Aesthetic</p>
					</a>
				</li>
			</ul>
		</div>
	</section>

	<HorizontalDivider />

	<section id="experiences">
		<h2 class="mb-4 uppercase">Experiences</h2>
		<a
			class="block rounded-sm p-4 transition-all hover:bg-gray-900"
			href="https://youtu.be/81R_Xxc6nDk"
		>
			<p>The Design Kids Bootcamp · Srilanka, 2019</p>
		</a>
	</section>
</div>
