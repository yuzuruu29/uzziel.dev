import { useEffect, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { motionTokens } from '../lib/motionTokens';

type HeroProps = {
  projectCount: number;
  activeCount: number;
  shippedCount: number;
};

const CURRENT_DESK = [
  { name: 'Project Nero', detail: 'Browser cyberpunk pixel MMORPG', label: 'Building' },
  { name: 'ShirtKo', detail: 'Apparel storefront — web + mobile', label: 'Live' },
  { name: 'AAE 200', detail: 'Land conversion × rice farming, Bay', label: 'Research' },
];

const HEADLINE = ['I', 'research,', 'build,', 'and', 'ship.'];

const now = new Date();
const DESK_STAMP = `${String(now.getMonth() + 1).padStart(2, '0')} / ${now.getFullYear()}`;

function CountUp({ value, reduced, delay = 0.5 }: { value: number; reduced: boolean; delay?: number }) {
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.3,
      delay,
      ease: motionTokens.easing.smooth,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, reduced, delay]);

  return <>{display}</>;
}

export default function Hero({ projectCount, activeCount, shippedCount }: HeroProps) {
  const reduced = useReducedMotion() ?? false;
  const enter = reduced
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: motionTokens.distance.md },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section className="container pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)] lg:gap-16">
        <motion.div
          {...enter}
          transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }}
          className="flex flex-col justify-center"
        >
          <div className="mb-8 flex items-center gap-4">
            <img
              src="/photos/uzziel-formal.png"
              alt="Uzziel Malolos — formal portrait"
              width="72"
              height="72"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-16 w-16 rounded-xl border border-narra/30 object-cover md:h-[72px] md:w-[72px]"
            />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone">Emmanuel Uzziel Malolos</p>
              <p className="mt-1 text-sm text-stone">Researcher · designer · developer</p>
            </div>
          </div>

          <p className="eyebrow">Bay, Laguna · Philippines</p>
          <h1
            className="mt-5 max-w-[13ch] text-ink dark:text-cream"
            aria-label="I research, build, and ship."
          >
            {reduced ? (
              'I research, build, and ship.'
            ) : (
              <span aria-hidden="true">
                {HEADLINE.map((word, i) => (
                  <span key={word} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={{ y: '112%' }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 0.72,
                        delay: 0.1 + i * 0.07,
                        ease: motionTokens.easing.smooth,
                      }}
                    >
                      {word}
                    </motion.span>
                    {i < HEADLINE.length - 1 ? '\u00a0' : ''}
                  </span>
                ))}
              </span>
            )}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone md:text-xl">
            I turn field questions, business problems, and game ideas into tested systems people can actually use.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="/work" data-cursor="hover" data-magnetic className="button-primary">
              Explore the work
              <span aria-hidden="true">↗</span>
            </a>
            <a href="/contact" data-cursor="hover" data-magnetic className="button-secondary">
              Start a conversation
            </a>
          </div>

          <p className="mt-8 flex items-center gap-2 text-sm text-stone">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              {!reduced && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-60" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
            </span>
            Open to focused freelance and research collaborations.
          </p>
        </motion.div>

        <motion.aside
          initial={reduced ? false : { opacity: 0, y: motionTokens.distance.lg }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{
            duration: motionTokens.duration.slow,
            delay: reduced ? 0 : 0.08,
            ease: motionTokens.easing.smooth,
          }}
          className="rounded-2xl border border-cream/10 bg-ink p-6 text-cream shadow-[0_24px_80px_rgba(26,20,16,0.18)] md:p-8"
          aria-label="Current work and portfolio statistics"
        >
          <div className="flex items-center justify-between gap-4 border-b border-cream/15 pb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/55">Current desk</p>
              <p className="mt-1 font-display text-2xl">Work in motion</p>
            </div>
            <span className="font-mono text-xs text-gold">{DESK_STAMP}</span>
          </div>

          <ol className="divide-y divide-cream/15">
            {CURRENT_DESK.map((item, index) => (
              <li
                key={item.name}
                className="group grid grid-cols-[2rem_1fr_auto] items-start gap-3 py-5 transition-colors duration-200 hover:bg-cream/[0.03]"
              >
                <span className="font-mono text-[11px] text-cream/55 transition-colors group-hover:text-gold">
                  0{index + 1}
                </span>
                <div>
                  <p className="font-medium text-cream">{item.name}</p>
                  <p className="mt-1 text-sm leading-snug text-cream/60">{item.detail}</p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-gold">{item.label}</span>
              </li>
            ))}
          </ol>

          <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-cream/15 pt-6">
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-wider text-cream/55">Projects</dt>
              <dd className="mt-1 font-display text-2xl text-gold">
                <CountUp value={projectCount} reduced={reduced} delay={0.45} />
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-wider text-cream/55">Active</dt>
              <dd className="mt-1 font-display text-2xl text-gold">
                <CountUp value={activeCount} reduced={reduced} delay={0.55} />
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-wider text-cream/55">Shipped</dt>
              <dd className="mt-1 font-display text-2xl text-gold">
                <CountUp value={shippedCount} reduced={reduced} delay={0.65} />
              </dd>
            </div>
          </dl>
        </motion.aside>
      </div>
    </section>
  );
}
