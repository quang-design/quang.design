import { browser } from '$app/environment';
import { createAgent, registerTools } from '@ui-sdk/svelte/agent';

type AppAgent = ReturnType<typeof createAgent>;

let agent: AppAgent | undefined;

if (browser) {
	agent = createAgent({
		allow: (step) => (step.confirm ? window.confirm(step.confirm) : true)
	});

	if (typeof document.modelContext?.registerTool === 'function') {
		registerTools(agent, { allow: () => true });
	}

	if (import.meta.env.DEV) {
		(window as Window & { agent?: AppAgent }).agent = agent;
	}
}

export { agent };
