import { addContact } from '$lib/utils/resend';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const SubscribeSchema = z.object({
	email: z.string().email('Invalid email format')
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const contentType = request.headers.get('content-type') || '';
		let payload: unknown = null;
		if (contentType.includes('application/json')) {
			payload = await request.json().catch(() => null);
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
					issues: parsed.error.flatten(),
					statusCode: 422
				}),
				{ status: 422, headers: { 'Content-Type': 'application/json' } }
			);
		}

		const email = parsed.data.email.trim();

		const result = await addContact(email);
		return new Response(JSON.stringify({ success: true, result }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err: any) {
		const status = err?.statusCode ?? 500;
		const message = err?.message ?? 'Failed to subscribe email.';
		const name = err?.name ?? 'internal_error';
		return new Response(JSON.stringify({ name, message, statusCode: status }), {
			status,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
