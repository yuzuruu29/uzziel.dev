import { test, expect } from '@playwright/test';

const latest = ['fitpace', 'eco-man', 'comtus-ai', 'unaccounted', 'bookdesk'];

test('recent projects have working case studies and artwork', async ({ page, request }) => {
  for (const slug of latest) {
    const response = await page.goto(`/work/${slug}/`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    const image = page.locator('#case-cover-img');
    await expect(image).toBeVisible();
    const src = await image.getAttribute('src');
    expect(src).toBeTruthy();
    expect((await request.get(src!)).status()).toBe(200);
  }
});

test('Eco-Man leads the homepage and the archive, with real logos loaded', async ({ page }) => {
  await page.goto('/');
  const highlight = page.locator('#highlight');
  await expect(highlight.getByRole('heading', { level: 2 })).toContainText('Then it counts.');
  await expect(highlight.locator('a[href="/work/eco-man"]')).toBeVisible();
  await expect(page.locator('.hero-artifact-app')).toHaveAttribute('href', '/work/eco-man');

  await page.goto('/work/');
  const first = page.locator('#project-work-grid [data-work-card]').first();
  await expect(first).toHaveAttribute('href', '/work/eco-man');
  await expect(first).toContainText('Highlight');
  const logos = page.locator('#project-work-grid img.app-logo');
  expect(await logos.count()).toBeGreaterThanOrEqual(7);
  for (const logo of await logos.all()) {
    await logo.scrollIntoViewIfNeeded();
    await expect.poll(() => logo.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
});

test('Apps and Games filters survive rapid changes and navigation', async ({ page }) => {
  await page.goto('/work/');
  const grid = page.locator('#project-work-grid');
  const all = grid.locator('[data-work-card]');
  const total = await all.count();
  await page.getByRole('button', { name: /^Apps:/ }).click();
  await expect(grid.locator('a[href="/work/fitpace"]')).toBeVisible();
  await expect(grid.locator('a[href="/work/eco-man"]')).toBeVisible();
  await expect(grid.locator('a[href="/work/bookdesk"]')).toBeVisible();
  await expect(grid.locator('a[href="/work/unaccounted"]')).toBeHidden();
  expect(await grid.locator('[hidden]').evaluateAll(cards => cards.every(card => card instanceof HTMLElement && card.inert))).toBe(true);

  for (const category of [/^Games:/, /^Apps:/, /^All work:/, /^Games:/]) {
    await page.getByRole('button', { name: category }).click();
  }
  await expect(grid.locator('a[href="/work/unaccounted"]')).toBeVisible();
  await expect(grid.locator('a[href="/work/project-nero"]')).toBeVisible();
  await expect(grid.locator('a[href="/work/fitpace"]')).toBeHidden();
  await page.getByRole('button', { name: /^All work:/ }).click();
  await expect(grid.locator('[data-work-card]:not([hidden])')).toHaveCount(total);
  await grid.locator('a[href="/work/fitpace"]').click();
  await expect(page.locator('h1')).toHaveText('Fitness Pace');
  await page.goBack();
  await page.getByRole('button', { name: /^Apps:/ }).click();
  await expect(page.locator('#project-work-grid a[href="/work/eco-man"]')).toBeVisible();
});

test('motion preference changes keep the hero and filters static', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.hero-artifact-game')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-artifact-game')).toHaveCSS('transform', 'none');
  await page.locator('a[href="/work"]:visible').first().click();
  await page.getByRole('button', { name: /^Apps:/ }).click();
  await page.getByRole('button', { name: /^All work:/ }).click();
  expect(await page.locator('#project-work-grid').evaluate(grid => grid.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
});

test('small screens, menu and enlarged text remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'I design, build, and ship.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.locator('#mobile-overlay')).toHaveAttribute('data-open', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  await page.goto('/work/');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await page.getByRole('button', { name: /^Apps:/ }).click();
  await expect(page.locator('#project-work-grid a[href="/work/eco-man"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('without JavaScript the homepage and archive stay readable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'I design, build, and ship.' })).toBeVisible();
  await page.locator('#selected-work').scrollIntoViewIfNeeded();
  await expect(page.locator('#featured-grid a[href="/work/fitpace"]')).toBeVisible();
  await page.goto('/work/');
  await expect(page.locator('#project-work-grid a[href="/work/unaccounted"]')).toBeVisible();
  await context.close();
});
