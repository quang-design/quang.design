import { env } from '$env/dynamic/private';

export type Invitee = {
	slug: string;
	displayName: string;
	lang: 'en' | 'vi';
	guests: number;
};

export type RsvpInput = {
	slug: string;
	name: string;
	attending: 'yes' | 'no';
	guests: number;
	lang: 'en' | 'vi';
};

/** Look up an invitee by slug from the Google Sheet (via Apps Script doGet). */
export async function getInvitee(slug: string): Promise<Invitee | null> {
	const webhook = env.RSVP_SHEET_WEBHOOK_URL;
	if (!webhook || !slug) return null;

	try {
		const url = new URL(webhook);
		url.searchParams.set('slug', slug);
		const res = await fetch(url, { headers: { accept: 'application/json' } });
		if (!res.ok) return null;
		const data = await res.json();
		if (!data?.found) return null;
		return {
			slug: String(data.slug ?? slug),
			displayName: String(data.displayName ?? ''),
			lang: data.lang === 'vi' ? 'vi' : 'en',
			guests: Number(data.guests) > 0 ? Number(data.guests) : 2
		};
	} catch (err) {
		console.error('getInvitee failed', err);
		return null;
	}
}

/** Persist an RSVP to the Google Sheet (via Apps Script doPost). Best-effort. */
export async function submitRsvp(input: RsvpInput): Promise<boolean> {
	const webhook = env.RSVP_SHEET_WEBHOOK_URL;
	if (!webhook) return false;

	try {
		await fetch(webhook, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				slug: input.slug,
				displayName: input.name,
				attending: input.attending,
				guests: input.guests,
				lang: input.lang,
				submittedAt: new Date().toISOString()
			})
		});
		return true;
	} catch (err) {
		console.error('submitRsvp failed', err);
		return false;
	}
}
