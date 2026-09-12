import { execFileSync } from 'node:child_process';
import { describe, it } from 'vitest';

describe('design lock', () => {
	it('keeps list rows two cells tall and on the 24px grid', () => {
		execFileSync(process.execPath, ['scripts/lock-design.mjs', '--assert'], {
			stdio: 'inherit',
			timeout: 120_000
		});
	}, 120_000);
});
