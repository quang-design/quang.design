import { submitRsvp } from '$lib/server/anh-nhi';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const saved = await submitRsvp({
			slug: String(data.get('slug') ?? ''),
			name: String(data.get('name') ?? '').trim(),
			attending: data.get('attending') === 'no' ? 'no' : 'yes',
			guests: Number(data.get('guests') ?? 0),
			lang: data.get('lang') === 'vi' ? 'vi' : 'en'
		});
		return { saved };
	}
};
