import { env } from '$env/dynamic/private';
import { isInviteSlug, MAX_RSVP_NAME_CHARS, type RsvpInput } from './rsvp-input';

export type { RsvpInput };
export { isInviteSlug, parseRsvpInput } from './rsvp-input';

export type Invitee = {
	slug: string;
	displayName: string;
	lang: 'en' | 'vi';
	guests: number;
};

function sheetWebhook(): URL | null {
	const webhook = env.RSVP_SHEET_WEBHOOK_URL;
	if (!webhook) return null;
	try {
		const url = new URL(webhook);
		if (url.protocol !== 'https:') return null;
		return url;
	} catch {
		return null;
	}
}

export async function getInvitee(slug: string): Promise<Invitee | null> {
	const webhook = sheetWebhook();
	if (!webhook || !isInviteSlug(slug)) return null;

	try {
		webhook.searchParams.set('slug', slug);
		const res = await fetch(webhook, { headers: { accept: 'application/json' } });
		if (!res.ok) return null;
		const data = (await res.json()) as {
			found?: unknown;
			slug?: unknown;
			displayName?: unknown;
			lang?: unknown;
			guests?: unknown;
		};
		if (!data?.found) return null;
		const guests = Number(data.guests);
		return {
			slug: String(data.slug ?? slug),
			displayName: String(data.displayName ?? '').slice(0, MAX_RSVP_NAME_CHARS),
			lang: data.lang === 'vi' ? 'vi' : 'en',
			guests: Number.isFinite(guests) ? Math.min(20, Math.max(1, Math.floor(guests))) : 2
		};
	} catch (err) {
		console.error('getInvitee failed', err);
		return null;
	}
}

export async function submitRsvp(input: RsvpInput): Promise<boolean> {
	const webhook = sheetWebhook();
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
