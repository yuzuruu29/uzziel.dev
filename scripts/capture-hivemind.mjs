import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'work', 'project-screenshots');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  const url = page.url();
  if (url.includes('/login')) {
    await page.screenshot({ path: path.join(outDir, 'hivemind-login.png') });
    console.log('OK hivemind-login.png (auth gate)');
  } else {
    await page.screenshot({ path: path.join(outDir, 'hivemind-dashboard.png') });
    console.log('OK hivemind-dashboard.png');
  }
} catch (err) {
  console.error('FAIL', err.message);
}

await browser.close();