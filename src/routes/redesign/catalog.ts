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

export const inventory = [
	{
		layer: 'Tokens',
		current: 'src/app.css :root / .dark / @theme inline',
		next: 'paper / ink fills the full shadcn-svelte variable set'
	},
	{
		layer: 'Tokens',
		current: 'blue-500 links + 0.3s underline; p leading-7; --spacing 0.2rem',
		next: 'inherit + inversion; Tailwind --text-* and --spacing'
	},
	{
		layer: 'Tokens',
		current: '--radius 0 already, but ui still uses rounded-lg / ring-3 / shadow-md',
		next: '--radius 0 + data-slot overrides (no ring, no radius, no shadow)'
	},
	{
		layer: 'Sub-atomic',
		current: 'shared/horizontal-divider (1px)',
		next: 'Rule 0.5px; stacks share one line; double = emphasis'
	},
	{
		layer: 'Atoms',
		current: 'ui/button (tv, data-slot, ring-3)',
		next: 'hairline, uppercase, instant invert, ghost has no border'
	},
	{
		layer: 'Atoms',
		current: 'ui/input, ui/textarea (h-8, rounded-lg, ring-3)',
		next: '0.5px hair, 0 radius, hairline outline, h-8'
	},
	{
		layer: 'Atoms',
		current: 'ui/badge, ui/kbd',
		next: 'square badge; kbd only for real shortcuts'
	},
	{
		layer: 'Atoms',
		current: 'ui/avatar, ui/separator, ui/spinner',
		next: 'square hair; 0.5px rule; spinner spins'
	},
	{
		layer: 'Atoms',
		current: 'ui/select — mobile navbar',
		next: 'removed from chrome; desktop and mobile use IndexTree'
	},
	{
		layer: 'Atoms',
		current: 'ui/sonner',
		next: 'kept for subscribe toasts, restyled to paper/ink'
	},
	{
		layer: 'Atoms',
		current: 'navbar sun/moon Button',
		next: 'original sun/moon toggle in the status bar'
	},
	{
		layer: 'Molecules',
		current: 'shared/subscribe (Input + Button + toast)',
		next: 'shared hairline stack, matching height, mail icon'
	},
	{
		layer: 'Molecules',
		current: 'shared/post-card',
		next: 'IndexRow — Option A, brand display on design'
	},
	{
		layer: 'Molecules',
		current: 'engineer cards',
		next: 'IndexRow + project icon'
	},
	{
		layer: 'Molecules',
		current: 'shared/empty-state',
		next: 'dashed 0.5px + hatch'
	},
	{
		layer: 'Molecules',
		current: 'markdown/code-block',
		next: 'hairline box, no theme background'
	},
	{
		layer: 'Organisms',
		current: 'shared/navbar',
		next: 'StatusBar — Welcome to / quang.design'
	},
	{
		layer: 'Organisms',
		current: 'shared/footer',
		next: 'quote + subscribe field; no shortcut hint bar'
	},
	{
		layer: 'Organisms',
		current: 'markdown renderer',
		next: 'original content, restyled; metadata in the reading column'
	},
	{
		layer: 'Templates',
		current: '+layout.svelte max-w-7xl column + Navbar/Footer',
		next: 'four-zone shell on the 24px grid'
	},
	{
		layer: 'Pages',
		current: '/ /design /design/[slug] /engineer + tools /blog /blog/posts /styles',
		next: 'live routes, same chrome'
	},
	{
		layer: 'Out of scope',
		current: '/anh-nhi and /anh-nhi/[slug]',
		next: 'unchanged'
	}
];
