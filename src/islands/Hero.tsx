import { motion, useReducedMotion } from 'framer-motion';
import { motionTokens } from '../lib/motionTokens';

type HeroProps = {
  projectCount: number;
  activeCount: number;
  shippedCount: number;
};

const CURRENT_DESK = [
  { name: 'HIVE', detail: 'Verified agentic coding runtime', label: 'Building' },
  { name: 'Pledgr', detail: 'Weekly-first money tracker', label: 'Beta' },
  { name: 'AAE 195', detail: 'Land conversion × rice productivity', label: 'Research' },
];

export default function Hero({ projectCount, activeCount, shippedCount }: HeroProps) {
  const reduced = useReducedMotion();
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
              src="/photos/uzziel-trees.webp"
              alt="Uzziel Malolos"
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
          <h1 className="mt-5 max-w-[13ch] text-ink dark:text-cream">
            I research, build, and ship.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone md:text-xl">
            I turn field questions, business problems, and game ideas into tested systems people can actually use.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <motion.a
              href="/work"
              data-cursor="hover"
              className="button-primary"
              whileTap={reduced ? undefined : { scale: 0.98 }}
            >
              Explore the work
              <span aria-hidden="true">↗</span>
            </motion.a>
            <motion.a
              href="/contact"
              data-cursor="hover"
              className="button-secondary"
              whileTap={reduced ? undefined : { scale: 0.98 }}
            >
              Start a conversation
            </motion.a>
          </div>

          <p className="mt-8 flex items-center gap-2 text-sm text-stone">
            <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" />
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
            <span className="font-mono text-xs text-gold">07 / 2026</span>
          </div>

          <ol className="divide-y divide-cream/15">
            {CURRENT_DESK.map((item, index) => (
              <li key={item.name} className="grid grid-cols-[2rem_1fr_auto] items-start gap-3 py-5">
                <span className="font-mono text-[11px] text-cream/55">0{index + 1}</span>
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
              <dd className="mt-1 font-display text-2xl text-gold">{projectCount}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-wider text-cream/55">Active</dt>
              <dd className="mt-1 font-display text-2xl text-gold">{activeCount}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-wider text-cream/55">Shipped</dt>
              <dd className="mt-1 font-display text-2xl text-gold">{shippedCount}</dd>
            </div>
          </dl>
        </motion.aside>
      </div>
    </section>
  );
}
