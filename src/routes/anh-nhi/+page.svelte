<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import headingRaw from '$lib/assets/happy-birthday.svg?raw';

	// Tag each letter path with an index so it can be revealed in sequence.
	let letterIndex = 0;
	const heading = headingRaw.replace(/style="fill:/g, () => `style="--d:${letterIndex++};fill:`);

	const RESTAURANT = 'Lá Lốt Vietnamese Cuisine';
	const MAPS_URL =
		'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(RESTAURANT);

	const lang = $derived(page.url.searchParams.get('lang') === 'vi' ? 'vi' : 'en');

	const invitee = $derived(page.url.searchParams.get('to') ?? '');

	let guestName = $state(page.url.searchParams.get('to') ?? '');
	let guests = $state(1);
	let submitted = $state(false);
	let submitting = $state(false);

	const t = $derived(
		lang === 'vi'
			? {
					guestsLabel: 'Bao nhiêu người tham dự?',
					namePlaceholder: 'tên của bạn',
					nameAria: 'Tên của bạn',
					guestsAria: 'Số lượng khách',
					addAria: 'Thêm một người',
					removeAria: 'Bớt một người',
					rsvp: 'Xác nhận',
					editRsvp: 'Chỉnh sửa',
					thanksTitle: 'Tuyệt vời! Hẹn gặp bạn nhé',
					fallbackName: 'các bạn'
				}
			: {
					guestsLabel: 'How many of you?',
					namePlaceholder: 'your name',
					nameAria: 'Your name',
					guestsAria: 'Number of guests',
					addAria: 'Add one guest',
					removeAria: 'Remove one guest',
					rsvp: 'RSVP',
					editRsvp: 'Edit RSVP',
					thanksTitle: 'Yay! See you there',
					fallbackName: 'friends'
				}
	);

	const displayName = $derived(guestName.trim() || t.fallbackName);

	function setLang(next: 'en' | 'vi') {
		const url = new URL(page.url);
		if (next === 'vi') url.searchParams.set('lang', 'vi');
		else url.searchParams.delete('lang');
		goto(url, { replaceState: true, keepFocus: true, noScroll: true });
	}

	function decrement() {
		if (guests > 1) guests -= 1;
	}

	function increment() {
		if (guests < 20) guests += 1;
	}

	function reset() {
		submitted = false;
	}
</script>

<SeoHead
	title="Anh Nhi's 1st Birthday"
	description="You're invited to celebrate Anh Nhi's first birthday — this Saturday lunch."
	canonical="https://quang.design/anh-nhi"
	image="https://quang.design/anh-nhi/duck.webp"
/>

{#snippet pin()}
	<svg class="pin" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
		<path
			d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
			fill="currentColor"
		/>
	</svg>
{/snippet}

{#snippet venue()}
	<a class="venue" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
		{@render pin()}{RESTAURANT}
	</a>
{/snippet}

{#snippet nameField()}
	<label class="field-inline">
		<span class="sr-only">{t.nameAria}</span>
		<input
			type="text"
			name="name"
			bind:value={guestName}
			placeholder={t.namePlaceholder}
			aria-label={t.nameAria}
		/>
	</label>
{/snippet}

<div class="invite">
	<div class="lang" role="group" aria-label="Language">
		<button type="button" class:active={lang === 'en'} onclick={() => setLang('en')}>EN</button>
		<button type="button" class:active={lang === 'vi'} onclick={() => setLang('vi')}>VI</button>
	</div>

	<div class="frame">
		<div class="card">
			<div class="heading" role="img" aria-label="Happy 1st Birthday">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html heading}
			</div>

			<p class="name">ANH NHI</p>

			<img
				class="duck"
				src="/anh-nhi/duck.webp"
				alt="Yellow rubber duck wearing a party hat"
				width="900"
				height="1100"
			/>

			{#if !submitted}
				<form
					class="form"
					method="POST"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update({ reset: false });
							submitting = false;
							submitted = true;
						};
					}}
				>
					<input type="hidden" name="guests" value={guests} />
					<input type="hidden" name="lang" value={lang} />
					<input type="hidden" name="invitee" value={invitee} />
					{#if lang === 'vi'}
						<p class="message">
							Chúng mình rất mong {@render nameField()} đến chung vui tiệc sinh nhật 1 tuổi của Anh Nhi
							tại {@render venue()} vào trưa thứ Bảy này.
						</p>
					{:else}
						<p class="message">
							We'd love for {@render nameField()} to join us for Anh Nhi's 1<sup>st</sup> birthday
							party at {@render venue()} this Saturday for lunch.
						</p>
					{/if}

					<div class="guests">
						<span class="guests-label">{t.guestsLabel}</span>
						<div class="stepper" role="group" aria-label={t.guestsAria}>
							<button
								type="button"
								onclick={decrement}
								aria-label={t.removeAria}
								disabled={guests <= 1}
							>
								&minus;
							</button>
							<span class="count" aria-live="polite">{guests}</span>
							<button
								type="button"
								onclick={increment}
								aria-label={t.addAria}
								disabled={guests >= 20}
							>
								+
							</button>
						</div>
					</div>

					<button type="submit" class="rsvp" disabled={submitting}>{t.rsvp}</button>
				</form>
			{:else}
				<div class="thanks">
					<p class="thanks-title">{t.thanksTitle} {displayName}!</p>
					{#if lang === 'vi'}
						<p class="thanks-body">
							Đã giữ {guests} chỗ cho tiệc sinh nhật 1 tuổi của Anh Nhi tại {@render venue()}, trưa
							thứ Bảy này.
						</p>
					{:else}
						<p class="thanks-body">
							{guests}
							{guests === 1 ? 'seat' : 'seats'} reserved for Anh Nhi's 1<sup>st</sup> birthday at
							{@render venue()}, this Saturday lunch.
						</p>
					{/if}
					<button type="button" class="rsvp secondary" onclick={reset}>{t.editRsvp}</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.invite {
		--pink: #f7b0c4;
		--pink-deep: #ee8fab;
		--checker: #f8d7e1;
		--ink: #6b5560;
		min-height: 100dvh;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: clamp(0.5rem, 2vh, 1.25rem);
		padding: clamp(0.6rem, 2.5vh, 2rem) clamp(0.75rem, 3vw, 2.5rem);
		background: #ffffff;
		font-family: 'Tenor Sans', ui-sans-serif, system-ui, sans-serif;
		color: var(--ink);
	}

	.lang {
		display: inline-flex;
		padding: 0.2rem;
		gap: 0.15rem;
		background: var(--checker);
		border-radius: 9999px !important;
	}

	.lang button {
		font: inherit;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		padding: 0.3em 0.95em;
		color: var(--pink-deep);
		background: transparent;
		border: none;
		border-radius: 9999px !important;
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}

	.lang button.active {
		color: #fff;
		background: var(--pink);
	}

	.frame {
		width: 100%;
		max-width: 640px;
		padding: clamp(10px, 2.5vw, 18px);
		background-color: #ffffff;
		background-image: repeating-conic-gradient(var(--checker) 0% 25%, #ffffff 0% 50%);
		background-size: clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px);
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(0.6rem, 2vh, 1.5rem);
		padding: clamp(1rem, 4vh, 2.75rem) clamp(1rem, 5vw, 2.5rem);
		background: #ffffff;
		text-align: center;
	}

	.heading {
		width: min(88%, 460px);
	}

	.heading :global(svg) {
		display: block;
		width: 100%;
		height: auto;
	}

	.heading :global(path) {
		opacity: 0;
		animation: letter-in 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
		animation-delay: calc(var(--d) * 55ms);
	}

	.name {
		margin: 0;
		font-size: clamp(1.6rem, 7vw, 2.6rem);
		letter-spacing: 0.22em;
		text-indent: 0.22em;
		color: var(--pink);
		animation: rise-in 0.7s ease-out 0.95s both;
	}

	.duck {
		width: min(52%, 260px);
		height: auto;
		animation:
			rise-in 0.8s ease-out 1.1s both,
			float 4.5s ease-in-out 1.9s infinite;
	}

	.form,
	.thanks {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(0.85rem, 2.5vh, 1.5rem);
		width: 100%;
		animation: rise-in 0.7s ease-out 1.25s both;
	}

	.message {
		margin: 0;
		max-width: 30rem;
		font-size: clamp(1rem, 3.4vw, 1.2rem);
		line-height: 1.9;
	}

	.field-inline {
		display: inline-block;
	}

	.field-inline input {
		font: inherit;
		text-align: center;
		color: var(--pink-deep);
		background: transparent;
		border: none;
		border-bottom: 2px dotted var(--pink);
		padding: 0 0.35em 0.1em;
		min-width: 6.5em;
		width: 8em;
		max-width: 100%;
		outline: none;
	}

	.field-inline input::placeholder {
		color: var(--pink);
		opacity: 0.55;
	}

	.field-inline input:focus {
		border-bottom-color: var(--pink-deep);
	}

	.venue {
		display: inline-flex;
		align-items: baseline;
		gap: 0.2em;
		color: var(--pink-deep);
		text-decoration: none;
		border-bottom: 2px dotted var(--pink);
		transition: color 0.2s ease;
	}

	.venue:hover {
		color: var(--pink);
	}

	.pin {
		width: 0.85em;
		height: 0.85em;
		flex: none;
		align-self: center;
		color: var(--pink);
	}

	sup {
		font-size: 0.6em;
	}

	.guests {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
	}

	.guests-label {
		font-size: clamp(0.95rem, 3vw, 1.1rem);
		color: var(--ink);
	}

	.stepper {
		display: inline-flex;
		align-items: center;
		gap: clamp(1rem, 4vw, 1.75rem);
	}

	.stepper button {
		width: 2.75rem;
		height: 2.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		line-height: 1;
		color: var(--pink-deep);
		background: #fff;
		border: 2px solid var(--pink);
		border-radius: 9999px !important;
		cursor: pointer;
		transition:
			background 0.2s ease,
			transform 0.1s ease;
	}

	.stepper button:hover:not(:disabled) {
		background: var(--checker);
	}

	.stepper button:active:not(:disabled) {
		transform: scale(0.92);
	}

	.stepper button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.count {
		min-width: 1.6em;
		font-size: clamp(1.4rem, 5vw, 1.9rem);
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}

	.rsvp {
		padding: 0.85em 2.75em;
		font: inherit;
		font-size: clamp(1rem, 3.2vw, 1.15rem);
		letter-spacing: 0.14em;
		color: #fff;
		background: var(--pink);
		border: none;
		border-radius: 9999px !important;
		cursor: pointer;
		box-shadow: 0 8px 20px -8px var(--pink-deep);
		transition:
			background 0.2s ease,
			transform 0.12s ease;
	}

	.rsvp:hover {
		background: var(--pink-deep);
	}

	.rsvp:active {
		transform: translateY(1px) scale(0.98);
	}

	.rsvp.secondary {
		color: var(--pink-deep);
		background: transparent;
		border: 2px solid var(--pink);
		box-shadow: none;
		padding: 0.7em 2.2em;
	}

	.rsvp.secondary:hover {
		background: var(--checker);
	}

	.thanks-title {
		margin: 0;
		font-size: clamp(1.3rem, 5vw, 1.9rem);
		color: var(--pink-deep);
		letter-spacing: 0.04em;
	}

	.thanks-body {
		margin: 0;
		max-width: 28rem;
		font-size: clamp(1rem, 3.2vw, 1.15rem);
		line-height: 1.8;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@keyframes letter-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes rise-in {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.heading :global(path),
		.name,
		.duck,
		.form,
		.thanks {
			animation: none;
			opacity: 1;
		}
	}
</style>
