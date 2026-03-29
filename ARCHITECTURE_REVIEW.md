# Architecture Review: quang.design through the Parnas 1979 Lens

**Paper:** "Designing Software for Ease of Extension and Contraction" (Parnas 1979)

Parnas argues software should be designed so you can **extend** (add features) and **contract** (strip features) without rewriting everything. He identifies the "uses" relation, minimal subsets, and information hiding as keys.

---

## The Good: Parnas Would Nod Approvingly

### Content Loader Factory = Textbook Information Hiding

`createContentParser` in `lib/content/loader.ts` hides glob import mechanics, frontmatter parsing, and URL rewriting behind a clean interface. Adding a new content section takes ~3 lines. Removing one means deleting one file. This is the "minimal subset" Parnas advocated.

### Component-Scoped State

No global store, no shared mutable state leaking across modules. Each component is a self-contained module hiding its own secrets via Svelte 5's `$state` runes.

---

## The Bad: Parnas Would Reach for His Red Pen

### 1. Navbar Violates the "Uses" Relation Hierarchy

Hard-coded route links in `navbar.svelte`:

```ts
const navLinks = [
  { label: 'Design', href: '/design' },
  { label: 'Engineer', href: '/engineer' },
  { label: 'Blog', href: '/blog' }
];
```

The navbar **knows about every section** — a secret that isn't hidden. Add a section → edit the navbar. Remove a section → edit the navbar. Parnas calls this the "chain of data transforming modules" anti-pattern. The navbar should *discover* sections, not *enumerate* them.

**Fix:** Data-driven navigation from a single config source.

### 2. Design Post Page is a "God Module"

`/src/routes/design/[slug]/+page.svelte` (~155 lines) handles markdown parsing with regex, block type classification, gallery rendering, metadata display, AND layout composition.

Parnas: *"You've assigned two responsibilities to a single module that should have been two."* You can't contract the gallery feature without gutting this file. You can't extend the layout system without touching rendering logic.

**Fix:** Extract `parseDesignMarkdown()` utility + separate `DesignPostGallery` and `DesignPostMetadata` components.

### 3. Two Incompatible Markdown Rendering Strategies

- Blog posts: `svelte-exmarkdown` with custom snippets
- Design posts: hand-rolled regex parsing (`<!-- 2col -->`, `![` detection)

When two modules solve the same problem differently, you've created a "uses" graph with no shared minimal subset. Want to add callout blocks to all content types? You'll implement it twice, differently.

**Fix:** Unify rendering approach or create a shared markdown directive system.

### 4. Content Loaders: DRY Violation Masquerading as Separation

```ts
// blog.ts — one line calling the factory
// design.ts — one line calling the factory
// engineering.ts — one line calling the factory
```

Three files hiding the *same* secret three times. A config map would suffice:

```ts
export const loaders = {
  blog: createContentParser('blog'),
  design: createContentParser('design'),
  engineering: createContentParser('engineering'),
};
```

### 5. AI Components Tightly Coupled to API Route Paths

`TextEditor` hard-codes `/api/microscopic`, `EditableText` hard-codes `/api/telescopic`. Parnas calls this "using a module by name" — the consumer knows the implementation's address, not just its interface.

**Fix:** Inject API paths via props or a config module.

---

## The Ugly: Contractibility Failures

Parnas's most underrated insight is about **contraction** — can you ship a *smaller* version?

| Remove...              | Steps Required                                           | Verdict    |
|------------------------|----------------------------------------------------------|------------|
| Microscopic tool       | Route dir + API endpoint + types + components + edit engineer hub page (hard-coded links) | 5+ locations, **modification required** |
| Blog section           | Content dir + loader + route dir + **edit navbar**       | Modification in unrelated module |
| Subscribe feature      | `subscribe.svelte` + `/api/subscribe` + remove usage     | **Clean removal** |
| Theme toggle           | Remove `mode-watcher` usage in layout                    | **Clean removal** |
| Analytics              | Remove library calls in root layout                      | **Clean removal** |

Parnas: *"A program should be designed so that any subset can be obtained by deleting, not modifying."*

**Pattern:** Features added as self-contained components (subscribe, theme, analytics) are easy to contract. Features that reach into shared infrastructure (navbar, hub pages) are not.

---

## Extensibility Scorecard

| Dimension                  | Score | Notes                                          |
|----------------------------|-------|------------------------------------------------|
| Adding content sections    | 9/10  | Factory pattern makes this trivial             |
| Adding new pages           | 7/10  | Easy routing, but navbar needs manual update   |
| Changing layout systems    | 4/10  | God component + regex parsing = surgery        |
| Swapping AI providers      | 3/10  | Hard-coded API paths + prompts in route files  |
| Removing features          | 6/10  | Mixed — some clean, some require multi-file edits |

**Overall: B- on extension, C+ on contraction**

---

## Recommendations (Priority Order)

1. **Data-driven navigation** — single config source for routes and nav links
2. **Extract design post parser** — separate parsing from rendering
3. **Unify markdown rendering** — one approach, not two
4. **Consolidate content loaders** — config map instead of duplicate files
5. **Inject API dependencies** — paths as config, not hard-coded strings
6. **Extract AI service layer** — shared `callClaude()` utility for both endpoints

---

## Conclusion

The content system is genuinely well-designed for extension. But cross-cutting concerns (navigation, layout rendering, API coupling) violate information hiding in ways that make both extension and contraction require surgery across multiple files.

The irony: you built a great factory pattern for content — then hard-coded everything *around* it. It's like building a modular house on a foundation of concrete that encases all the plumbing.

**Parnas's prescription:** Make the navbar data-driven, unify markdown rendering, extract the design page parser, and inject API paths. Then you'll have a system as easy to *shrink* as it is to grow.
