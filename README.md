# uzziel.dev

**Live:** [uzziel.dev](https://uzziel.dev) (also [uzziel-portfolio.netlify.app](https://uzziel-portfolio.netlify.app) until DNS propagates)

Personal site of Emmanuel Uzziel A. Malolos — full-stack creator and ACEU AI Solutions co-founder from Bay, Laguna. The site catalogs shipped and in-progress projects across indie games, AI systems, mobile apps, volunteer web work, and small-business tools.

## Stack

- [Astro 4](https://astro.build) — static site generator
- [React 18](https://react.dev) — interactive islands only
- [Tailwind CSS 3](https://tailwindcss.com) — class-based dark mode
- [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering) — motion
- [MDX](https://mdxjs.com) content collections — case studies

## Local development

Prerequisites: Node 20 or newer.

```bash
npm install
npm run dev
```

Dev server runs on http://localhost:4321.

## Build & preview

```bash
npm run build      # outputs to dist/
npm run preview    # serves dist/ on http://localhost:4321
```

## Adding a new project

1. Create `src/content/work/{slug}.mdx` with frontmatter matching the schema:

   ```yaml
   ---
   title: "Project Title"
   year: 2026
   status: "live" | "in-progress" | "archived"
   role: "Your role"
   stack: ["Tool", "Tool", "Tool"]
   summary: "One-sentence summary."
   cover: "/covers/your-slug.svg"
   featured: true   # appears on homepage
   order: 6         # lower = earlier in the grid
   ---
   ```

2. Drop the cover image at `public/covers/{slug}.{svg|png|jpg}`.
3. Write the case study body in MDX below the frontmatter.
4. Run `npm run build` to verify and `npm run preview` to inspect.

## Deploy

This repo is wired to Netlify. Pushes to `main` trigger an auto-deploy. Local config lives in `netlify.toml`.

## License

All rights reserved. See [LICENSE](./LICENSE).
