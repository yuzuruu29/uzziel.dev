import { motion, useReducedMotion } from 'framer-motion';
import { splitWords } from '../lib/splitText';
import Magnetic from './Magnetic';

const HEADLINE = 'I research, build, and ship.';
const SUBHEAD = 'Agri-econ researcher and full-stack creator from Bay, Laguna.';

export default function Hero() {
  const reduced = useReducedMotion();
  const words = splitWords(HEADLINE);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="container pt-24 pb-32 md:pt-32 md:pb-40">
      <h1
        aria-label={HEADLINE}
        className="font-display font-medium leading-[0.95] tracking-tight text-ink dark:text-cream"
        style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
      >
        {words.map((w, wi) =>
          w.isSpace ? (
            <span key={`s-${wi}`} aria-hidden="true">{' '}</span>
          ) : (
            <span
              key={`w-${wi}`}
              aria-hidden="true"
              style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
            >
              {w.chars.map((c) => (
                <motion.span
                  key={c.index}
                  initial={reduced ? false : { y: 30, opacity: 0, filter: 'blur(8px)' }}
                  animate={reduced ? undefined : { y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, delay: c.index * 0.025, ease }}
                  data-index={c.index}
                  style={{ display: 'inline-block' }}
                >
                  {c.char}
                </motion.span>
              ))}
            </span>
          )
        )}
      </h1>

      <motion.p
        className="mt-6 font-sans text-lg md:text-xl text-stone max-w-xl"
        initial={reduced ? false : { y: 10, opacity: 0 }}
        animate={reduced ? undefined : { y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease }}
      >
        {SUBHEAD}
      </motion.p>

      <motion.div
        className="mt-10 flex flex-wrap items-center gap-4"
        initial={reduced ? false : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9, ease }}
      >
        <Magnetic>
          <a
            href="/work"
            data-cursor="hover"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-ink font-medium tracking-wide hover:bg-gold/90 transition-colors"
          >
            See the work
            <span aria-hidden="true">→</span>
          </a>
        </Magnetic>

        <a
          href="/research"
          data-cursor="hover"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-current font-medium tracking-wide hover:text-gold transition-colors"
        >
          Read the thesis
        </a>
      </motion.div>
    </section>
  );
}
