import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { assertPublicHttpUrl, parseOg } from '$lib/server/og';

const MAX_BYTES = 256_000;
const cache = new Map<string, { at: number; body: unknown }>();
const TTL = 60 * 60 * 1000;

export const GET: RequestHandler = async ({ url }) => {
	const raw = url.searchParams.get('url');
	if (!raw) return json({ error: 'missing url' }, { status: 400 });

	let target: URL;
	try {
		target = assertPublicHttpUrl(raw);
	} catch {
		return json({ error: 'invalid url' }, { status: 400 });
	}

	const key = target.href;
	const hit = cache.get(key);
	if (hit && Date.now() - hit.at < TTL) {
		return json(hit.body, { headers: { 'cache-control': 'public, max-age=3600' } });
	}

	try {
		const res = await fetch(target, {
			redirect: 'follow',
			signal: AbortSignal.timeout(5000),
			headers: { accept: 'text/html', 'user-agent': 'quang.design-og' }
		});
		if (!res.ok) return json({ error: 'fetch failed' }, { status: 502 });
		const buf = new Uint8Array(await res.arrayBuffer());
		const html = new TextDecoder().decode(buf.slice(0, MAX_BYTES));
		const card = parseOg(html, res.url || target.href);
		const body = {
			eyebrow: 'Link',
			title: card.title || target.hostname,
			thumbnail: card.image,
			description: card.description,
			href: target.href
		};
		cache.set(key, { at: Date.now(), body });
		return json(body, { headers: { 'cache-control': 'public, max-age=3600' } });
	} catch {
		return json({ error: 'fetch failed' }, { status: 502 });
	}
};
