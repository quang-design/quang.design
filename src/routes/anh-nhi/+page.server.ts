import { parseRsvpInput, submitRsvp } from '$lib/server/anh-nhi';
import { rsvpLimiter } from '$lib/server/http';
import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		rsvpLimiter.check(getClientAddress());
		const data = await request.formData();
		const input = parseRsvpInput(data);
		if (!input) throw error(400, 'Invalid RSVP');
		const saved = await submitRsvp(input);
		return { saved };
	}
};
