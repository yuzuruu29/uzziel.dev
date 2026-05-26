import { useEffect } from 'react';

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const SPRITE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <g fill="#4a6b3a">
    <rect x="13" y="3" width="6" height="6"/>
    <rect x="14" y="9" width="4" height="1"/>
    <rect x="12" y="10" width="2" height="6"/>
    <rect x="14" y="10" width="6" height="8"/>
    <rect x="20" y="11" width="2" height="2"/>
    <rect x="22" y="12" width="2" height="2"/>
    <rect x="24" y="13" width="2" height="2"/>
    <rect x="14" y="18" width="2" height="6"/>
    <rect x="17" y="18" width="2" height="6"/>
    <rect x="13" y="24" width="3" height="2"/>
    <rect x="17" y="24" width="3" height="2"/>
  </g>
  <g fill="#c9a14a">
    <rect x="23" y="11" width="1" height="1"/>
    <rect x="25" y="12" width="1" height="1"/>
  </g>
</svg>`.trim();

export default function KonamiEgg() {
  useEffect(() => {
    let progress = 0;

    const onKey = (e: KeyboardEvent) => {
      const expected = SEQUENCE[progress];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === expected) {
        progress += 1;
        if (progress === SEQUENCE.length) {
          progress = 0;
          fire();
        }
      } else {
        progress = key === SEQUENCE[0] ? 1 : 0;
      }
    };

    const fire = () => {
      try {
        if (sessionStorage.getItem('konami_fired') === '1') return;
        sessionStorage.setItem('konami_fired', '1');
      } catch (_) {}

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const footer = document.querySelector('footer');
      const host = footer ?? document.body;

      const wrap = document.createElement('div');
      wrap.setAttribute('aria-hidden', 'true');
      wrap.style.cssText = [
        'position: fixed',
        'left: 0',
        'bottom: 32px',
        'width: 32px',
        'height: 32px',
        'pointer-events: none',
        'z-index: 9999',
        'transform: translateX(-32px)',
        reduced ? '' : 'transition: transform 6s linear',
      ].join(';');
      wrap.innerHTML = SPRITE_SVG;

      const rect = host.getBoundingClientRect();
      wrap.style.top = `${rect.top + rect.height / 2 - 16}px`;
      wrap.style.bottom = 'auto';

      document.body.appendChild(wrap);

      const remove = () => wrap.remove();

      if (reduced) {
        wrap.style.transform = `translateX(${window.innerWidth + 32}px)`;
        window.setTimeout(remove, 50);
        return;
      }

      window.requestAnimationFrame(() => {
        wrap.style.transform = `translateX(${window.innerWidth + 32}px)`;
      });
      window.setTimeout(remove, 6200);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return null;
}
