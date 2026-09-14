const INVITE_SLUG = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
export const MAX_RSVP_NAME_CHARS = 80;

export type RsvpInput = {
	slug: string;
	name: string;
	attending: 'yes' | 'no';
	guests: number;
	lang: 'en' | 'vi';
};

export function isInviteSlug(slug: string) {
	return INVITE_SLUG.test(slug);
}

export function parseRsvpInput(data: FormData, slugFromRoute?: string): RsvpInput | null {
	const slug = (slugFromRoute ?? '').trim();
	if (slugFromRoute !== undefined && !isInviteSlug(slug)) return null;

	const name = String(data.get('name') ?? '')
		.trim()
		.slice(0, MAX_RSVP_NAME_CHARS);
	if (!name) return null;

	const guestsRaw = Number(data.get('guests') ?? 0);
	const guests = Number.isFinite(guestsRaw) ? Math.min(20, Math.max(0, Math.floor(guestsRaw))) : 0;

	return {
		slug,
		name,
		attending: data.get('attending') === 'no' ? 'no' : 'yes',
		guests,
		lang: data.get('lang') === 'vi' ? 'vi' : 'en'
	};
}
