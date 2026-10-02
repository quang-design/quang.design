import { describe, expect, it } from 'vitest';
import { designHref } from './slug';

describe('designHref', () => {
	it('builds a path only for a real slug', () => {
		expect(designHref('doppio')).toBe('/design/doppio');
		expect(designHref('717')).toBe('/design/717');
		expect(designHref(null)).toBeNull();
		expect(designHref(undefined)).toBeNull();
		expect(designHref('')).toBeNull();
		expect(designHref('null')).toBeNull();
		expect(designHref('undefined')).toBeNull();
		expect(designHref('../blog')).toBeNull();
	});
});
