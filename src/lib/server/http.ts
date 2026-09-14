import { error } from '@sveltejs/kit';

export const LLM_MAX_JSON_BYTES = 16_384;
export const LLM_MAX_CONTEXT_CHARS = 8_000;
export const LLM_MAX_SELECTION_CHARS = 8_000;

type Bucket = { count: number; resetAt: number };

export function createRateLimiter(limit: number, windowMs: number) {
	const buckets = new Map<string, Bucket>();

	return {
		check(key: string, now = Date.now()) {
			if (buckets.size > 4_000) {
				for (const [id, bucket] of buckets) {
					if (now >= bucket.resetAt) buckets.delete(id);
				}
			}

			const bucket = buckets.get(key);
			if (!bucket || now >= bucket.resetAt) {
				buckets.set(key, { count: 1, resetAt: now + windowMs });
				return;
			}

			bucket.count += 1;
			if (bucket.count > limit) {
				throw error(429, 'Too many requests');
			}
		},
		reset() {
			buckets.clear();
		}
	};
}

export const llmLimiter = createRateLimiter(10, 60_000);
export const subscribeLimiter = createRateLimiter(5, 60_000);
export const rsvpLimiter = createRateLimiter(20, 60_000);

export function rejectCrossOrigin(request: Request, appOrigin: string) {
	const origin = request.headers.get('origin');
	if (origin && origin !== appOrigin) {
		throw error(403, 'Forbidden');
	}
}

export async function readJsonValue(request: Request, maxBytes: number): Promise<unknown> {
	const raw = await request.text();
	if (raw.length > maxBytes) {
		throw error(413, 'Payload too large');
	}

	try {
		return JSON.parse(raw);
	} catch {
		throw error(400, 'Invalid JSON');
	}
}

export function requireBoundedString(value: unknown, maxChars: number): string {
	if (typeof value !== 'string' || value.length === 0 || value.length > maxChars) {
		throw error(400, 'Invalid input');
	}
	return value;
}
