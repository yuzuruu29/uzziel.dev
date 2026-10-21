import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type HeroProps = { projectCount: number };

export default function Hero({ projectCount }: HeroProps) {
  const section = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const gameTransform = useTransform(scrollYProgress, [0, 1], [
    'translateY(0px) rotate(-6deg)', 'translateY(-55px) rotate(-2deg)',
  ]);
  const webTransform = useTransform(scrollYProgress, [0, 1], [
    'translateY(0px) rotate(7deg)', 'translateY(-100px) rotate(2deg)',
  ]);
  const appTransform = useTransform(scrollYProgress, [0, 1], [
    'translateY(0px) rotate(4deg)', 'translateY(-25px) rotate(-3deg)',
  ]);

  return (
    <section ref={section} className="hero-section relative" aria-labelledby="hero-heading">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-5 text-xs text-stone">
          <span>Emmanuel Uzziel A. Malolos</span>
          <span>Independent creator · Bay, Laguna, PH</span>
        </div>
        <div className="hero-layout grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-4 lg:py-20">
          <div className="relative z-10">
            <div className="mb-7 flex items-center gap-3">
              <img src="/photos/uzziel-formal.png" alt="Uzziel Malolos" width="48" height="48" className="h-12 w-12 rounded-full object-cover object-top" />
              <p className="text-sm leading-snug text-stone">Full-stack creator.<br /><span className="text-ink dark:text-cream">A little bit of everything. All the way through.</span></p>
            </div>
            <h1 id="hero-heading" className="hero-heading" aria-label="I design, build, and ship.">
              <span className="hero-line" aria-hidden="true"><span>I design,</span></span>
              <span className="hero-line" aria-hidden="true"><span>build, and</span></span>
              <span className="hero-line" aria-hidden="true"><em className="text-accent">ship.</em></span>
            </h1>
            <p className="mt-7 max-w-[37ch] text-lg leading-relaxed text-stone">
              Useful apps. Worlds you can get lost in. Websites for real businesses.
              Made with care, from the Philippines.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#selected-work" data-cursor="hover" data-magnetic className="button-primary">Explore my work <span aria-hidden="true">↘</span></a>
              <a href="/contact" data-cursor="hover" className="button-secondary">Let’s make something <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="hero-stage" aria-label="A few things I’ve made">
            <div className="hero-stage-orbit" aria-hidden="true"></div>
            <span className="hero-stage-note" aria-hidden="true">From the working desk</span>
            <motion.a href="/work/long-way-around" className="hero-artifact hero-artifact-game" style={{ transform: reduced ? 'none' : gameTransform }} data-cursor-label="Explore Long Way Around">
              <div className="artifact-chrome"><span className="flex gap-1" aria-hidden="true"><i /><i /><i /></span><span>Long Way Around · A pixel RPG</span></div>
              <img src="/work/project-screenshots/long-way-around/village.png" alt="Long Way Around: a pixel-art conversation in the village" width="1153" height="646" fetchPriority="high" className="aspect-video w-full object-cover" />
              <div className="artifact-caption"><span>There’s a story around here.</span><span aria-hidden="true">↗</span></div>
            </motion.a>
            <motion.a href="/work/saklay" className="hero-artifact hero-artifact-web" style={{ transform: reduced ? 'none' : webTransform }} data-cursor-label="Explore Saklay">
              <div className="artifact-chrome"><span className="flex gap-1" aria-hidden="true"><i /><i /><i /></span><span>saklay · Community website</span></div>
              <img src="/work/project-screenshots/saklay-home-live.png" alt="Saklay community website with its warm editorial design" width="1440" height="900" loading="eager" className="aspect-[16/10] w-full object-cover object-top" />
            </motion.a>
            <motion.a href="/work/eco-man" className="hero-artifact hero-artifact-app" style={{ transform: reduced ? 'none' : appTransform }} data-cursor-label="Explore Eco-Man">
              <img src="/work/eco-man/today.webp" alt="Eco-Man, an Android record book, showing this month’s sales, expenses, and a Scan a receipt button" width="540" height="1128" className="block w-full" />
              <img src="/logos/eco-man.webp" alt="" width="52" height="52" className="hero-app-badge app-logo" />
            </motion.a>
            <span className="hero-stage-caption">Games, websites & things that work.</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-stone">
          <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" /> Open to freelance & product collaborations</p>
          <a href="/work" className="link-line" data-cursor="hover">{projectCount} projects, and counting <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
