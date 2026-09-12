import { execFileSync } from 'node:child_process';
import { describe, it } from 'vitest';

describe('design lock', () => {
	it('keeps tree codes one cell tall and list codes flush 48px squares', () => {
		execFileSync(process.execPath, ['scripts/lock-design.mjs', '--assert'], {
			stdio: 'inherit',
			timeout: 120_000
		});
	}, 120_000);
});
