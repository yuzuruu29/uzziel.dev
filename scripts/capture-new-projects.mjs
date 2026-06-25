import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'work', 'project-screenshots');
const proofDir = path.join(__dirname, '..', 'public', 'work', 'proof-screenshots');

await mkdir(outDir, { recursive: true });
await mkdir(proofDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const shots = [
  { url: 'https://saklay.vercel.app/', file: 'saklay-home-live.png' },
  { url: 'https://saklay.vercel.app/about', file: 'saklay-about-live.png' },
  { url: 'https://saklay.vercel.app/causes', file: 'saklay-causes-live.png' },
];

for (const { url, file } of shots) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, file), fullPage: false });
    console.log('OK', file);
  } catch (err) {
    console.error('FAIL', file, err.message);
  }
}

await browser.close();