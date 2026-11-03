import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const resend = vi.hoisted(() => ({
	emailsSend: vi.fn(),
	contactsCreate: vi.fn(),
	segmentsAdd: vi.fn(),
	segmentsList: vi.fn()
}));

vi.mock('$env/dynamic/private', () => ({
	env: new Proxy(
		{},
		{
			get: (_target, prop) => process.env[String(prop)]
		}
	)
}));

vi.mock('resend', () => ({
	Resend: class {
		emails = { send: resend.emailsSend };
		contacts = {
			create: resend.contactsCreate,
			segments: { add: resend.segmentsAdd }
		};
		segments = { list: resend.segmentsList };
	}
}));

const generalSegment = {
	id: 'seg_general',
	name: 'General',
	created_at: '2025-08-01T00:00:00.000Z'
};

function segmentPage(data: (typeof generalSegment)[], hasMore = false) {
	return {
		data: { object: 'list' as const, has_more: hasMore, data },
		error: null,
		headers: null
	};
}

function contactError(message: string, statusCode = 422) {
	return {
		data: null,
		error: { name: 'validation_error' as const, statusCode, message },
		headers: null
	};
}

async function postSubscribe(body: BodyInit, contentType?: string) {
	vi.resetModules();
	const { POST } = await import('./+server');
	const headers = new Headers();
	if (contentType) headers.set('content-type', contentType);
	const request = new Request('http://localhost/api/subscribe', {
		method: 'POST',
		headers,
		body
	});
	return POST({ request } as never);
}

function formBody(email: string) {
	const form = new FormData();
	form.set('email', email);
	return form;
}

const originalApiKey = process.env.RESEND_API_KEY;

beforeEach(() => {
	process.env.RESEND_API_KEY = 're_test';
	delete process.env.SUBSCRIBE_NOTIFICATION_TO;
	delete process.env.SUBSCRIBE_NOTIFICATION_FROM;
	resend.emailsSend.mockReset();
	resend.contactsCreate.mockReset();
	resend.segmentsAdd.mockReset();
	resend.segmentsList.mockReset();
	resend.emailsSend.mockResolvedValue({ data: { id: 'email_1' }, error: null, headers: null });
	resend.contactsCreate.mockResolvedValue({
		data: { id: 'contact_1', object: 'contact' },
		error: null,
		headers: null
	});
	resend.segmentsAdd.mockResolvedValue({ data: { id: 'seg_general' }, error: null, headers: null });
	resend.segmentsList.mockResolvedValue(segmentPage([generalSegment]));
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
	if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
	else process.env.RESEND_API_KEY = originalApiKey;
});

