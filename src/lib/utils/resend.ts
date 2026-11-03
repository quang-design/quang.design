import { env } from '$env/dynamic/private';
import { Resend } from 'resend';

let resend: Resend | null = null;
let generalSegmentId: string | undefined;
const defaultNotificationEmail = 'xinchao@quang.design';
const generalSegmentName = 'General';

export class SubscribeError extends Error {
	statusCode: number;

	constructor(message: string, statusCode = 500, name = 'subscription_error') {
		super(message);
		this.name = name;
		this.statusCode = statusCode;
	}
}

function getResendClient() {
	if (!env.RESEND_API_KEY) {
		throw new SubscribeError('RESEND_API_KEY is not configured');
	}

	resend ??= new Resend(env.RESEND_API_KEY);
	return resend;
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function normalizeSubscriberEmail(email: string) {
	return email.toLowerCase().trim();
}

function isAlreadyPresent(error: { message: string; name: string; statusCode: number | null }) {
	const name = error.name.toLowerCase();
	const message = error.message.toLowerCase();
	return (
		error.statusCode === 409 ||
		name.includes('already') ||
		name.includes('duplicate') ||
		message.includes('already exist') ||
		message.includes('already in')
	);
}

function logContactFailure(email: string, error: unknown) {
	console.error('Failed to save subscriber contact', email, error);
}

async function listSegments(client: Resend) {
	const segments = [];
	let after: string | undefined;

	for (;;) {
		const page = await client.segments.list(after ? { limit: 100, after } : { limit: 100 });
		if (page.error) {
			throw new Error(page.error.message);
		}

		segments.push(...page.data.data);
		if (!page.data.has_more) return segments;

		const cursor = page.data.data.at(-1)?.id;
		if (!cursor || cursor === after) {
			throw new Error('Segment list did not advance');
		}
		after = cursor;
	}
}

async function resolveGeneralSegmentId(client: Resend) {
	if (generalSegmentId) return generalSegmentId;

	const matches = (await listSegments(client)).filter(
		(segment) => segment.name === generalSegmentName
	);
	if (matches.length !== 1) {
		throw new Error(`Expected one ${generalSegmentName} segment, found ${matches.length}`);
	}

	generalSegmentId = matches[0].id;
	return generalSegmentId;
}

export async function saveGeneralContact(email: string) {
	const subscriberEmail = normalizeSubscriberEmail(email);

	try {
		const client = getResendClient();
		const segmentId = await resolveGeneralSegmentId(client);
		const created = await client.contacts.create({
			email: subscriberEmail,
			segments: [{ id: segmentId }]
		});

		if (!created.error) return;

		if (!isAlreadyPresent(created.error)) {
			logContactFailure(subscriberEmail, created.error);
			return;
		}

		const added = await client.contacts.segments.add({
			email: subscriberEmail,
			segmentId
		});
		if (!added.error || isAlreadyPresent(added.error)) return;

		logContactFailure(subscriberEmail, added.error);
	} catch (error) {
		logContactFailure(subscriberEmail, error);
	}
}

export async function sendSubscriptionNotification(email: string) {
	const subscriberEmail = normalizeSubscriberEmail(email);
	const notificationEmail = env.SUBSCRIBE_NOTIFICATION_TO || defaultNotificationEmail;
	const sentAt = new Date().toISOString();
	const safeEmail = escapeHtml(subscriberEmail);
	const safeSentAt = escapeHtml(sentAt);

	const result = await getResendClient().emails.send({
		from: env.SUBSCRIBE_NOTIFICATION_FROM || `Quang Design <${defaultNotificationEmail}>`,
		to: notificationEmail,
		replyTo: subscriberEmail,
		subject: `New subscriber: ${subscriberEmail}`,
		text: `New email subscriber: ${subscriberEmail}\nSubmitted at: ${sentAt}`,
		html: `<p>New email subscriber:</p><p><strong>${safeEmail}</strong></p><p>Submitted at: ${safeSentAt}</p>`
	});

	if (!result.error) {
		return result;
	}

	throw new SubscribeError(result.error.message, result.error.statusCode ?? 500, result.error.name);
}
