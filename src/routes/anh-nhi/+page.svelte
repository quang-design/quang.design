<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';

	let guestName = $state('');
	let restaurant = $state('');
	let guests = $state(1);
	let submitted = $state(false);

	const displayName = $derived(guestName.trim() || 'friends');
	const displayVenue = $derived(restaurant.trim() || 'our favourite spot');

	function decrement() {
		if (guests > 1) guests -= 1;
	}

	function increment() {
		if (guests < 20) guests += 1;
	}

	function rsvp() {
		submitted = true;
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

<div class="invite">
	<div class="frame">
		<div class="card">
			<img
				class="heading"
				src="/anh-nhi/happy-birthday.svg"
				alt="Happy 1st Birthday"
				width="2135"
				height="731"
			/>

			<p class="name">ANH NHI</p>

			<img
				class="duck"
				src="/anh-nhi/duck.webp"
				alt="Yellow rubber duck wearing a party hat"
				width="900"
				height="1100"
			/>

			{#if !submitted}
				<div class="form">
					<p class="message">
						We'd love for
						<label class="field-inline">
							<span class="sr-only">Your name</span>
							<input
								type="text"
								bind:value={guestName}
								placeholder="your name"
								aria-label="Your name"
							/>
						</label>
						to join us for Anh Nhi's 1<sup>st</sup> birthday party at
						<label class="field-inline">
							<span class="sr-only">Restaurant</span>
							<input
								type="text"
								bind:value={restaurant}
								placeholder="restaurant name"
								aria-label="Restaurant"
							/>
						</label>
						this Saturday for lunch.
					</p>

					<div class="guests">
						<span class="guests-label">How many of you?</span>
						<div class="stepper" role="group" aria-label="Number of guests">
							<button
								type="button"
								onclick={decrement}
								aria-label="Remove one guest"
								disabled={guests <= 1}
							>
								&minus;
							</button>
							<span class="count" aria-live="polite">{guests}</span>
							<button
								type="button"
								onclick={increment}
								aria-label="Add one guest"
								disabled={guests >= 20}
							>
								+
							</button>
						</div>
					</div>

					<button type="button" class="rsvp" onclick={rsvp}>RSVP</button>
				</div>
			{:else}
				<div class="thanks">
					<p class="thanks-title">Yay! See you there {displayName}!</p>
					<p class="thanks-body">
						{guests}
						{guests === 1 ? 'seat' : 'seats'} reserved for Anh Nhi's 1<sup>st</sup> birthday at
						{displayVenue}, this Saturday lunch.
					</p>
					<button type="button" class="rsvp secondary" onclick={reset}>Edit RSVP</button>
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
		min-height: 100vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: clamp(0.75rem, 3vw, 2.5rem);
		background: #ffffff;
		font-family: 'Tenor Sans', ui-sans-serif, system-ui, sans-serif;
		color: var(--ink);
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
		gap: clamp(0.75rem, 2.5vw, 1.5rem);
		padding: clamp(1.25rem, 5vw, 2.75rem) clamp(1rem, 5vw, 2.5rem);
		background: #ffffff;
		text-align: center;
	}

	.heading {
		width: min(88%, 460px);
		height: auto;
		transform-origin: center;
		animation: heading-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.name {
		margin: 0;
		font-size: clamp(1.6rem, 7vw, 2.6rem);
		letter-spacing: 0.22em;
		text-indent: 0.22em;
		color: var(--pink);
		animation: rise-in 0.7s ease-out 0.35s both;
	}

	.duck {
		width: min(62%, 300px);
		height: auto;
		animation:
			rise-in 0.8s ease-out 0.5s both,
			float 4.5s ease-in-out 1.3s infinite;
	}

	.form,
	.thanks {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(1rem, 3vw, 1.5rem);
		width: 100%;
		animation: rise-in 0.7s ease-out 0.7s both;
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

	@keyframes heading-in {
		0% {
			opacity: 0;
			transform: translateY(18px) scale(0.82);
		}
		60% {
			opacity: 1;
			transform: translateY(0) scale(1.04);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
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
		.heading,
		.name,
		.duck,
		.form,
		.thanks {
			animation: none;
		}
	}
</style>