describe('POST /api/subscribe', () => {
	it('rejects an invalid email before calling Resend', async () => {
		const response = await postSubscribe(
			JSON.stringify({ email: 'not-an-email' }),
			'application/json'
		);

		expect(response.status).toBe(422);
		await expect(response.json()).resolves.toMatchObject({ name: 'validation_error' });
		expect(resend.emailsSend).not.toHaveBeenCalled();
		expect(resend.contactsCreate).not.toHaveBeenCalled();
	});

	it('sends the notification and creates a General contact', async () => {
		const response = await postSubscribe(formBody('Ada@Example.com'));

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toMatchObject({ success: true });
		expect(resend.emailsSend).toHaveBeenCalledWith(
			expect.objectContaining({
				to: 'xinchao@quang.design',
				replyTo: 'ada@example.com',
				subject: 'New subscriber: ada@example.com'
			})
		);
		expect(resend.contactsCreate).toHaveBeenCalledWith({
			email: 'ada@example.com',
			segments: [{ id: 'seg_general' }]
		});
		expect(resend.segmentsAdd).not.toHaveBeenCalled();
		expect(console.error).not.toHaveBeenCalled();
	});

	it('accepts the same email as JSON', async () => {
		const response = await postSubscribe(
			JSON.stringify({ email: 'ada@example.com' }),
			'application/json'
		);

		expect(response.status).toBe(200);
		expect(resend.contactsCreate).toHaveBeenCalledWith({
			email: 'ada@example.com',
			segments: [{ id: 'seg_general' }]
		});
	});

	it('adds an existing contact to General instead of creating another', async () => {
		resend.contactsCreate.mockResolvedValue(contactError('This contact already exists.'));

		const response = await postSubscribe(formBody('ada@example.com'));

		expect(response.status).toBe(200);
		expect(resend.contactsCreate).toHaveBeenCalledTimes(1);
		expect(resend.segmentsAdd).toHaveBeenCalledWith({
			email: 'ada@example.com',
			segmentId: 'seg_general'
		});
		expect(console.error).not.toHaveBeenCalled();
	});

	it('treats a contact that is already in General as saved', async () => {
		resend.contactsCreate.mockResolvedValue(contactError('Contact already exists', 409));
		resend.segmentsAdd.mockResolvedValue(contactError('Contact is already in this segment'));

		const response = await postSubscribe(formBody('ada@example.com'));

		expect(response.status).toBe(200);
		expect(console.error).not.toHaveBeenCalled();
	});

	it('does not treat a validation error as an existing contact', async () => {
		resend.contactsCreate.mockResolvedValue(contactError('Invalid email address'));

		const response = await postSubscribe(formBody('ada@example.com'));

		expect(response.status).toBe(200);
		expect(resend.segmentsAdd).not.toHaveBeenCalled();
		expect(console.error).toHaveBeenCalledWith(
			'Failed to save subscriber contact',
			'ada@example.com',
			expect.objectContaining({ message: 'Invalid email address' })
		);
	});

	it('keeps the signup when saving the contact fails', async () => {
		resend.contactsCreate.mockResolvedValue({
			data: null,
			error: { name: 'internal_server_error', statusCode: 500, message: 'boom' },
			headers: null
		});

		const response = await postSubscribe(formBody('ada@example.com'));

		expect(response.status).toBe(200);
		expect(resend.emailsSend).toHaveBeenCalledTimes(1);
		expect(resend.segmentsAdd).not.toHaveBeenCalled();
		expect(console.error).toHaveBeenCalledWith(
			'Failed to save subscriber contact',
			'ada@example.com',
			expect.objectContaining({ message: 'boom' })
		);
	});

	it('keeps the signup when the contact request throws', async () => {
		resend.contactsCreate.mockRejectedValue(new Error('network'));

		const response = await postSubscribe(formBody('ada@example.com'));

		expect(response.status).toBe(200);
		expect(resend.emailsSend).toHaveBeenCalledTimes(1);
		expect(console.error).toHaveBeenCalled();
	});

	it('keeps the signup when General cannot be resolved', async () => {
		resend.segmentsList.mockResolvedValue({
			data: null,
			error: { name: 'restricted_api_key', statusCode: 401, message: 'restricted' },
			headers: null
		});

		const response = await postSubscribe(formBody('ada@example.com'));

		expect(response.status).toBe(200);
		expect(resend.emailsSend).toHaveBeenCalledTimes(1);
		expect(resend.contactsCreate).not.toHaveBeenCalled();
		expect(console.error).toHaveBeenCalled();
	});

	it('does not create a contact when General is missing', async () => {
		resend.segmentsList.mockResolvedValue(segmentPage([]));

		const response = await postSubscribe(formBody('ada@example.com'));

		expect(response.status).toBe(200);
		expect(resend.contactsCreate).not.toHaveBeenCalled();
		expect(console.error).toHaveBeenCalled();
	});

	it('does not guess when more than one General segment exists', async () => {
		resend.segmentsList.mockResolvedValue(
			segmentPage([generalSegment, { ...generalSegment, id: 'seg_other' }])
		);

		const response = await postSubscribe(formBody('ada@example.com'));

		expect(response.status).toBe(200);
		expect(resend.contactsCreate).not.toHaveBeenCalled();
	});

	it('finds General on a later segment page', async () => {
		resend.segmentsList
			.mockResolvedValueOnce(
				segmentPage([{ id: 'seg_other', name: 'Other', created_at: '2025-01-01' }], true)
			)
			.mockResolvedValueOnce(segmentPage([generalSegment]));

		const response = await postSubscribe(formBody('ada@example.com'));

		expect(response.status).toBe(200);
		expect(resend.segmentsList).toHaveBeenNthCalledWith(2, { limit: 100, after: 'seg_other' });
		expect(resend.contactsCreate).toHaveBeenCalledWith({
			email: 'ada@example.com',
			segments: [{ id: 'seg_general' }]
		});
	});

	it('does not save a contact when the notification fails', async () => {
		resend.emailsSend.mockResolvedValue({
			data: null,
			error: { name: 'invalid_from_address', statusCode: 422, message: 'bad from' },
			headers: null
		});

		const response = await postSubscribe(formBody('ada@example.com'));

		expect(response.status).toBe(422);
		await expect(response.json()).resolves.toMatchObject({ message: 'bad from' });
		expect(resend.contactsCreate).not.toHaveBeenCalled();
	});

	it('does not call Resend when the API key is missing', async () => {
		delete process.env.RESEND_API_KEY;

		const response = await postSubscribe(formBody('ada@example.com'));

		expect(response.status).toBe(500);
		await expect(response.json()).resolves.toMatchObject({
			message: 'RESEND_API_KEY is not configured'
		});
		expect(resend.emailsSend).not.toHaveBeenCalled();
		expect(resend.contactsCreate).not.toHaveBeenCalled();
	});
});
