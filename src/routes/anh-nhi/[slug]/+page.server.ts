import { getInvitee, submitRsvp } from '$lib/server/anh-nhi';
import type { Actions, PageServerLoad } from './$types';

// Dynamic per-invitee page: reads the sheet at request time, so no prerender.
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
	default: async ({ request, params }) => {
		const data = await request.formData();
		const saved = await submitRsvp({
			slug: String(data.get('slug') ?? params.slug),
			name: String(data.get('name') ?? '').trim(),
			attending: data.get('attending') === 'no' ? 'no' : 'yes',
			guests: Number(data.get('guests') ?? 0),
			lang: data.get('lang') === 'vi' ? 'vi' : 'en'
		});
		return { saved };
	}
};
