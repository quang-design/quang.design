import { getInvitee, parseRsvpInput, submitRsvp } from '$lib/server/anh-nhi';
import { rsvpLimiter } from '$lib/server/http';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params }) => {
	const invitee = await getInvitee(params.slug);
	return {
		slug: params.slug,
		displayName: invitee?.displayName ?? '',
		lang: invitee?.lang ?? 'en',
		guests: invitee?.guests ?? 2
	};
};

export const actions: Actions = {
	default: async ({ request, params, getClientAddress }) => {
		rsvpLimiter.check(getClientAddress());
		const invitee = await getInvitee(params.slug);
		if (!invitee) throw error(400, 'Invalid RSVP');
		const data = await request.formData();
		const input = parseRsvpInput(data, params.slug);
		if (!input) throw error(400, 'Invalid RSVP');
		const saved = await submitRsvp(input);
		return { saved };
	}
};
