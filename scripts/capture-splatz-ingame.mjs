import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'work', 'project-screenshots');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(2000);
await page.locator('#btn-create').click();
await page.waitForFunction(
  () => {
    const code = document.getElementById('room-code-display')?.textContent?.trim() ?? '';
    return code.length === 4 && !code.includes('-');
  },
  { timeout: 15000 },
);
await page.locator('#btn-start').click();
await page.waitForFunction(
  () => !document.getElementById('lobby-overlay')?.classList.contains('active'),
  { timeout: 20000 },
);
await page.waitForTimeout(5000);
await page.locator('#game-container').screenshot({ path: path.join(outDir, 'splatz-ingame.png') });
console.log('OK splatz-ingame.png');

await browser.close();