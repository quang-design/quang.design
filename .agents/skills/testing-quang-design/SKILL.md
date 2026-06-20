---
name: testing-quang-design
description: Test the quang.design portfolio site end-to-end. Use when verifying UI changes, component updates, or SvelteKit behavior.
---

# Testing quang.design

## Setup

```bash
cd /home/ubuntu/repos/quang-design
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
- The theme auto-sets based on time: light 6AM-6PM, dark otherwise
- Click the sun/moon button in top-right of navbar to toggle manually
- Verify: background color changes, icon swaps (sun/moon)

### 2. Navbar Clock
- Shows time in HH:MM:SS AM/PM format
- Initially displays `--:--:--` before $effect initializes (brief flash)
- Wait 2-3 seconds and verify seconds increment

### 3. Code Block Highlighting
- Navigate to `/blog/posts/security-headers-sveltekit`
- Scroll to code blocks
- Shiki loads async -- may take 1-2 seconds to colorize
- Verify: keywords, strings, and comments render in distinct colors
- Uses light-dark() theme: "vitesse-light" in light mode, "night-owl" in dark mode

### 4. Navigation
- Desktop: text links separated by "/" in navbar
- Mobile (<640px): Select dropdown for navigation
- Click links to verify SvelteKit client-side routing

## Known Dev-Mode Console Messages

These are expected and do NOT indicate bugs:
- `[Vercel Web Analytics] Failed to load script` -- analytics only works on vercel.com domains
- `[Vercel Speed Insights] Failed to load script` -- same as above
- `FedCM get() rejects with NetworkError` -- browser-level, unrelated
- `"updated at" in $effect (+layout.svelte)` -- Svelte 5 dev-mode hydration warning when $effect calls setMode() during init. Does NOT appear in production builds. App functions correctly.

## Verification Commands

```bash
pnpm check    # svelte-check -- 0 errors expected
pnpm lint     # prettier + eslint -- may have pre-existing prettier warning on .agents/ SKILL.md files
pnpm build    # Production build -- should succeed
pnpm test     # Vitest -- pass with no test files
```

## Vercel Preview Deploys

PR preview deploys are behind Vercel SSO authentication. Use local dev server instead. The preview URL pattern is:
`https://quang-design-git-<branch-name>-quang-project.vercel.app`

## Dependency Updates

When testing after dependency updates (especially major version bumps), focus on:
- SSR correctness: blog posts render with frontmatter parsed (gray-matter + js-yaml)
- Code highlighting: Shiki renders with colors in code blocks
- Adapter: build succeeds with @sveltejs/adapter-vercel (check `pnpm build` output)
- pnpm overrides: if overrides exist in package.json, verify they don't break transitive deps (e.g. js-yaml override must be scoped to `^4` to avoid breaking gray-matter which uses js-yaml 3.x)

## Devin Secrets Needed

None required for local testing.
