import { env } from '$env/dynamic/private';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);
const defaultNotificationEmail = 'xinchao@quang.design';

export class SubscribeError extends Error {
	statusCode: number;

	constructor(message: string, statusCode = 500, name = 'subscription_error') {
		super(message);
		this.name = name;
		this.statusCode = statusCode;
	}
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

export async function sendSubscriptionNotification(email: string) {
	const subscriberEmail = email.toLowerCase().trim();
	const notificationEmail = env.SUBSCRIBE_NOTIFICATION_TO || defaultNotificationEmail;
	const sentAt = new Date().toISOString();
	const safeEmail = escapeHtml(subscriberEmail);
	const safeSentAt = escapeHtml(sentAt);

	const result = await resend.emails.send({
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
