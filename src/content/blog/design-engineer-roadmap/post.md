---
title: 'The Design Engineer roadmap I built for myself'
description: >
  I forked roadmap.sh and mapped the skills I actually needed as a designer
  learning to ship UI. Here's the written version — four phases, spiral learning,
  and the gap between a Figma file and something that feels alive.
date: '2026-08-24'
published: true
thumbnail: './design-engineer-roadmap.avif'
---

![The Design Engineer roadmap](./design-engineer-roadmap.avif)

I used to think "Design Engineer" was a fancy way to say designer who can open VS Code.

Then I started shipping real UI. The job got more specific. A modal that "works" is not the same as a modal that feels right — focus trap, enter/exit motion, the empty state, the error state, the reduced-motion fallback. Designers notice. Users feel it. Most handoffs drop it.

So I built a roadmap for the role I was actually growing into. It lives on a fork of [roadmap.sh](https://roadmap.sh): [quang-design/developer-roadmap](https://github.com/quang-design/developer-roadmap/tree/feat/design-engineer-roadmap/src/data/roadmaps/design-engineer), with eighty topic files and curated resources. This post is the version you can read without clicking eighty boxes.

## What this role is (and isn't)

A Design Engineer is not a designer who codes a little. Not a frontend engineer with good taste. Native to both.

You write production HTML, CSS, TypeScript. You also have opinions about type hierarchy, spacing, and whether that 200ms ease-out is lying. You sit in Figma and in the component file. You close the fidelity gap because you speak both languages.

The adjacent roles are useful for contrast:

- **Frontend engineer** — features, state, data, architecture. The UI can be correct and still feel cheap.
- **UX designer** — research, flows, wireframes. The work usually stops at the handoff.
- **Design Engineer** — owns the feel. Micro-interactions, tokens, component APIs, accessibility. Sometimes the fastest way to refine a design is to build it.

Companies that care about craft hire for this (Vercel, Linear, Stripe, Figma). The title on the listing might say UI Engineer, Creative Developer, or Design Technologist. Same gap.

## How to learn it: spiral, not a ladder

I did not become useful by finishing CSS, then finishing JavaScript, then unlocking React.

I touched everything once, built something ugly, came back, built something less ugly. The roadmap is structured that way on purpose.

**Phase 1 — Foundation (4 weeks).** Surface-level on every major idea. You are drawing a map, not mastering terrain.

**Phase 2 — Building (6 weeks).** Same topics, more depth. Real projects that combine React, Figma, and motion. Start asking why, not just how.

**Phase 3 — Professional (8 weeks).** Design systems, component architecture, animation that holds up in production, accessibility you can defend.

**Phase 4 — Mastery (ongoing).** AI as a force multiplier, portfolio, interviews, the boring excellence of QA and performance.

Linear learning forgets week one while you grind week twelve. Spiral learning keeps the connections warm.

## Phase 1: Foundation

### Philosophy & identity

Start here even if it feels soft. The rest of the map only makes sense if you know what you are optimizing for.

- What is Design Engineering
- The Design Engineer mindset
- DE vs frontend vs UX
- Working with designers
- Spiral learning
- Philosophy reads

The reads I keep coming back to:

- [Resilient Web Design](https://resilientwebdesign.com/) — Jeremy Keith
- [A Dao of Web Design](https://alistapart.com/article/dao/) — John Allsopp
- [Refactoring UI](https://www.refactoringui.com/) — Adam Wathan & Steve Schoger
- [Just JavaScript](https://justjavascript.com/) — Dan Abramov & Maggie Appleton
- [The Craft of UI](https://rauno.me/craft) — Rauno Freiberg

### Core technologies

HTML, CSS, JavaScript. Not "enough to fake it." Enough to read a component and know why it broke.

### Design basics

Typography, color, layout, visual hierarchy. If you came from design, this is review. If you came from engineering, this is the part that makes your UI stop looking like a tutorial.

### Tools

Git and GitHub. You cannot collaborate without them. You also cannot build in public without them.

## Phase 2: Building

### React & TypeScript

The industry stack for this role is still React. I ship this site in Svelte — the ideas transfer. Components, props, state, types. Learn the patterns, not the brand of framework.

### Styling

Tailwind. Tokens in your pocket. Constraint is the point.

### Design-to-code

- Reading Figma files
- Figma Dev Mode
- Pixel-perfect implementation

Pixel-perfect is not pixel-slavery. It means you can hit the spec, then you know when you are choosing to deviate — and you talk about it before you ship.

### Animation basics

CSS transitions, CSS animations, motion principles, hover and focus states.

If you only learn one animation rule: respect `prefers-reduced-motion`. Craft that ignores that preference is not craft.

## Phase 3: Professional

This is where the work starts looking like a job.

### Design systems

Fundamentals, then tokens: color, type, spacing. Then the plumbing — Style Dictionary, Tokens Studio. A button that exists in Figma and in code as two unrelated objects will drift. Tokens are how you stop lying to yourself.

### Component architecture

- Component API design
- Compound components
- Polymorphic components
- CVA (Class Variance Authority)

A Design Engineer who cannot design a component API will drown in props. `variant`, `size`, `asChild` — these are design decisions that happen in TypeScript.

### Animation / Framer Motion

Framer Motion (or the equivalent in your framework): variants, gestures, layout animations, spring physics, AnimatePresence, scroll, micro-interactions.

This is the part people screenshot. It is also the part that becomes inaccessible junk if you skip Phase 1.

### Accessibility

Fundamentals, semantic HTML, ARIA patterns, focus management, reduced motion.

A pretty dialog you cannot Tab out of is a bug. Ship it anyway and you are not doing this job.

### UI patterns & libraries

Radix UI, shadcn/ui, forms, modals, dropdowns, toasts. Steal the unsolved problems (focus, keyboard, portal). Write the visual layer yourself. That split is the whole job.

On this site I use bits-ui for the same reason: primitives, then my own skin.

### UI states

Loading, empty, error, dark mode. The happy path is maybe 40% of the interface. The rest is how it fails.

### Tools

Storybook. Next.js if that is your host. Document the component like someone else has to use it — because they will, and that someone is often future-you.

## Phase 4: Mastery

### AI tools

v0, Cursor, Copilot, prompting, reviewing AI output, the Vercel AI SDK.

I prototyped my first AI project on a phone during lunch. The model will generate a component. Your job is to notice that the padding is 13px, the focus ring vanished, and the motion ignores reduced-motion. Generate faster. Review harder.

### Career

- Portfolio strategy
- Case study writing
- Technical interviews
- Design critique
- Career progression
- Building in public
- Open source

Three projects with a real writeup beat ten Dribbble-core landing pages. Your personal site is a portfolio piece. If it is slow, inaccessible, or a template with your name swapped in, that is also a signal.

### Advanced skills

React hooks for this work, responsive design, SVG, CSS custom properties, component docs, performance, design QA.

Design QA is the adult version of "does it match the file?" Check spacing, type, motion, states, and whether the component still works when the copy is too long.

## A note on time

If you already write frontend and you can see type, maybe 3–6 months of focused polish work.

If you are a designer learning to code — that was me — give it 6–12 months. HTML feels easy until state shows up. State feels easy until you have to name a component API.

If you are starting from zero, plan for a year and a bit. You can ship small things much earlier. The roadmap is not a gate. It is a map.

## How I actually use this

I do not walk the graph in order. I pick the most constrained problem in front of me.

Shipping a dialog? Modals, focus, motion, reduced-motion.

Putting a system in a product? Tokens, CVA, Storybook.

Publishing a post? Case study writing, which is really: why this easing, what broke, what I would not do again.

The eighty topic files with links are in the [roadmap repo](https://github.com/quang-design/developer-roadmap/blob/feat/design-engineer-roadmap/src/data/roadmaps/design-engineer/design-engineer.json). This post is the spine.

Designer who learned to code, or engineer who learned to see — same road. Different on-ramp. The work is in the details nobody put in the ticket.
