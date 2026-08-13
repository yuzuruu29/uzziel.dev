/**
 * Vanilla magnetic hover for `[data-magnetic]` elements (Astro-rendered CTAs).
 * Transition-based follow — no rAF loop. Elastic release on leave.
 * Skips coarse pointers and reduced-motion users. Idempotent per element,
 * safe to re-run after Astro view transitions.
 */
export function initMagnetic(root: ParentNode = document) {
  if (typeof window === 'undefined') return;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-magnetic]'));
  for (const el of targets) {
    if (el.dataset.magneticBound) continue;
    el.dataset.magneticBound = 'true';

    const strength = Number(el.dataset.magneticStrength ?? '0.32');
    const maxShift = Number(el.dataset.magneticMax ?? '22');

    el.addEventListener('pointerenter', () => {
      el.style.transition = 'transform 140ms cubic-bezier(0.33, 1, 0.68, 1)';
    });

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      const clamp = (v: number) => Math.max(-maxShift, Math.min(maxShift, v));
      el.style.transform = `translate3d(${clamp(dx)}px, ${clamp(dy)}px, 0)`;
    });

    el.addEventListener('pointerleave', () => {
      // Overshooting bezier reads as an elastic snap-back.
      el.style.transition = 'transform 480ms cubic-bezier(0.22, 1.6, 0.36, 1)';
      el.style.transform = 'translate3d(0, 0, 0)';
    });
  }
}
