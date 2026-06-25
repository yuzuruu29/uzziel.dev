import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'work', 'project-screenshots');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 45000 });
await page.locator('input[type="password"]').fill('admin');
await page.getByRole('button', { name: 'Sign In' }).click();
await page.waitForURL((url) => url.pathname === '/' || url.pathname === '', { timeout: 30000 });
await page.waitForTimeout(4000);
await page.screenshot({ path: path.join(outDir, 'hivemind-dashboard.png'), fullPage: false });
console.log('OK hivemind-dashboard.png');

await browser.close();