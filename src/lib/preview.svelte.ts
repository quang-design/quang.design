import { apiPaths } from '$lib/config/api';

export type Preview = {
	eyebrow?: string;
	title: string;
	subtitle?: string;
	description?: string;
	date?: string;
	thumbnail?: string;
	meta?: string[];
	links?: { label: string; href: string }[];
	href?: string;
} | null;

type Card = NonNullable<Preview>;

function isInternalHref(href: string) {
	if (!href || href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:')) {
		return true;
	}
	if (typeof window === 'undefined') return false;
	try {
		return new URL(href, window.location.origin).origin === window.location.origin;
	} catch {
		return true;
	}
}

function readOg(data: unknown, href: string, fallback: string): Card {
	const row = typeof data === 'object' && data !== null ? data : {};
	const title = 'title' in row && typeof row.title === 'string' ? row.title : '';
	const thumbnail =
		'thumbnail' in row && typeof row.thumbnail === 'string' ? row.thumbnail : undefined;
	const description =
		'description' in row && typeof row.description === 'string' ? row.description : undefined;
	return {
		eyebrow: 'Link',
		title: title || fallback,
		thumbnail,
		description,
		href
	};
}

export class PreviewState {
	hover = $state<Preview>(null);
	page = $state<Preview>(null);
	gen = 0;
	cache: Record<string, Card> = {};

	get current(): Preview {
		return this.hover ?? this.page;
	}

	setHover(value: Preview) {
		this.gen += 1;
		this.hover = value;
	}

	clearHover() {
		this.gen += 1;
		this.hover = null;
	}

	setPage(value: Preview) {
		this.page = value;
	}

	hoverLink(href: string, title?: string) {
		const token = ++this.gen;
		if (isInternalHref(href)) {
			this.hover = {
				eyebrow: 'Link',
				title: title || href,
				href
			};
			return;
		}
		const cached = this.cache[href];
		if (cached) {
			this.hover = cached;
			return;
		}
		this.hover = {
			eyebrow: 'Link',
			title: title || href,
			href
		};
		void this.loadOg(href, token);
	}

	async loadOg(href: string, token: number) {
		try {
			const res = await fetch(`${apiPaths.og}?url=${encodeURIComponent(href)}`);
			if (token !== this.gen) return;
			if (!res.ok) return;
			const card = readOg(await res.json(), href, href);
			if (token !== this.gen) return;
			this.cache[href] = card;
			this.hover = card;
		} catch {
			return;
		}
	}
}

export const PREVIEW_KEY = 'preview';
