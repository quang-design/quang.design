import type { PageServerLoad } from './$types';
import { basehub } from 'basehub';
import { BASEHUB_TOKEN } from '$env/static/private';

export const load: PageServerLoad = async () => {
	const data = await basehub({
		token: BASEHUB_TOKEN
	}).query({
		_sys: {
			id: true
		},
		test: {
			_id: true,
			description: {
				html: true,
				markdown: true,
				plainText: true,
				json: {
					content: true
				}
			}
		}
	});

	return {
		page_server_data: { data }
	};
};
