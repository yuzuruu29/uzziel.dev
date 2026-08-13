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
  { name: 'Needs vs. Wants', detail: 'Android spending trainer', label: 'Shipping' },
];

// Last word carries the italic accent.
const HEADLINE = ['I', 'design,', 'build,', 'and', 'ship.'];

const now = new Date();
const DESK_STAMP = `${String(now.getMonth() + 1).padStart(2, '0')} / ${now.getFullYear()}`;

/* Server and client must render identical markup, so reduced motion is
   expressed only through durations/delays (and the global CSS kill-switch),
   never through conditional structure — that would break hydration. */

function CountUp({ value, reduced, delay = 0.5 }: { value: number; reduced: boolean; delay?: number }) {
  const [display, setDisplay] = useState(0);

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

function HeadlineWord({
  word,
  index,
  last,
  reduced,
}: {
  word: string;
  index: number;
  last: boolean;
  reduced: boolean;
}) {
  return (
    <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: '115%' }}
        animate={{ y: 0 }}
        transition={{
          duration: reduced ? 0 : 0.8,
          delay: reduced ? 0 : 0.12 + index * 0.08,
          ease: motionTokens.easing.smooth,
        }}
      >
        {last ? (
          <em className="text-accent" style={{ letterSpacing: '-0.02em' }}>
            {word}
          </em>
        ) : (
          word
        )}
      </motion.span>
      {!last ? '\u00a0' : ''}
    </span>
  );
}

export default function Hero({ projectCount, activeCount, shippedCount }: HeroProps) {
  const reduced = useReducedMotion() ?? false;
  const enter = (delay = 0) => ({
    initial: { opacity: 0, y: motionTokens.distance.md },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0 : motionTokens.duration.slow,
      delay: reduced ? 0 : delay,
      ease: motionTokens.easing.smooth,
    },
  });

  return (
    <section className="relative">
      <div className="container pt-8 md:pt-12">
        {/* Ledger meta row */}
        <motion.div
          {...enter(0)}
          className="meta-mono flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-4"
        >
          <span>Emmanuel Uzziel A. Malolos — Portfolio</span>
          <span className="hidden sm:inline">Bay · Laguna — 14.18°N, 121.28°E — GMT+8</span>
        </motion.div>

        <div className="grid gap-12 pb-16 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-24">
          {/* Headline column */}
          <div className="flex flex-col justify-center lg:col-span-8">
            <motion.p {...enter(0.05)} className="eyebrow">
              Full-stack creator · ACEU AI Solutions co-founder
            </motion.p>

            <h1
              className="mt-6 text-ink dark:text-cream"
              style={{
                fontSize: 'clamp(3rem, 9.5vw, 8.25rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.03em',
                maxWidth: '12ch',
              }}
              aria-label="I design, build, and ship."
            >
              <span aria-hidden="true">
                {HEADLINE.map((word, i) => (
                  <HeadlineWord
                    key={word}
                    word={word}
                    index={i}
                    last={i === HEADLINE.length - 1}
                    reduced={reduced}
                  />
                ))}
              </span>
            </h1>

            <motion.p {...enter(0.35)} className="mt-8 max-w-xl text-lg leading-relaxed text-stone md:text-xl">
              I turn business problems, rough workflows, and game ideas into tested systems people can actually use.
            </motion.p>

            <motion.div {...enter(0.45)} className="mt-10 flex flex-wrap items-center gap-3">
              <a href="/work" data-cursor="hover" data-magnetic className="button-primary">
                Explore the work
                <span aria-hidden="true">↗</span>
              </a>
              <a href="/contact" data-cursor="hover" data-magnetic className="button-secondary">
                Start a conversation
              </a>
            </motion.div>

            <motion.p {...enter(0.55)} className="mt-9 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping bg-leaf opacity-60" />
                <span className="relative inline-flex h-2 w-2 bg-leaf" />
              </span>
              Open to focused freelance and product collaborations
            </motion.p>
          </div>

          {/* Portrait column */}
          <motion.figure
            initial={{ opacity: 0, y: motionTokens.distance.lg }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0 : motionTokens.duration.slow,
              delay: reduced ? 0 : 0.25,
              ease: motionTokens.easing.smooth,
            }}
            className="relative mx-auto w-full max-w-sm self-center lg:col-span-4 lg:max-w-none"
          >
            <div className="relative">
              {/* Offset gold frame */}
              <div
                className="absolute -bottom-3 -right-3 h-full w-full border border-gold/50"
                aria-hidden="true"
              ></div>
              <div className="relative overflow-hidden border border-line-strong">
                <img
                  src="/photos/uzziel-formal.png"
                  alt="Uzziel Malolos — formal portrait"
                  width="640"
                  height="800"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="aspect-[4/5] w-full object-cover"
                />
                {/* Photo dissolves into the page — the dither signature. */}
                <div className="dither-up dither-page absolute inset-x-0 bottom-0" aria-hidden="true"></div>
              </div>
            </div>
            <figcaption className="meta-mono mt-4 flex items-center justify-between gap-4">
              <span>Uzziel Malolos</span>
              <span>Bay, Laguna — PH</span>
            </figcaption>
          </motion.figure>
        </div>
      </div>

      {/* Desk band — the working ledger, full bleed on ink */}
      <motion.div {...enter(0.3)} aria-label="Current work and portfolio statistics">
        <div className="dither-up dither-ink" aria-hidden="true"></div>
        <div className="section-ink relative overflow-hidden">
          <div className="ledger-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true"></div>
          <div className="container relative py-10 md:py-12">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
              <p className="meta-mono text-gold">On the desk — {DESK_STAMP}</p>
              <p className="meta-mono hidden md:block">Work in motion</p>
            </div>

            <ol className="grid divide-y divide-[rgba(244,236,216,0.14)] md:grid-cols-3 md:divide-x md:divide-y-0">
              {CURRENT_DESK.map((item, index) => (
                <li
                  key={item.name}
                  className="group flex items-start gap-4 py-6 transition-colors duration-200 hover:bg-cream/[0.03] md:px-6 md:first:pl-0 md:last:pr-0"
                >
                  <span className="font-mono text-[11px] leading-6 text-cream/50 transition-colors group-hover:text-gold">
                    0{index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-xl text-cream">{item.name}</p>
                    <p className="mt-1 text-sm leading-snug text-cream/60">{item.detail}</p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-gold">{item.label}</p>
                  </div>
                </li>
              ))}
            </ol>

            <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                { label: 'Projects', value: projectCount, delay: 0.45 },
                { label: 'Active', value: activeCount, delay: 0.55 },
                { label: 'Shipped', value: shippedCount, delay: 0.65 },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-3">
                  <dt className="order-2 font-mono text-[9px] uppercase tracking-[0.16em] text-cream/55">
                    {stat.label}
                  </dt>
                  <dd className="order-1 font-display text-3xl text-gold md:text-4xl">
                    <CountUp value={stat.value} reduced={reduced} delay={stat.delay} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="dither-down dither-ink" aria-hidden="true"></div>
      </motion.div>
    </section>
  );
}
