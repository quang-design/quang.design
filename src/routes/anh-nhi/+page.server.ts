import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const guests = Number(data.get('guests') ?? 1);
		const lang = data.get('lang') === 'vi' ? 'vi' : 'en';
		const invitee = String(data.get('invitee') ?? '').trim();

		const webhook = env.RSVP_SHEET_WEBHOOK_URL;
		if (!webhook) {
			// Sheet not configured yet — accept the RSVP so the page still works.
			return { saved: false };
		}

		try {
			await fetch(webhook, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name, guests, lang, invitee, submittedAt: new Date().toISOString() })
			});
		} catch (err) {
			console.error('RSVP webhook failed', err);
			return fail(502, { saved: false });
		}

		return { saved: true };
	}
};
