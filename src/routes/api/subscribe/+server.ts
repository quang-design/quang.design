import { sendSubscriptionNotification, SubscribeError } from '$lib/utils/resend';
import { isHttpError, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import { readJsonValue, rejectCrossOrigin, subscribeLimiter } from '$lib/server/http';

const SubscribeSchema = z.object({
	email: z.string().email('Invalid email format').max(254)
});

export const POST: RequestHandler = async ({ request, url, getClientAddress }) => {
	try {
		rejectCrossOrigin(request, url.origin);
		subscribeLimiter.check(getClientAddress());

		const contentType = request.headers.get('content-type') || '';
		let payload: unknown = null;
		if (contentType.includes('application/json')) {
			payload = await readJsonValue(request, 2_048);
		} else if (
			contentType.includes('application/x-www-form-urlencoded') ||
			contentType.includes('multipart/form-data')
		) {
			const form = await request.formData();
			payload = Object.fromEntries(form.entries());
		}

		const parsed = SubscribeSchema.safeParse(payload);
		if (!parsed.success) {
			return new Response(
				JSON.stringify({
					name: 'validation_error',
					message: 'Invalid input',
					statusCode: 422
				}),
				{ status: 422, headers: { 'Content-Type': 'application/json' } }
			);
		}

		const email = parsed.data.email.trim();
		await sendSubscriptionNotification(email);
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err: unknown) {
		if (isHttpError(err)) throw err;

		console.error('subscribe failed', err instanceof Error ? err.name : 'unknown');
		const status = err instanceof SubscribeError ? err.statusCode : 500;
		const safeStatus = status >= 400 && status < 500 ? status : 500;
		return new Response(
			JSON.stringify({
				name: 'subscription_error',
				message: 'Unable to subscribe',
				statusCode: safeStatus
			}),
			{
				status: safeStatus,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
