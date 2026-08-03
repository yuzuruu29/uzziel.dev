# Portfolio — Project Memory

## Owner
Emmanuel Uzziel A. Malolos ("Uzziel"). Agri-econ undergrad at UPLB, Natural Resource Economics major. Full-stack creator from Bay, Laguna, Philippines. Builds indie games (TIRADOR in Godot), runs an AI micro-agency (Botpress for PH SMEs), and volunteers as web dev for The Lord's Worship Center.

## Stack (locked — do not propose changes)
- Astro 4.16.19 (pinned — MUST stay on Astro 4, do not upgrade to 5 or 6)
- TypeScript strict
- React 18.3.1 for islands only
- Tailwind CSS 3.4.19 with class-based dark mode
- MDX content collections for case studies
- Framer Motion + GSAP + Lenis for motion
- Node 24 on Windows
- Deploy target: Netlify

## Integrations
@astrojs/tailwind, @astrojs/react, @astrojs/mdx, @astrojs/sitemap

## Design tokens (already in tailwind.config.mjs)
Colors:
- ink     #1a1410 — primary text on light, base on dark
- narra   #6b3410 — deep wood accent
- gold    #c9a14a — primary action / highlight  
- cream   #f4ecd8 — surface
- stone   #8a7d6e — muted text
- leaf    #4a6b3a — success / status:live

Fonts:
- display: Fraunces (serif, variable, slab-leaning)
- sans: Inter Tight
- mono: JetBrains Mono

## Brand
- Positioning line: "I research, build, and ship."
- Voice: plain, specific, Filipino-rooted, dry. No corporate filler. Active verbs. Human actors as subjects.
- Audience: Filipino SME owners, remote freelance hiring managers, academic peers, indie gamedev community.

## Site map
/ · /work · /work/[slug] · /about · /research · /services · /contact

## Featured projects
1. TIRADOR: Barangay Survivors — Godot pixel roguelite
2. AI Micro-Agency — Botpress chatbots for PH SMEs
3. The Lord's Worship Center website — volunteer web work
4. AAE 195 Thesis — land conversion × rice productivity in Bay, Laguna (2019-2025)
5. Oka's Farm Bookkeeping — past role, agri accounting

## Working style
- Phases run one at a time. Stop and report at the end of each.
- After each completed file: emit ✅ [filename] — [one-line summary].
- Only make changes directly requested. Do NOT add features, abstractions, or files beyond what was asked.
- Ask before adding any new dependency.
- Ask before deleting files or modifying package.json, astro.config.mjs, tailwind.config.mjs.
- Use Tailwind utilities first; custom CSS only in src/styles/global.css.
- Path aliases @/* once verified in tsconfig.json; relative imports until then.
- Respect prefers-reduced-motion on every animation.
- Windows host: use cross-platform paths in code; CRLF line endings OK in working tree.

## Out of scope (do not touch unless I ask)
- portfolio-samples/ — sample reference only
- .env files — none should exist yet
- Anything outside C:\Portfolio\
