import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const proofDir = path.join(__dirname, '..', 'public', 'work', 'proof-screenshots');

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#f4ecd8;color:#1a1410;font-family:Georgia,serif;padding:32px}
h1{color:#6b3410;font-size:28px;margin:0 0 16px}
ul{font-size:15px;line-height:1.8}
.muted{color:#8a7d6e;font-family:Consolas,monospace;font-size:13px}
</style></head><body>
<h1>Saklay — build &amp; accessibility</h1>
<ul>
<li>Astro 5 static site · Tailwind · content collections (causes, stories)</li>
<li>WCAG AA target · @axe-core/cli + Playwright in dev-deps</li>
<li>SEO: canonical URLs, OG tags, JSON-LD NGO schema, sitemap</li>
<li>Preview live on Vercel · DNS cutover doc for saklay.com</li>
</ul>
<p class="muted">Charity website · Jun 2026</p>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 700 } });
await page.setContent(html);
await page.screenshot({ path: path.join(proofDir, 'saklay-casestudy.jpg'), type: 'jpeg', quality: 90 });
await browser.close();
console.log('OK saklay-casestudy.jpg');