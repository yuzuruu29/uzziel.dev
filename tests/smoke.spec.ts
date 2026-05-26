import { test, expect } from '@playwright/test';

const ROUTES: Array<{ path: string; slug: string; titleContains: string }> = [
  { path: '/',                   slug: 'home',     titleContains: 'Uzziel Malolos' },
  { path: '/work/',              slug: 'work',     titleContains: 'Work' },
  { path: '/work/tirador/',      slug: 'tirador',  titleContains: 'TIRADOR' },
  { path: '/about/',             slug: 'about',    titleContains: 'About' },
  { path: '/research/',          slug: 'research', titleContains: 'Research' },
  { path: '/services/',          slug: 'services', titleContains: 'Services' },
  { path: '/contact/',           slug: 'contact',  titleContains: 'Contact' },
];

for (const route of ROUTES) {
  test(`${route.slug}: renders + screenshot`, async ({ page }, testInfo) => {
    const response = await page.goto(route.path, { waitUntil: 'load' });
    expect(response?.status(), `${route.path} should be 200`).toBe(200);
    await expect(page).toHaveTitle(new RegExp(route.titleContains, 'i'));

    // Settle: wait for fonts + give scroll-reveal a moment, but cap it.
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => (document as any).fonts?.ready);
    await page.waitForTimeout(800);

    // Stop CSS animations (marquee + framer-motion drag) so the shot is stable.
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
        }
      `,
    });

    const file = `test-results/${route.slug}--${testInfo.project.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
  });
}
