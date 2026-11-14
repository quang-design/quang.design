/** @vitest-environment jsdom */
import '../../../test/setup-dom';
import { render } from '@testing-library/svelte';
import { createAgent } from '@ui-sdk/svelte/agent';
import { expect, test } from 'vitest';
import StatusBar from './status-bar.svelte';

test('an agent can find chrome toggles and the home control', async () => {
	const agent = createAgent();
	let menuOpen = false;
	render(StatusBar, {
		props: {
			get menuOpen() {
				return menuOpen;
			},
			set menuOpen(value: boolean) {
				menuOpen = value;
			}
		}
	});

	const components = agent
		.snapshot()
		.filter((entry) => !entry.offPage && entry.component !== 'more');
	for (const entry of components) {
		expect(entry.label, `${entry.component} ${entry.ref} has no name`).toBeTruthy();
	}
	const labels = components.map((entry) => entry.label);
	for (const label of ['Go home', 'Site menu', 'Dark mode']) {
		expect(labels, `${label} is missing from the snapshot`).toContain(label);
	}

	const menu = components.find((entry) => entry.label === 'Site menu');
	expect(menu?.component).toBe('button');

	const openMenu = await agent.act({
		steps: [{ ref: 'Site menu', action: 'press' }]
	});
	expect(openMenu.ok, openMenu.error?.message).toBe(true);
	expect(menuOpen).toBe(true);
});
