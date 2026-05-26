import { useEffect, useRef, useState } from 'react';

type FilterKey = 'all' | 'game' | 'web' | 'research' | 'service' | 'past';

const CHIPS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'game', label: 'Game' },
  { key: 'web', label: 'Web' },
  { key: 'research', label: 'Research' },
  { key: 'service', label: 'Service' },
  { key: 'past', label: 'Past' },
];

const STACK_MATCH: Record<Exclude<FilterKey, 'all' | 'past'>, string[]> = {
  game: ['Godot 4', 'GDScript', 'Aseprite'],
  web: ['HTML', 'CSS', 'Netlify', 'Astro', 'React'],
  research: ['QGIS', 'R', 'APA 7'],
  service: ['Botpress', 'Claude', 'ChatGPT'],
};

function matches(key: FilterKey, stack: string[], status: string): boolean {
  if (key === 'all') return true;
  if (key === 'past') return status === 'archived';
  const wanted = STACK_MATCH[key];
  return stack.some((s) => wanted.includes(s));
}

export default function WorkFilter({ gridId = 'work-grid' }: { gridId?: string }) {
  const [active, setActive] = useState<FilterKey>('all');
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-work-card]'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    cards.forEach((card) => {
      const stack = (card.dataset.stack ?? '').split('|').filter(Boolean);
      const status = card.dataset.status ?? '';
      const show = matches(active, stack, status);

      if (reduced) {
        card.style.display = show ? '' : 'none';
        card.classList.remove('work-card-hidden');
        return;
      }

      if (show) {
        const wasHidden = card.style.display === 'none';
        if (wasHidden) {
          card.style.display = '';
          card.classList.add('work-card-hidden');
          window.setTimeout(() => card.classList.remove('work-card-hidden'), 20);
        } else {
          card.classList.remove('work-card-hidden');
        }
      } else {
        card.classList.add('work-card-hidden');
        window.setTimeout(() => {
          if (card.classList.contains('work-card-hidden')) card.style.display = 'none';
        }, 340);
      }
    });
  }, [active, gridId]);

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter work">
      {CHIPS.map((c) => {
        const isActive = active === c.key;
        return (
          <button
            key={c.key}
            data-cursor="hover"
            onClick={() => setActive(c.key)}
            role="tab"
            aria-selected={isActive}
            className={
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ' +
              (isActive
                ? 'bg-ink text-cream border-ink dark:bg-cream dark:text-ink dark:border-cream'
                : 'border-stone/30 text-stone hover:border-narra hover:text-narra')
            }
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
