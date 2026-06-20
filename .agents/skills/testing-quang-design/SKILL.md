---
name: testing-quang-design
description: Test the quang.design personal site end-to-end. Use when verifying UI changes, navigation, theme toggle, clock, or code block rendering.
---

# Testing quang.design

## Environment Setup

```bash
cd /home/ubuntu/repos/quang.design
pnpm dev  # Starts on localhost:5173 (or next available port like 5175)
```

The dev server uses Vite with HMR. Wait for "ready in Xms" before testing.

## Key Test Areas

### 1. Mobile Dropdown Navigation (< 640px viewport)

The mobile nav uses a `Select` component from bits-ui (via shadcn-svelte). It shows a dropdown trigger with the current page label.

**How to test:**
- Open Chrome DevTools responsive mode (F12 → toggle device toolbar) at 400px width
- Click the Select trigger (shows current page name like "Quang")
- Select a different page (e.g. "Engineer")
- Verify: URL changes, page content updates, trigger text updates

**Common issues:**
- If clicking items doesn't navigate: check that `onValueChange` callback is on `Select.Root`, NOT `onclick` on `Select.Item`. The bits-ui Select component doesn't reliably propagate onclick through its wrapper layers.
- If value doesn't reflect current page: ensure `value` prop uses the reactive `$derived` value (one-way binding), not `bind:value` (two-way conflicts with derived state).

### 2. Navbar Clock

The clock uses `SvelteDate` with a 1-second interval.

**How to test:**
- Observe time in navbar, note seconds
- Wait 3+ seconds
- Verify seconds advance

**Common issues:**
- Clock shows "--:--:--" or freezes: likely the initialization is in `$effect` instead of `onMount`. The clock MUST use `onMount` because `$effect` can fire during hydration and conflict with mode-watcher's theme initialization. Use `onMount` for "run once post-hydration" side effects.

### 3. Theme Toggle

Uses mode-watcher with time-based defaults (light 6AM-6PM, dark otherwise).

**How to test:**
- Click sun/moon icon in top-right
- Verify: background color changes, icon swaps
- Check browser console for hydration errors

**Common issues:**
- Theme doesn't apply on load: `setMode()` must be in `onMount`, not `$effect`. Using `$effect` causes a hydration state conflict with mode-watcher.

### 4. Code Block Syntax Highlighting

Uses Shiki loaded async in a custom `code-block.svelte` component.

**How to test:**
- Navigate to `/blog/posts/security-headers-sveltekit`
- Scroll to first code block
- Wait 2s for Shiki to load
- Verify: multi-color highlighting (keywords blue/purple, strings green/orange, comments grey)

**Notes:**
- The code-block component correctly uses `$effect` (reactive dependency tracking on `codeElement`).
- Styles use Tailwind `[&_span]:` selectors instead of `:global()` — verify no style leakage.

### 5. Desktop Navigation

Standard `<a>` links in the navbar (visible at >= 640px viewport).

**How to test:**
- Click nav links (Quang, Design, Engineer, Blog)
- Verify URL and page content update

## Architecture Notes

- **Package manager:** pnpm
- **Framework:** SvelteKit 2 + Svelte 5 (runes)
- **UI:** shadcn-svelte v1.3.0 + bits-ui ^2.17.3
- **Styling:** TailwindCSS v4 (CSS-based config)
- **Deploy:** Vercel (preview URLs appear on PRs)
- **Breakpoints:** sm = 640px (mobile/desktop nav switch)

## Key Distinction: $effect vs onMount

- `onMount`: Use for "run once after hydration" side effects (clock interval, theme init)
- `$effect`: Use for reactive dependency tracking (watching DOM elements, reacting to state changes)
- Mixing these up causes hydration errors that silently break subsequent client-side functionality
