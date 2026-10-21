import type { CollectionEntry } from 'astro:content';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { motionTokens } from '../lib/motionTokens';

type FilterKey = 'all' | 'app' | 'game' | 'web' | 'ai' | 'active' | 'shipped';
type ProjectData = Pick<CollectionEntry<'work'>['data'], 'stack' | 'status'>;

const CHIPS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All work' },
  { key: 'app', label: 'Apps' },
  { key: 'game', label: 'Games' },
  { key: 'web', label: 'Web' },
  { key: 'ai', label: 'AI + systems' },
  { key: 'active', label: 'In progress' },
  { key: 'shipped', label: 'Live + complete' },
];

const STACK_MATCH: Record<Exclude<FilterKey, 'all' | 'active' | 'shipped'>, string[]> = {
  app: ['kotlin', 'jetpack compose', 'android', 'expo', 'react native', 'flutter', 'electron', 'tauri', 'capacitor'],
  game: ['godot', 'gdscript', 'aseprite', 'mobile game', 'phaser', 'three.js', 'roblox', 'luau'],
  web: ['html', 'css', 'netlify', 'astro', 'react', 'next.js', 'tailwind', 'tailwind css', 'wordpress', 'vite', 'pwa'],
  ai: ['agent systems', 'llm routing', 'botpress', 'claude', 'chatgpt', 'fastapi', 'groq', 'anthropic api', 'grok api', 'openai', 'whisper', 'tesseract', 'hivemind'],
};

function matches(key: FilterKey, stack: string[], status: string): boolean {
  if (key === 'all') return true;
  if (key === 'active') return status === 'in-progress';
  if (key === 'shipped') return status === 'live' || status === 'completed';
  return stack.some((item) => {
    const technology = item.toLowerCase().replace(/\s+v?\d[\w.-]*$/, '');
    return STACK_MATCH[key].includes(technology);
  });
}

export default function WorkFilter({ gridId = 'work-grid', projects }: { gridId?: string; projects: ProjectData[] }) {
  const [active, setActive] = useState<FilterKey>('all');
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);
  const chips = CHIPS.map((chip) => ({
    ...chip,
    count: projects.filter(({ stack, status }) => matches(chip.key, stack, status)).length,
  }));
  const current = chips.find((chip) => chip.key === active) ?? chips[0];

  useEffect(() => {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const animations: Animation[] = [];
    let revealIndex = 0;

    grid.querySelectorAll<HTMLElement>('[data-work-card]').forEach((card) => {
      const show = matches(active, (card.dataset.stack ?? '').split('|'), card.dataset.status ?? '');
      const wasHidden = card.hidden;

      // Remove filtered links from layout and keyboard navigation immediately.
      card.hidden = !show;
      card.inert = !show;
      card.style.display = show ? '' : 'none';
      card.classList.remove('work-card-hidden');

      if (show && wasHidden) {
        card.classList.add('in');
        if (!reduced && typeof card.animate === 'function') {
          animations.push(card.animate(
            [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 320, delay: Math.min(revealIndex * 28, 140), easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' },
          ));
          revealIndex += 1;
        }
      }
    });

    const cancelAnimations = () => animations.forEach((animation) => animation.cancel());
    document.addEventListener('astro:before-swap', cancelAnimations);
    return () => {
      cancelAnimations();
      document.removeEventListener('astro:before-swap', cancelAnimations);
    };
  }, [active, gridId, reduced]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {chips.map((chip) => {
          const isActive = active === chip.key;
          return (
            <motion.button
              key={chip.key}
              type="button"
              data-cursor="hover"
              onClick={() => setActive(chip.key)}
              aria-pressed={isActive}
              aria-controls={gridId}
              aria-label={`${chip.label}: ${chip.count} ${chip.count === 1 ? 'project' : 'projects'}`}
              className={
                'min-h-11 rounded-[2px] border px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.13em] transition-colors ' +
                (isActive
                  ? 'border-ink bg-ink text-cream dark:border-gold dark:bg-gold dark:text-ink'
                  : 'border-line-strong text-stone hover:border-narra hover:text-narra dark:hover:border-gold dark:hover:text-gold')
              }
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={{ duration: motionTokens.duration.fast, ease: motionTokens.easing.sharp }}
            >
              {chip.label}
              <span className={isActive ? 'ml-2 text-[9px] text-cream/70 dark:text-ink/70' : 'ml-2 text-[9px] opacity-70'}>
                {chip.count}
              </span>
            </motion.button>
          );
        })}
      </div>
      <p className="mt-5 font-mono text-[11px] text-stone" role="status" aria-live="polite" aria-atomic="true">
        {current.count === 0
          ? 'Nothing in this category yet. Try another, or browse all work.'
          : `${current.count} ${current.count === 1 ? 'project' : 'projects'}${active === 'all' ? ' in the collection' : ` · ${current.label}`}.`}
      </p>
    </div>
  );
}
