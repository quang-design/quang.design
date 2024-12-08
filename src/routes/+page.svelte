<script>
	import { HorizontalDivider } from '$components';
	import { avatar } from '$assets';
</script>

<svelte:head>
	<title>Quang | Home</title>
	<meta name="description" content="A Vietnamese graphic designer with passion to build things." />
</svelte:head>

<section id="about">
	<blockquote class="italic">
		"The best person ever to exist."<br />
		<a href="https://www.urbandictionary.com/define.php?term=Quang#">—Urban Dictionary</a>
	</blockquote>
</section>
<HorizontalDivider />
<section id="about">
	<div class="flex items-center gap-2">
		<img
			src={avatar}
			alt="Quang Design Avatar"
			class="h-12 w-12 rounded-full border border-amber-200 transition-all hover:scale-125"
		/>
		<div class="inline-flex">
			<span class="uppercase">Xin Chào! </span>
			<span
				class="text-sm transition-all hover:rotate-12 hover:scale-150 hover:animate-[wave_0.5s_ease-in-out_3]"
				>👋</span
			>
		</div>
	</div>
	<p>
		<br />
		My name is Quang - a Vietnamese Graphic Designer skilled at crafting impactful brand identities.
		My goal is to deeply understand your vision and translate it into resonating visuals like branding
		system, naming, brand story & messaging.
		<br />
		<br />
		Deeply curious about technology, I started learning web development and deep learning a year ago.
		<br />
		<br />
		Currently, I'm in an exciting experimental phase, exploring NLP and other fascinating areas of tech.
		<br />
		<br />
		Feel free to <span class="italic"><a href="mailto:xinchao@quang.design">reach out</a></span> to me
		if you'd like to discuss design, branding, technology, or simply chat about the beauty of the color
		black! Happy to connect with y'all.
	</p>
</section>
<HorizontalDivider />
<section id="honors-awards">
	<h2 class="uppercase">Honors & Awards</h2>
	<br />
	<a
		href="https://www.brandsvietnam.com/congdong/topic/28096-vietnam-young-lions-2020-2021-danh-sach-nhung-chu-su-tu-tre-tai-nang"
	>
		<p>Gold Winner, Film & Integrated Category</p>
		<p>Vietnam Young Lions · Nov 2020</p>
		<p>Associated with KI Saigon</p>
	</a>
</section>
<HorizontalDivider />
<section id="publications">
	<h2 class="uppercase">Publications</h2>
	<br />
	<h3>Creative Boom</h3>
	<ul>
		<li>
			<a
				href="https://www.creativeboom.com/tips/what-i-wish-id-known-before-breaking-into-the-creative-industry/"
			>
				<p>8 things I wish I'd known before breaking into the creative industry</p>
			</a>
		</li>
	</ul>

	<h3 class="mt-4">World Brand Design Society</h3>
	<ul>
		<li>
			<a
				class=" hover:underline"
				href="https://worldbranddesign.com/design-a-plus-size-clothing-brand-identity-that-support-good-change/"
			>
				<p>Design a Plus-Size Clothing Brand Identity that Support Good Change</p>
			</a>
		</li>
		<li>
			<a
				class=" hover:underline"
				href="https://worldbranddesign.com/dream-sweets-a-nice-semblance-of-food-aesthetic/"
			>
				<p>Dream Sweets – A Nice Semblance Of Food & Aesthetic</p>
			</a>
		</li>
	</ul>
</section>
<HorizontalDivider />
<section id="experiences">
	<h2 class="uppercase">Experiences</h2>
	<br />
	<a class=" hover:underline" href="https://youtu.be/81R_Xxc6nDk">
		<p>The Design Kids Bootcamp · Srilanka, 2019</p>
	</a>
</section>
