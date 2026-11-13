/** @vitest-environment jsdom */
import '../../../test/setup-dom';
import { render } from '@testing-library/svelte';
import { createAgent } from '@ui-sdk/svelte/agent';
import { expect, test, vi } from 'vitest';
import EditableText from './editable-text.svelte';

test('an agent can find telescopic controls and expand a word', async () => {
	const agent = createAgent();
	const onWordClick = vi.fn();
	const onTextChange = vi.fn();
	Object.assign(navigator, {
		clipboard: { writeText: vi.fn(async () => undefined) }
	});

	render(EditableText, {
		props: {
			text: 'hello agent world',
			onWordClick,
			onTextChange
		}
	});

	const components = agent
		.snapshot()
		.filter((entry) => !entry.offPage && entry.component !== 'more');
	for (const entry of components) {
		expect(entry.label, `${entry.component} ${entry.ref} has no name`).toBeTruthy();
	}
	const labels = components.map((entry) => entry.label);
	expect(labels, 'Telescopic text is missing from the snapshot').toContain('Telescopic text');
	expect(labels, 'Edit text is missing from the snapshot').toContain('Edit text');
	expect(labels, 'Copy text is missing from the snapshot').toContain('Copy text');

	const expand = await agent.act({
		steps: [{ ref: 'Telescopic text', action: 'expand', args: [1] }]
	});
	expect(expand.ok, expand.error?.message).toBe(true);
	expect(onWordClick).toHaveBeenCalledWith(1);

	const copy = await agent.act({
		steps: [{ ref: 'Telescopic text', action: 'copy' }]
	});
	expect(copy.ok, copy.error?.message).toBe(true);
});
