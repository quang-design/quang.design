export const typeScale = [
	{ token: '--fs-micro', px: '10', use: 'labels, counts' },
	{ token: '--fs-row', px: '11', use: 'captions, descriptions' },
	{ token: '--fs-body', px: '12', use: 'UI body, row titles, dates' },
	{ token: '--fs-read', px: '13', use: 'long-form prose only' },
	{ token: '--fs-display', px: '20', use: 'page titles' }
];

export const semanticTokens = [
	{ token: '--background', maps: '--paper' },
	{ token: '--foreground', maps: '--ink' },
	{ token: '--card', maps: '--paper' },
	{ token: '--primary', maps: '--ink' },
	{ token: '--primary-foreground', maps: '--paper' },
	{ token: '--muted', maps: '--ink-10' },
	{ token: '--muted-foreground', maps: '--ink-60' },
	{ token: '--secondary', maps: '--ink-10' },
	{ token: '--accent', maps: '--ink' },
	{ token: '--destructive', maps: '--ink' },
	{ token: '--border', maps: '--ink-25' },
	{ token: '--input', maps: '--ink-25' },
	{ token: '--ring', maps: '--ink-40' },
	{ token: '--popover', maps: '--paper' },
	{ token: '--sidebar', maps: '--paper' },
	{ token: '--radius', maps: '0' }
];

export const inventory = [
	{ layer: 'Foundation', current: 'src/app.css :root / .dark', atlas: '.atlas CSS variables' },
	{
		layer: 'Foundation',
		current: 'blue-500 links + underline animation',
		atlas: 'inherit + inversion'
	},
	{ layer: 'Foundation', current: '--radius / rounded-*', atlas: '0' },
	{ layer: 'Components', current: 'ui/button', atlas: 'token restyle + Action' },
	{ layer: 'Components', current: 'ui/input, ui/textarea', atlas: 'token restyle, 0.5px hair' },
	{ layer: 'Components', current: 'ui/badge', atlas: 'token restyle, no pill' },
	{ layer: 'Components', current: 'ui/kbd', atlas: 'HintKey' },
	{ layer: 'Components', current: 'ui/avatar', atlas: 'square hair, no scale' },
	{ layer: 'Components', current: 'ui/separator', atlas: 'Rule 0.5px' },
	{ layer: 'Components', current: 'ui/select', atlas: 'token restyle / IndexTree on desktop' },
	{ layer: 'Components', current: 'ui/spinner', atlas: 'static, no spin' },
	{ layer: 'Components', current: 'ui/sonner', atlas: 'inverted mark' },
	{ layer: 'Blocks', current: 'shared/navbar', atlas: 'StatusBar' },
	{ layer: 'Blocks', current: 'shared/footer + subscribe', atlas: 'HintBar + Field' },
	{ layer: 'Blocks', current: 'shared/post-card', atlas: 'IndexRow' },
	{ layer: 'Blocks', current: 'shared/empty-state', atlas: 'dashed hair empty' },
	{ layer: 'Blocks', current: 'markdown/renderer + code-block', atlas: 'ReadingPane type' },
	{ layer: 'Templates', current: '+layout.svelte max-w-7xl column', atlas: 'four-zone Shell' },
	{ layer: 'Pages', current: '/ /design /engineer /blog + tools', atlas: 'P1–P11' },
	{ layer: 'Out of scope', current: '/anh-nhi full-bleed invitation', atlas: 'unchanged' }
];
