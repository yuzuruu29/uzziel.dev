import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { motionTokens } from '../lib/motionTokens';

type FilterKey = 'all' | 'active' | 'shipped' | 'game' | 'web' | 'ai' | 'research';

const CHIPS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'game', label: 'Games' },
  { key: 'web', label: 'Web' },
  { key: 'ai', label: 'AI + systems' },
  { key: 'research', label: 'Research' },
];

const STACK_MATCH: Record<Exclude<FilterKey, 'all' | 'active' | 'shipped'>, string[]> = {
  game: ['Godot 4', 'Godot 4.6', 'GDScript', 'Aseprite', 'Mobile game'],
  web: ['HTML', 'CSS', 'Netlify', 'Astro', 'React', 'Next.js', 'Tailwind CSS'],
  ai: ['Agent systems', 'LLM routing', 'Botpress', 'Claude', 'ChatGPT', 'FastAPI', 'Groq'],
  research: ['QGIS', 'R', 'APA 7', 'Research'],
};

function matches(key: FilterKey, stack: string[], status: string): boolean {
  if (key === 'all') return true;
  if (key === 'active') return status === 'in-progress';
  if (key === 'shipped') return status === 'live' || status === 'completed';
  return stack.some((item) => STACK_MATCH[key].includes(item));
}

export default function WorkFilter({ gridId = 'work-grid' }: { gridId?: string }) {
  const [active, setActive] = useState<FilterKey>('all');
  const [counts, setCounts] = useState<Record<FilterKey, number>>({
    all: 0,
    active: 0,
    shipped: 0,
    game: 0,
    web: 0,
    ai: 0,
    research: 0,
  });
  const reduced = useReducedMotion();

  const cardData = useMemo(() => {
    if (typeof document === 'undefined') return [];
    const grid = document.getElementById(gridId);
    if (!grid) return [];
    return Array.from(grid.querySelectorAll<HTMLElement>('[data-work-card]')).map((card) => ({
      card,
      stack: (card.dataset.stack ?? '').split('|').filter(Boolean),
      status: card.dataset.status ?? '',
    }));
  }, [gridId]);

  useEffect(() => {
    const next = Object.fromEntries(
      CHIPS.map(({ key }) => [key, cardData.filter(({ stack, status }) => matches(key, stack, status)).length]),
    ) as Record<FilterKey, number>;
    setCounts(next);
  }, [cardData]);

  useEffect(() => {
    cardData.forEach(({ card, stack, status }) => {
      const show = matches(active, stack, status);

      if (reduced) {
        card.style.display = show ? '' : 'none';
        card.classList.remove('work-card-hidden');
        return;
      }

      if (show) {
        const wasHidden = card.style.display === 'none';
        card.style.display = '';
        if (wasHidden) {
          card.classList.add('work-card-hidden');
          window.requestAnimationFrame(() => card.classList.remove('work-card-hidden'));
        } else {
          card.classList.remove('work-card-hidden');
        }
      } else {
        card.classList.add('work-card-hidden');
        window.setTimeout(() => {
          if (card.classList.contains('work-card-hidden')) card.style.display = 'none';
        }, 290);
      }
    });
  }, [active, cardData, reduced]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {CHIPS.map((chip) => {
          const isActive = active === chip.key;
          return (
            <motion.button
              key={chip.key}
              type="button"
              data-cursor="hover"
              onClick={() => setActive(chip.key)}
              aria-pressed={isActive}
              className={
                'min-h-11 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ' +
                (isActive
                  ? 'border-ink bg-ink text-cream dark:border-gold dark:bg-gold dark:text-ink'
                  : 'border-stone/30 text-stone hover:border-narra hover:text-narra dark:hover:border-gold dark:hover:text-gold')
              }
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={{ duration: motionTokens.duration.fast, ease: motionTokens.easing.sharp }}
            >
              {chip.label}
              <span className={isActive ? 'ml-2 font-mono text-[10px] text-cream/70 dark:text-ink' : 'ml-2 font-mono text-[10px] text-stone'}>
                {counts[chip.key]}
              </span>
            </motion.button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {counts[active]} projects.
      </p>
    </div>
  );
}
