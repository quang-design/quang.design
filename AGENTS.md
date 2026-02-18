## Project: quang.design

Personal portfolio site for a Design Engineer. Key facts for working in this codebase:

- **Framework**: Svelte 5 (runes) + SvelteKit 2, deployed on Vercel
- **Styling**: TailwindCSS v4 (no config file — uses CSS-based config in `src/app.css`)
- **UI components**: bits-ui primitives under `src/lib/components/ui/`
- **Package manager**: pnpm
- **AI**: Anthropic Claude SDK used in `/api/telescopic` and `/api/microscopic` server routes
- **Email**: Resend used in `/api/subscribe`
- **Content**: Markdown files in `src/content/{blog,design}/` with gray-matter frontmatter; loaded via `src/lib/content/loader.ts`
- **Dark mode**: time-based auto-switch via mode-watcher (light 6am–6pm, dark otherwise)
- **Fonts**: Commit Mono (self-hosted in `static/fonts/`)
- **Routes**: `/` (home), `/design`, `/engineer`, `/blog`, plus sub-routes for AI tools and minesweeper

When adding new content sections, follow the pattern in `src/lib/content/` (see `blog.ts`, `design.ts`).
When adding new UI components, place them in `src/lib/components/ui/` and follow bits-ui conventions.

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

### 5. Keep code as simple as possible

Remember to keep your code as simple as possible. If you find yourself writing complex code, consider breaking it down into smaller, simpler components or functions. This will make the code easier to understand and reduce the need for comments.
