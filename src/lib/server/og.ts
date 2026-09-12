export type OgCard = {
	title: string;
	image?: string;
	description?: string;
};

const PRIVATE_HOST = /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|169\.254\.|::1|\[::1\])/i;

export function assertPublicHttpUrl(raw: string): URL {
	const url = new URL(raw);
	if (url.protocol !== 'http:' && url.protocol !== 'https:') {
		throw new Error('url must be http or https');
	}
	if (PRIVATE_HOST.test(url.hostname) || isPrivateV4(url.hostname)) {
		throw new Error('url host is not public');
	}
	return url;
}

function isPrivateV4(host: string) {
	const m = /^172\.(\d+)\./.exec(host);
	if (!m) return false;
	const n = Number(m[1]);
	return n >= 16 && n <= 31;
}

function decode(value: string) {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.trim();
}

function meta(html: string, key: string) {
	const a = html.match(
		new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']+)["']`, 'i')
	);
	if (a?.[1]) return decode(a[1]);
	const b = html.match(
		new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${key}["']`, 'i')
	);
	return b?.[1] ? decode(b[1]) : '';
}

export function parseOg(html: string, baseUrl: string): OgCard {
	const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
	const title = meta(html, 'og:title') || meta(html, 'twitter:title') || decode(titleTag || '');
	const imageRaw = meta(html, 'og:image') || meta(html, 'twitter:image');
	const description =
		meta(html, 'og:description') || meta(html, 'twitter:description') || meta(html, 'description');
	let image: string | undefined;
	if (imageRaw) {
		try {
			image = new URL(imageRaw, baseUrl).href;
		} catch {
			image = undefined;
		}
	}
	return {
		title,
		image,
		description: description || undefined
	};
}
