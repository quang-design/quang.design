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
		atlas: '.atlas fills the full shadcn-svelte variable set (OKLCH, charts, sidebar)'
	},
	{
		layer: 'Tokens',
		current: 'blue-500 links + 0.3s underline; p leading-7; --spacing 0.2rem',
		atlas: 'inherit + inversion; retheme --text-* and --spacing (no parallel --fs scale)'
	},
	{
		layer: 'Tokens',
		current: '--radius 0 already, but ui still uses rounded-lg / ring-3 / shadow-md',
		atlas: '--radius 0 + data-slot overrides (no ring, no radius, no shadow)'
	},
	{
		layer: 'Sub-atomic',
		current: 'shared/horizontal-divider (1px)',
		atlas: 'Rule 0.5px; stacks share one line; double = emphasis'
	},
	{
		layer: 'Atoms',
		current: 'ui/button (tv, data-slot, ring-3, default cursor)',
		atlas: 'token restyle + Action (uppercase, pointer, invert)'
	},
	{
		layer: 'Atoms',
		current: 'ui/input, ui/textarea (h-8, rounded-lg, ring-3)',
		atlas: '0.5px hair, 0 radius, hairline outline'
	},
	{
		layer: 'Atoms',
		current: 'ui/badge, ui/kbd, ui/kbd-group (pill / rounded-sm)',
		atlas: 'square badge; HintKey for shortcuts'
	},
	{
		layer: 'Atoms',
		current: 'ui/avatar* (round, after-border), ui/separator 1px, ui/spinner spin',
		atlas: 'square hair; 0.5px rule; spinner static'
	},
	{
		layer: 'Atoms',
		current: 'ui/select* (portal, rounded-lg, animate-in) — mobile navbar',
		atlas: 'token restyle, portal disabled in preview; desktop uses IndexTree'
	},
	{
		layer: 'Atoms',
		current: 'ui/sonner (lucide status icons, spin loader)',
		atlas: 'inverted Mark toast, no hue, no spin'
	},
	{
		layer: 'Atoms',
		current: 'navbar sun/moon Button (scale + rotate)',
		atlas: 'Action “Ink theme” — instant invert, no tween'
	},
	{
		layer: 'Atoms',
		current: 'shadcn Label / Field not installed',
		atlas: 'MicroLabel is the label atom; Field is composed in molecules'
	},
	{
		layer: 'Molecules',
		current: 'shared/subscribe (Input + Button + toast)',
		atlas: 'MicroLabel + Input + Action (shadcn Field pattern)'
	},
	{
		layer: 'Molecules',
		current: 'shared/post-card (scale thumbnail, p-6, text-2xl)',
		atlas: 'IndexRow — thumb, date = title (text-base), desc text-xs'
	},
	{
		layer: 'Molecules',
		current: 'engineer/+page.svelte cards (ArrowUpRight, hover fill)',
		atlas: 'IndexRow + KeySlot codes E1–E4'
	},
	{
		layer: 'Molecules',
		current: 'shared/empty-state (dashed-2, rounded, lucide)',
		atlas: 'dashed 0.5px + hatch'
	},
	{
		layer: 'Molecules',
		current: 'markdown/code-block (Shiki, zinc chrome, rounded-xl)',
		atlas: 'hairline box, no theme background'
	},
	{
		layer: 'Organisms',
		current: 'shared/navbar (avatar, slash links, clock, theme)',
		atlas: 'StatusBar'
	},
	{
		layer: 'Organisms',
		current: 'shared/footer (quote, copyright, Subscribe)',
		atlas: 'HintBar; subscribe moves to a field'
	},
	{
		layer: 'Organisms',
		current: 'markdown/renderer + design-renderer (semibold h, blue a, amber quote)',
		atlas: 'ReadingPane — labels, Mark, text-lg prose'
	},
	{
		layer: 'Templates',
		current: '+layout.svelte max-w-7xl column + Navbar/Footer',
		atlas: 'four-zone Shell — stack / 768 / 1024'
	},
	{
		layer: 'Pages',
		current: '/ /design /design/[slug] /engineer + tools /blog /blog/posts /styles',
		atlas: 'P1–P11'
	},
	{
		layer: 'Out of scope',
		current: '/anh-nhi and /anh-nhi/[slug] (Tenor Sans, full-bleed)',
		atlas: 'unchanged — no site chrome, no Atlas tokens'
	},
	{
		layer: 'Out of scope',
		current: 'shared/seo-head',
		atlas: 'no visual change'
	}
];
