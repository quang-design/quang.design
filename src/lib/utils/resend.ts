import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_AUDIENCE_ID } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export async function addContact(email: string) {
	if (!RESEND_AUDIENCE_ID) {
		throw new Error('Missing RESEND_AUDIENCE_ID environment variable');
	}

	const result = await resend.contacts.create({
		email: email.toLowerCase().trim(),
		unsubscribed: false,
		audienceId: RESEND_AUDIENCE_ID
	});

	if (!result.error) {
		return result;
	}

	throw new Error(result.error.message);
}
