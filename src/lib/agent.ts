import { browser } from '$app/environment';
import { createAgent, registerTools } from '@ui-sdk/svelte/agent';

const agent = createAgent({
	allow: (step) =>
		step.confirm ? typeof window !== 'undefined' && window.confirm(step.confirm) : true
});

if (browser) {
	registerTools(agent, { allow: () => true });

	if (import.meta.env.DEV) {
		(window as Window & { agent?: typeof agent }).agent = agent;
	}
}

export { agent };
