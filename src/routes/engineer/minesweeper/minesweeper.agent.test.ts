/** @vitest-environment jsdom */
import '../../../test/setup-dom';
import { render } from '@testing-library/svelte';
import { createAgent } from '@ui-sdk/svelte/agent';
import { expect, test } from 'vitest';
import Minesweeper from './Minesweeper.svelte';

test('an agent can find Minesweeper and operate cells', async () => {
	const agent = createAgent();
	render(Minesweeper);

	const components = agent
		.snapshot()
		.filter((entry) => !entry.offPage && entry.component !== 'more');
	for (const entry of components) {
		expect(entry.label, `${entry.component} ${entry.ref} has no name`).toBeTruthy();
	}
	const labels = components.map((entry) => entry.label);
	expect(labels, 'Minesweeper is missing from the snapshot').toContain('Minesweeper');
	expect(labels, 'Reset is missing from the snapshot').toContain('Reset');

	const board = components.find((entry) => entry.label === 'Minesweeper');
	expect(board?.actions).toEqual(expect.arrayContaining(['reveal', 'flag', 'reset']));

	const reveal = await agent.act({
		steps: [{ ref: 'Minesweeper', action: 'reveal', args: [0] }]
	});
	expect(reveal.ok, reveal.error?.message).toBe(true);

	const flag = await agent.act({
		steps: [{ ref: 'Minesweeper', action: 'flag', args: [1] }]
	});
	expect(flag.ok, flag.error?.message).toBe(true);

	const snapshotJson = JSON.stringify(agent.snapshot());
	expect(snapshotJson).not.toMatch(/"mines"\s*:/);
	expect(snapshotJson).not.toMatch(/"numbers"\s*:/);
});
