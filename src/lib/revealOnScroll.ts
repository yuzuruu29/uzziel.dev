export function initRevealOnScroll(root: ParentNode = document) {
  if (typeof window === 'undefined') return;
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!targets.length) return;

  // Skip elements that have already been observed (so this is idempotent
  // across astro:page-load view transitions and per-page calls).
  const fresh = targets.filter((el) => !el.dataset.revealObserved);
  if (!fresh.length) return;
  fresh.forEach((el) => { el.dataset.revealObserved = 'true'; });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    fresh.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.revealDelay ?? '0');
          if (delay > 0) el.style.transitionDelay = `${delay}ms`;
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
  );

  fresh.forEach((el) => io.observe(el));
}
