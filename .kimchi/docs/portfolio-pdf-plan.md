# PDF Portfolio Generation Plan

## Goal
Generate a single, print-ready PDF portfolio that mirrors the uzziel.dev website and includes every project tracked in the Portfolio workspace — ongoing, live, archived, and sample/local builds.

## Scope
- Include all 34 work entries from `src/content/work/`.
- Include the three local sample builds in `01_willow_creek_farmstay/`, `02_clearpath_lawn_care/`, `03_harvest_table_kitchen/`.
- Reuse site copy (about, services, skills, contact) from `src/pages/about.astro`, `src/pages/services.astro`, and `src/lib/resume-content.ts`.
- Output a single file named `Uzziel_Malolos_Portfolio.pdf` at the repository root, ready to upload.

## Constraints
- Keep Astro 4 pinned; do not upgrade.
- Do not modify `package.json`, `astro.config.mjs`, or `tailwind.config.mjs`.
- Use only dependencies already present (Astro, Playwright via `@playwright/test`).
- Use the system Chrome already installed at `/usr/bin/google-chrome`.
- Respect prefers-reduced-motion; no animations in the PDF view.

## PDF Content Outline
1. **Cover page** — name, tagline, positioning line, contact links, website.
2. **About** — 2-paragraph bio + current focus summary.
3. **Services** — the 3 service cards and 4-step workflow from `services.astro`.
4. **Featured work** — full-page cards for all `featured: true` entries (8 projects), with cover image, title, role, year, stack, status, and rendered body copy.
5. **All projects catalog** — compact table/list of the remaining 26 work entries grouped by status (live, in-progress, archived) with title, role, year, status badge, stack, and summary.
6. **Local sample builds** — short section for each of the three numbered directories, pulled from their README.md files.
7. **Skills & contact** — skill groups from `resume-content.ts` + final contact call-to-action.

## Chunk Breakdown

### Chunk 1 — Print layout (`src/layouts/PDFLayout.astro`)
- **Complexity**: simple
- **Files**: `src/layouts/PDFLayout.astro`
- **Behaviour**: Minimal HTML5 shell, viewport meta, inline `@page` and print CSS, system + Google Fonts (Fraunces/Inter), light mode only, no JS animations.
- **Acceptance criteria**:
  - Layout renders valid HTML.
  - Print CSS sets page size A4, margin 16mm, and `page-break-inside: avoid` for cards.
  - No external runtime JS; styles are inline or `<style>`.

### Chunk 2 — PDF content page (`src/pages/portfolio-pdf.astro`)
- **Complexity**: simple
- **Files**: `src/pages/portfolio-pdf.astro`
- **Dependencies**: Chunk 1
- **Behaviour**:
  - Import `PDFLayout`.
  - Use `getCollection('work')` and sort by `order`.
  - Split entries into `featured`, `live`, `inProgress`, `archived`, and `sample` groups.
  - Render each section with the outline above.
  - For featured entries, call `entry.render()` to include full MDX body.
  - Read `src/lib/resume-content.ts` and `src/lib/socials.ts` for about/skills/contact copy.
  - Use absolute `file://` friendly image paths or skip images that cannot be resolved in print.
- **Acceptance criteria**:
  - `astro build` completes without errors.
  - The generated `dist/portfolio-pdf/index.html` contains all 34 project titles.
  - Featured project body copy is present in the HTML.

### Chunk 3 — PDF generator script (`scripts/generate-portfolio-pdf.mjs`)
- **Complexity**: simple
- **Files**: `scripts/generate-portfolio-pdf.mjs`
- **Dependencies**: Chunk 2
- **Behaviour**:
  - Run `astro build` via `npm run build` (using Windows Node from `/mnt/c/Program Files/nodejs/node.exe`).
  - Launch Playwright chromium connected to system Chrome (`executablePath: '/usr/bin/google-chrome'`).
  - Navigate to `file:///mnt/c/Portfolio/dist/portfolio-pdf/index.html`.
  - Emulate `print` media, wait for fonts/images.
  - Save PDF as `/mnt/c/Portfolio/Uzziel_Malolos_Portfolio.pdf` with A4 format, print background, margins.
  - Close browser.
- **Acceptance criteria**:
  - Script exits 0.
  - PDF file is created and larger than 50 KB.
  - PDF page count is at least 10.

### Chunk 4 — Execute and verify
- **Complexity**: simple
- **Files**: `Uzziel_Malolos_Portfolio.pdf`
- **Dependencies**: Chunk 3
- **Behaviour**: Run the generator script and verify the output.
- **Acceptance criteria**:
  - PDF exists at repository root.
  - `pdfinfo` (or Python fallback) reports ≥10 A4 pages.
  - File size ≥50 KB.

## Verification
After each build chunk, the Builder agent must run `astro build` (chunks 1-2) or the generator script (chunk 3) and report exit codes/output. Final verification uses `pdfinfo` or a Python script to inspect page count and dimensions.
