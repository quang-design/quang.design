/** @vitest-environment jsdom */
import '../../../test/setup-dom';
import { render, screen } from '@testing-library/svelte';
import { createAgent } from '@ui-sdk/svelte/agent';
import { afterEach, expect, test, vi } from 'vitest';
import Subscribe from './subscribe.svelte';

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

test('an agent can find and fill the subscribe email field', async () => {
	let approve = false;
	const agent = createAgent({
		allow: (step) => !step.confirm || approve
	});
	render(Subscribe);

	const components = agent
		.snapshot()
		.filter((entry) => !entry.offPage && entry.component !== 'more');
	for (const entry of components) {
		expect(entry.label, `${entry.component} ${entry.ref} has no name`).toBeTruthy();
	}
	const labels = components.map((entry) => entry.label);
	expect(labels, 'Email is missing from the snapshot').toContain('Email');
	expect(
		labels.some((label) => typeof label === 'string' && /\bSubscribe\b/.test(label)),
		'Subscribe is missing from the snapshot'
	).toBe(true);

	const fill = await agent.act({
		steps: [{ ref: 'Email', action: 'setValue', args: ['agent@quang.design'] }]
	});
	expect(fill.ok, fill.error?.message).toBe(true);
	expect(screen.getByLabelText<HTMLInputElement>('Email').value).toBe('agent@quang.design');

	const subscribe = {
		steps: [{ ref: 'Subscribe', action: 'press' }]
	};
	expect((await agent.act(subscribe)).ok).toBe(false);
	approve = true;

	vi.stubGlobal(
		'fetch',
		vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
	);
	expect((await agent.act(subscribe)).ok).toBe(true);
});
