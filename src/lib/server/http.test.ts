import { describe, expect, it } from 'vitest';
import { isHttpError } from '@sveltejs/kit';
import { createRateLimiter, readJsonValue, rejectCrossOrigin, requireBoundedString } from './http';

function expectStatus(run: () => unknown, status: number) {
	try {
		run();
		throw new Error(`expected HTTP ${status}`);
	} catch (err) {
		expect(isHttpError(err)).toBe(true);
		if (isHttpError(err)) expect(err.status).toBe(status);
	}
}

async function expectStatusAsync(run: () => Promise<unknown>, status: number) {
	try {
		await run();
		throw new Error(`expected HTTP ${status}`);
	} catch (err) {
		expect(isHttpError(err)).toBe(true);
		if (isHttpError(err)) expect(err.status).toBe(status);
	}
}

describe('rejectCrossOrigin', () => {
	it('allows same-origin and missing origin', () => {
		rejectCrossOrigin(
			new Request('https://quang.design/api', { headers: { origin: 'https://quang.design' } }),
			'https://quang.design'
		);
		rejectCrossOrigin(new Request('https://quang.design/api'), 'https://quang.design');
	});

	it('rejects a foreign origin', () => {
		expectStatus(
			() =>
				rejectCrossOrigin(
					new Request('https://quang.design/api', { headers: { origin: 'https://evil.example' } }),
					'https://quang.design'
				),
			403
		);
	});
});

describe('requireBoundedString', () => {
	it('returns a non-empty string within the limit', () => {
		expect(requireBoundedString('hello', 8)).toBe('hello');
	});

	it('rejects empty, non-string, and oversized values', () => {
		expectStatus(() => requireBoundedString('', 8), 400);
		expectStatus(() => requireBoundedString(null, 8), 400);
		expectStatus(() => requireBoundedString('toolong', 4), 400);
	});
});

describe('readJsonValue', () => {
	it('parses JSON under the byte cap', async () => {
		const request = new Request('https://quang.design/api', {
			method: 'POST',
			body: '{"ok":true}'
		});
		await expect(readJsonValue(request, 32)).resolves.toEqual({ ok: true });
	});

	it('rejects oversized and invalid JSON', async () => {
		await expectStatusAsync(
			() =>
				readJsonValue(
					new Request('https://quang.design/api', { method: 'POST', body: '{"ok":true}' }),
					8
				),
			413
		);
		await expectStatusAsync(
			() =>
				readJsonValue(
					new Request('https://quang.design/api', { method: 'POST', body: 'not-json' }),
					32
				),
			400
		);
	});
});

describe('createRateLimiter', () => {
	it('allows traffic under the limit and then 429s', () => {
		const limiter = createRateLimiter(2, 1_000);
		limiter.check('ip', 0);
		limiter.check('ip', 1);
		expectStatus(() => limiter.check('ip', 2), 429);
		limiter.check('ip', 1_001);
	});
});
