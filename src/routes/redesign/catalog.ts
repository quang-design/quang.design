export const catalogNav = [
	{ href: '#tokens', label: 'Tokens' },
	{ href: '#subatomic', label: 'Sub-atomic' },
	{ href: '#atoms', label: 'Atoms' },
	{ href: '#molecules', label: 'Molecules' },
	{ href: '#organisms', label: 'Organisms' },
	{ href: '#templates', label: 'Templates' },
	{ href: '#pages', label: 'Pages' }
];

export const typeScale = [
	{ token: '--text-xs', utility: 'text-xs', px: '10', use: 'labels, counts, descriptions' },
	{ token: '--text-sm', utility: 'text-sm', px: '12', use: 'shadcn chrome — Button, Input, Badge' },
	{ token: '--text-base', utility: 'text-base', px: '12', use: 'UI body, row titles, dates' },
	{ token: '--text-lg', utility: 'text-lg', px: '13', use: 'long-form prose' },
	{ token: '--text-xl', utility: 'text-xl', px: '20', use: 'page titles' }
];

export const semanticTokens = [
	{ token: '--background', maps: '--paper' },
	{ token: '--foreground', maps: '--ink' },
	{ token: '--card', maps: '--paper' },
	{ token: '--card-foreground', maps: '--ink' },
	{ token: '--popover', maps: '--paper' },
	{ token: '--popover-foreground', maps: '--ink' },
	{ token: '--primary', maps: '--ink' },
	{ token: '--primary-foreground', maps: '--paper' },
	{ token: '--secondary', maps: '--ink-10' },
	{ token: '--secondary-foreground', maps: '--ink' },
	{ token: '--muted', maps: '--ink-10' },
	{ token: '--muted-foreground', maps: '--ink-60' },
	{ token: '--accent', maps: '--ink' },
	{ token: '--accent-foreground', maps: '--paper' },
	{ token: '--destructive', maps: '--ink (no red)' },
	{ token: '--border', maps: '--ink-25' },
	{ token: '--input', maps: '--ink-25' },
	{ token: '--ring', maps: '--ink-40' },
	{ token: '--chart-1', maps: '--ink' },
	{ token: '--chart-2', maps: '--ink-60' },
	{ token: '--chart-3', maps: '--ink-40' },
	{ token: '--chart-4', maps: '--ink-25' },
	{ token: '--chart-5', maps: '--ink-10' },
	{ token: '--sidebar', maps: '--paper' },
	{ token: '--sidebar-foreground', maps: '--ink' },
	{ token: '--sidebar-primary', maps: '--ink' },
	{ token: '--sidebar-primary-foreground', maps: '--paper' },
	{ token: '--sidebar-accent', maps: '--ink-10' },
	{ token: '--sidebar-accent-foreground', maps: '--ink' },
	{ token: '--sidebar-border', maps: '--ink-25' },
	{ token: '--sidebar-ring', maps: '--ink-40' },
	{ token: '--radius', maps: '0' }
];

export const siteCoverage = [
	{ layer: 'Tokens', item: 'Paper / ink, shadcn map, type, spacing, radius', id: 'T1–T5' },
	{ layer: 'Sub-atomic', item: 'Hairlines, hatch, grid, inversion, focus', id: 'S1–S4' },
	{ layer: 'Atoms', item: 'ui/* + Atlas primitives (Action, Mark, Tab…)', id: 'A1–A8' },
	{
		layer: 'Molecules',
		item: 'Field, IndexRow, engineer row, empty, code, design gallery',
		id: 'M1–M6'
	},
	{ layer: 'Organisms', item: 'StatusBar, IndexTree, ReadingPane, HintBar', id: 'O1–O4' },
	{ layer: 'Templates', item: 'Four-zone shell', id: 'L1' },
	{ layer: 'Pages', item: '/', id: 'P1' },
	{ layer: 'Pages', item: '/design', id: 'P2' },
	{ layer: 'Pages', item: '/design/[slug] — Doppio sample', id: 'P3' },
	{ layer: 'Pages', item: '/engineer', id: 'P4' },
	{ layer: 'Pages', item: '/engineer/telescopic', id: 'P5' },
	{ layer: 'Pages', item: '/engineer/microscopic', id: 'P6' },
	{ layer: 'Pages', item: '/engineer/animation-vocabulary', id: 'P7' },
	{ layer: 'Pages', item: '/engineer/minesweeper', id: 'P8' },
	{ layer: 'Pages', item: '/blog', id: 'P9' },
	{ layer: 'Pages', item: '/blog/posts/[slug]', id: 'P10' },
	{ layer: 'Pages', item: '/styles', id: 'P11' },
	{ layer: 'Out of scope', item: '/anh-nhi — birthday invitation, not site chrome', id: '—' }
];
