import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'work', 'project-screenshots');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// HiveMind — login then dashboard
try {
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 45000 });
  await page.locator('input[type="password"]').fill('admin');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('http://localhost:3000/**', { timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outDir, 'hivemind-dashboard.png'), fullPage: false });
  console.log('OK hivemind-dashboard.png');
} catch (err) {
  console.error('FAIL hivemind-dashboard', err.message);
}

// SPLATZ — create room, host start, in-game
try {
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1500);
  await page.locator('#btn-create').click();
  await page.waitForSelector('#room-code-display', { timeout: 10000 });
  const code = await page.locator('#room-code-display').textContent();
  if (!code || code.includes('-')) {
    throw new Error(`Room not created (code=${code})`);
  }
  await page.locator('#btn-start').click();
  await page.waitForFunction(
    () => !document.getElementById('lobby-overlay')?.classList.contains('active'),
    { timeout: 15000 },
  );
  await page.waitForTimeout(4500);
  await page.locator('#game-container').screenshot({ path: path.join(outDir, 'splatz-ingame.png') });
  console.log('OK splatz-ingame.png');
} catch (err) {
  console.error('FAIL splatz-ingame', err.message);
}

await browser.close();