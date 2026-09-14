import { describe, expect, it } from 'vitest';
import { generateStructuredData } from './seo';

describe('generateStructuredData', () => {
	it('escapes < so JSON-LD cannot break out of a script tag', () => {
		const json = generateStructuredData({
			title: '</script><script>alert(1)</script>',
			description: 'ok',
			url: 'https://quang.design/blog'
		});
		expect(json).not.toContain('</script>');
		expect(json).toContain('\\u003c/script>');
	});
});
