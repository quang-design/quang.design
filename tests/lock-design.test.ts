import { execFileSync } from 'node:child_process';
import { describe, it } from 'vitest';

describe('design lock', () => {
	it('sits index codes on the 24px grid and draws each hairline once', () => {
		execFileSync(process.execPath, ['scripts/lock-design.mjs', '--assert'], {
			stdio: 'inherit',
			timeout: 120_000
		});
	}, 120_000);
});
