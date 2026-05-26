# uzziel.dev

Personal site of Emmanuel Uzziel A. Malolos — agri-econ undergrad at UPLB and full-stack creator from Bay, Laguna. The site catalogs five projects across indie games, AI agency work, volunteer web dev, and academic research, and serves as the home for a long-running thesis on land conversion and rice productivity in Bay, Laguna.

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
