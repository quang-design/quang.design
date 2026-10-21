import { afterEach, describe, expect, it, vi } from 'vitest';
import { PreviewState } from './preview.svelte';

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('PreviewState', () => {
	it('keeps the link text when the og card is only the url', async () => {
		const href = 'https://www.brandsvietnam.com/blocked';
		let release: (response: Response) => void = () => {};
		const pending = new Promise<Response>((resolve) => {
			release = resolve;
		});
		vi.stubGlobal('fetch', vi.fn(() => pending));

		const state = new PreviewState();
		state.hoverLink(href, 'Young Lions');
		expect(state.current?.title).toBe('Young Lions');

		release(Response.json({ eyebrow: 'Link', title: href, href }));
		await pending;
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(state.current).toEqual({
			eyebrow: 'Link',
			title: 'Young Lions',
			href
		});
	});
});
