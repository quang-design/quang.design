---
name: testing-quang-design
description: Test the quang.design portfolio site end-to-end. Use when verifying UI changes, component updates, or SvelteKit behavior.
---

# Testing quang.design

## Setup

```bash
cd /home/ubuntu/repos/quang.design
pnpm dev --host
# Runs on http://localhost:5173 (or next available port)
```

No secrets or credentials needed for local testing.

## Key Pages to Verify

| Page | URL | What to check |
|------|-----|---------------|
| Home | `/` | Layout renders, clock ticks, theme auto-sets based on time |
| Engineer | `/engineer` | Project cards with external link icons (ArrowUpRight) |
| Blog post with code | `/blog/posts/security-headers-sveltekit` | Shiki syntax highlighting loads (async via $effect) |
| Design | `/design` | Grid of design projects with thumbnails |
| Blog | `/blog` | List of blog posts |

## Critical Flows

### 1. Theme Toggle
- The theme auto-sets based on time: light 6AM–6PM, dark otherwise
- Click the sun/moon button in top-right of navbar to toggle manually
- Verify: background color changes, icon swaps (sun↔moon)

### 2. Navbar Clock
- Shows time in HH:MM:SS AM/PM format
- Initially displays `--:--:--` before $effect initializes (brief flash)
- Wait 2-3 seconds and verify seconds increment

### 3. Code Block Highlighting
- Navigate to `/blog/posts/security-headers-sveltekit`
- Scroll to code blocks
- Shiki loads async — may take 1-2 seconds to colorize
- Verify: keywords, strings, and comments render in distinct colors
- Uses light-dark() theme: "vitesse-light" in light mode, "night-owl" in dark mode

### 4. Navigation
- Desktop: text links separated by "/" in navbar
- Mobile (<640px): Select dropdown for navigation
- Click links to verify SvelteKit client-side routing

## Known Dev-Mode Console Messages

These are expected and do NOT indicate bugs:
- `[Vercel Web Analytics] Failed to load script` — analytics only works on vercel.com domains
- `[Vercel Speed Insights] Failed to load script` — same as above
- `FedCM get() rejects with NetworkError` — browser-level, unrelated
- `"updated at" in $effect (+layout.svelte)` — Svelte 5 dev-mode hydration warning when $effect calls setMode() during init. Does NOT appear in production builds. App functions correctly.

## Verification Commands

```bash
pnpm check    # svelte-check — 0 errors expected
pnpm lint     # eslint — 1 @html warning acceptable
pnpm build    # Production build — should succeed
pnpm test     # Vitest — pass with no test files
```

## Vercel Preview Deploys

PR preview deploys may be behind Vercel SSO authentication. If blocked, use local dev server instead. The preview URL pattern is:
`https://quang-design-git-<branch-name>-quang-project.vercel.app`

## Devin Secrets Needed

None required for local testing.
