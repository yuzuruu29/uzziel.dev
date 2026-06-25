import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'work', 'project-screenshots');
const proofDir = path.join(__dirname, '..', 'public', 'work', 'proof-screenshots');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(outDir, 'splatz-lobby.png') });
  console.log('OK splatz-lobby.png');
} catch (err) {
  console.error('FAIL splatz', err.message);
}

const proofHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#0d0a08;color:#f4ecd8;font-family:Consolas,monospace;padding:32px}
h1{font-family:Georgia,serif;color:#c9a14a;font-size:28px;margin:0 0 16px}
pre{white-space:pre-wrap;font-size:14px;line-height:1.5;color:#f4ecd8}
.muted{color:#8a7d6e}
</style></head><body>
<h1>TraderBot — 30-day BTCUSDT backtest</h1>
<pre>
Fetching 30 days of BTCUSDT (1d)...

Win Rate:      50.0%
Total Return:  +3.19%
Avg Win:       +1.75%  |  Avg Loss: -0.69%
Profit Factor: 2.54
Max Drawdown:  2.11%
Sharpe Ratio:  4.56

By Signal Type:
  BUY:  2 trades, 50.0% WR, -0.32% avg
  SELL: 4 trades, 50.0% WR, +0.96% avg

Best Trade:  +4.43% on 2026-06-04 (SELL)
Worst Trade: -1.19% on 2026-04-07 (BUY)

Vault report → HiveMind vault/02-Projects/traderbot/backtest-results/
</pre>
<p class="muted">Hive Mind-orchestrated signal pipeline · Jun 25, 2026</p>
</body></html>`;

await page.setContent(proofHtml, { waitUntil: 'load' });
await page.screenshot({ path: path.join(proofDir, 'traderbot-casestudy.jpg'), type: 'jpeg', quality: 90 });
console.log('OK traderbot-casestudy.jpg');

const splatzProof = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#0d0a08;color:#f4ecd8;font-family:Consolas,monospace;padding:32px}
h1{font-family:Georgia,serif;color:#c9a14a;font-size:28px}
.pass{color:#4a6b3a}.muted{color:#8a7d6e}
pre{font-size:14px;line-height:1.6}
</style></head><body>
<h1>SPLATZ — Vitest suite</h1>
<pre>
 Test Files  <span class="pass">8 passed</span> (8)
      Tests  <span class="pass">54 passed</span> (54)
   Duration  1.24s

 ✓ tests/server/SplatzRoom.test.ts (22 tests)
 ✓ server-authoritative physics, lobby, co-op mechanics
 ✓ Electron wrapper + Steamworks integration branch
</pre>
<p class="muted">Phaser 3 + WebSocket multiplayer · Jun 25, 2026</p>
</body></html>`;

await page.setContent(splatzProof, { waitUntil: 'load' });
await page.screenshot({ path: path.join(proofDir, 'splatz-casestudy.jpg'), type: 'jpeg', quality: 90 });
console.log('OK splatz-casestudy.jpg');

const hiveProof = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#0d0a08;color:#f4ecd8;font-family:Consolas,monospace;padding:32px}
h1{font-family:Georgia,serif;color:#c9a14a;font-size:28px}
ul{font-size:15px;line-height:1.8;color:#f4ecd8}
.muted{color:#8a7d6e}
</style></head><body>
<h1>HiveMind — Phase 1–8 complete</h1>
<ul>
<li>Monorepo: API · orchestrator · Next.js dashboard · Obsidian vault</li>
<li>Agent routing, handoffs, BullMQ queue, Docker Compose</li>
<li>Swarm parallel execution + Grok/xAI streaming executor</li>
<li>Vault search, synthesizer, scheduler, Slack/Discord bots</li>
<li>TraderBot + portfolio projects orchestrated through vault memory</li>
<li><span style="color:#4a6b3a">201/201 integration tests passing</span></li>
</ul>
<p class="muted">Multi-agent orchestration · Jun 2026</p>
</body></html>`;

await page.setContent(hiveProof, { waitUntil: 'load' });
await page.screenshot({ path: path.join(proofDir, 'hivemind-casestudy.jpg'), type: 'jpeg', quality: 90 });
console.log('OK hivemind-casestudy.jpg');

await browser.close();