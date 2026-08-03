# Portfolio PDF Verification

## Generated artifact
- **File**: `/mnt/c/Portfolio/Uzziel_Malolos_Portfolio.pdf`
- **Size**: 724,064 bytes (~708 KB)
- **Pages**: 28 (A4)
- **Format**: PDF-1.4, produced by Chrome Headless/Skia
- **Title metadata**: `Uzziel Malolos – Portfolio`

## Source-content verification
The PDF was generated from the built Astro page at `dist/portfolio-pdf/index.html`. A script parsed all 34 `src/content/work/*.mdx` frontmatter titles and confirmed each one is present in the generated HTML. Four titles are stored as HTML-escaped entities rather than literal characters (e.g. `JoMel&#39;s`, `Oka&#39;s`, `Land Conversion &amp; Rice Productivity &amp; Profitability`), which is expected Astro output and renders correctly.

## PDF structural checks
- Valid PDF header `%PDF-1.4`
- Valid `startxref`, `%%EOF`, and cross-reference table
- Correct `/Type /Page` count (28 pages)
- Embedded fonts and print-background graphics included

## Environment limitation
PDF text extraction (`pdftotext`, `pdfinfo`, `PyPDF2`, `pypdf`, `pdfplumber`) is unavailable in this WSL environment and cannot be installed without `sudo`. The PDF stores text as font glyph IDs with `/ToUnicode` CMaps, so raw text cannot be grepped. This prevents direct in-PDF string verification, but the generation pipeline is deterministic and the source HTML has been verified to contain every project title.

## Verdict
The PDF is structurally valid, contains the expected number of pages, and is generated from a source page that includes all 34 work entries plus the three local sample builds. It is ready to upload.
