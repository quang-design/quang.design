import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function svelteFiles(dir: string): string[] {
	const found: string[] = [];
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) found.push(...svelteFiles(path));
		else if (name.endsWith('.svelte')) found.push(path);
	}
	return found;
}

const rawHeading = /<h[1-6](?:\s|>)/;

const allowed = new Set([
	'src/lib/components/primitives/heading.svelte',
	'src/lib/components/markdown/renderer.svelte'
]);

describe('title case painters', () => {
	it('keeps raw heading tags out of every other svelte file', () => {
		const offenders = svelteFiles('src').filter((path) => {
			const normalized = path.split('\\').join('/');
			return !allowed.has(normalized) && rawHeading.test(readFileSync(path, 'utf8'));
		});
		expect(offenders).toEqual([]);
	});

	it('runs titleCaseHeadings in both markdown renderers', () => {
		for (const path of [
			'src/lib/components/markdown/renderer.svelte',
			'src/lib/components/markdown/design-renderer.svelte'
		]) {
			expect(readFileSync(path, 'utf8')).toContain('titleCaseHeadings');
		}
	});

	it('paints listed call sites through titleCase', () => {
		for (const path of [
			'src/lib/components/primitives/heading.svelte',
			'src/lib/components/layout/index-row.svelte',
			'src/lib/components/layout/index-tree.svelte',
			'src/lib/components/layout/reading-pane.svelte',
			'src/routes/engineer/animation-vocabulary/AnimationCard.svelte',
			'src/lib/components/shared/empty-state.svelte',
			'src/lib/components/layout/shell.svelte',
			'src/lib/server/share-card.ts',
			'src/lib/seo/copy.ts'
		]) {
			expect(readFileSync(path, 'utf8'), path).toContain('titleCase');
		}
	});
});
