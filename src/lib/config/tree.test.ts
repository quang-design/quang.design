import { describe, expect, it } from 'vitest';
import type { PostMetadata } from '$lib/content/loader';
import { buildIndexTree } from './tree';

const missing = {
	slug: null,
	title: 'Gone',
	description: 'A design that is not there.',
	thumbnail: '',
	date: ''
} as unknown as PostMetadata;

describe('buildIndexTree', () => {
	it('does not link a missing design as /design/null', () => {
		const { groups } = buildIndexTree(
			{ design: [missing], blog: [], engineer: [] },
			'/design/doppio'
		);
		const encoded = JSON.stringify(groups);
		expect(encoded).not.toContain('/design/null');
		expect(encoded).not.toContain('"href":null');
	});
});
