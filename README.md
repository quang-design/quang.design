# quang.design

My personal website and playground as a Design Engineer learning to code.

## About Me

I'm a Design Engineer on a journey to master coding. This site is both my portfolio and my learning laboratory—a place where design meets development.

### My Coding Journey

**2023: The Beginning**

In 2023, our company pivoted to focus on news and media, making our website the star of the show. We were pumped about this shift, and I was eager to see where it would take us.

I stumbled upon Webflow, an awesome tool for creating good-looking websites without needing to be a coder. But I quickly realized that knowing a bit about HTML, CSS, and JavaScript would help me push the boundaries of what I could create. So, I signed up for a Web Development course on Codecademy.

This course was a breath of fresh air compared to the usual drill of endless videos or text-heavy lessons. It was interactive and hands-on—exactly what I needed.

Initially, my goal was simple: understand web fundamentals to improve my design work. But I got hooked. I completed both the Front-end and Back-end courses, and the joy of learning was addictive.

**The AI Revolution**

Then came ChatGPT, and as you know, it's a game-changer. Even with basic knowledge, you can do so much more. We began building small web apps and integrating them with our websites.

My first project was "small-steps", a site powered by OpenAI's API that helps break down daunting tasks into manageable chunks. Check it out: https://lnkd.in/gqNAJqdx

I created the prototype during my lunch break using just my phone! I'd describe my idea to ChatGPT, which would generate the code, then use the Replit iOS app to preview it. This was a lightbulb moment for me about how potent and user-friendly future tools would be. Now you can create a website with just a text prompt! Tools like gpt-engineer, v0 by Vercel, and Relume AI Site Builder are changing everything 🤯

**2024: Going Deeper**

For 2024, my aim was similar to when I started with web development: explore Generative AI more deeply. I enrolled in VietAI's Foundation of Machine Learning course to understand the technology powering these incredible tools.

**2025 and Beyond**

Now I'm building this site with SvelteKit, continuing to learn by doing. Every component, every interaction, every line of code is a step forward in my journey from designer to Design Engineer.

## Tech Stack

- **Svelte 5 + SvelteKit 2** - Web framework with runes-based reactivity
- **TypeScript** - Type safety throughout
- **TailwindCSS v4** - Utility-first styling
- **bits-ui** - Headless UI primitives
- **Shiki** - Syntax highlighting for code blocks
- **svelte-exmarkdown** - Markdown rendering
- **gray-matter** - Frontmatter parsing for content
- **Anthropic Claude** - AI features (telescopic/microscopic text)
- **Resend** - Email (newsletter subscribe)
- **Vercel** - Hosting (adapter-vercel, analytics, speed insights)
- **mode-watcher** - Auto dark/light mode (time-based: light 6am–6pm)

## Project Structure

```
src/
├── content/          # Markdown content (blog/, design/)
├── lib/
│   ├── components/
│   │   ├── markdown/ # Markdown renderer components
│   │   ├── shared/   # Navbar, Footer, PostCard, SeoHead, Subscribe
│   │   └── ui/       # bits-ui based components
│   ├── content/      # Content loaders (blog.ts, design.ts, engineering.ts)
│   └── utils/
└── routes/
    ├── /             # Home (3-column markdown layout)
    ├── /design       # Design portfolio (markdown posts)
    ├── /engineer     # Engineering projects index
    │   ├── /telescopic   # AI telescopic text tool
    │   ├── /microscopic  # AI microscopic text tool
    │   └── /minesweeper  # Minesweeper game
    ├── /blog         # Blog posts (markdown)
    ├── /api/
    │   ├── /telescopic   # Claude API endpoint
    │   ├── /microscopic  # Claude API endpoint
    │   └── /subscribe    # Resend email subscribe
    ├── /llms.txt     # LLM-friendly site index
    └── /sitemap.xml  # Auto-generated sitemap
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type check
pnpm check
```
