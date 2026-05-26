export function initRevealOnScroll(root: ParentNode = document) {
  if (typeof window === 'undefined') return;
  const targets = root.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in'));
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
    { threshold: 0.2 },
  );

  targets.forEach((el) => io.observe(el));
}
