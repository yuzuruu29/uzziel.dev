import { test, expect } from '@playwright/test';

const ROUTES: Array<{ path: string; slug: string; titleContains: string }> = [
  { path: '/',                   slug: 'home',     titleContains: 'Uzziel Malolos' },
  { path: '/cv/',                slug: 'cv',       titleContains: 'CV' },
  { path: '/work/',              slug: 'work',     titleContains: 'Work' },
  { path: '/work/tirador/',      slug: 'tirador',  titleContains: 'TIRADOR' },
  { path: '/work/heart-and-soil/', slug: 'heart-and-soil', titleContains: 'Heart and Soil' },
  { path: '/about/',             slug: 'about',    titleContains: 'About' },
  { path: '/research/',          slug: 'research', titleContains: 'Research' },
  { path: '/services/',          slug: 'services', titleContains: 'Services' },
  { path: '/contact/',           slug: 'contact',  titleContains: 'Contact' },
];

async function expectSameOriginReferencesToResolve(page: import('@playwright/test').Page) {
  const refs = await page.evaluate(() => {
    const selector = 'a[href], img[src], script[src], link[href]';
    const results: Array<{ raw: string; url: string; tag: string; attr: string }> = [];

    document.querySelectorAll(selector).forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const attr = tag === 'a' || tag === 'link' ? 'href' : 'src';
      const raw = el.getAttribute(attr);
      if (!raw || raw.startsWith('#')) return;

      const lower = raw.toLowerCase();
      if (
        lower.startsWith('mailto:') ||
        lower.startsWith('tel:') ||
        lower.startsWith('javascript:') ||
        lower.startsWith('data:') ||
        lower.startsWith('blob:')
      ) {
        return;
      }

      const url = new URL(raw, window.location.href);
      if (url.origin !== window.location.origin) return;
      url.hash = '';

      results.push({ raw, url: url.toString(), tag, attr });
    });

    return results;
  });

  const uniqueRefs = [...new Map(refs.map((ref) => [ref.url, ref])).values()];

  for (const ref of uniqueRefs) {
    const response = await page.request.get(ref.url, { maxRedirects: 5 });
    expect(
      response.status(),
      `${ref.tag}[${ref.attr}="${ref.raw}"] should resolve from ${page.url()}`,
    ).toBeLessThan(400);
  }
}

for (const route of ROUTES) {
  test(`${route.slug}: renders + screenshot`, async ({ page }, testInfo) => {
    const response = await page.goto(route.path, { waitUntil: 'load' });
    expect(response?.status(), `${route.path} should be 200`).toBe(200);
    await expect(page).toHaveTitle(new RegExp(route.titleContains, 'i'));
    await expectSameOriginReferencesToResolve(page);

    // Settle: wait for fonts + give scroll-reveal a moment, but cap it.
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => (document as any).fonts?.ready);
    await page.evaluate(async () => {
      const step = Math.max(window.innerHeight, 600);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle');
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
