import { read } from '$app/server';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import regularFont from '../../../../static/fonts/CommitMono-400-Regular.woff2';
import boldFont from '../../../../static/fonts/CommitMono-700-Regular.woff2';
import { shareCard } from '$lib/server/share-card';
import { loadShareFonts, renderShareCard, type ShareFonts } from '$lib/server/share-image';

export const prerender = false;

let fonts: ShareFonts | undefined;

async function shareFonts() {
	if (fonts) return fonts;
	const [regular, bold] = await Promise.all([
		read(regularFont).arrayBuffer(),
		read(boldFont).arrayBuffer()
	]);
	fonts = loadShareFonts(new Uint8Array(regular), new Uint8Array(bold));
	return fonts;
}

export const GET: RequestHandler = async ({ params }) => {
	const path = params.path ? `/${params.path}` : '/';
	const card = shareCard(path);
	if (!card) error(404, 'Not found');

	const png = await renderShareCard(card, await shareFonts());
	return new Response(new Uint8Array(png), {
		headers: {
			'content-type': 'image/png',
			'cache-control': 'public, max-age=86400, s-maxage=604800'
		}
	});
};
