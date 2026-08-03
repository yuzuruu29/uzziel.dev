import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Photo {
  src: string;
  caption: string;
}

interface Props {
  photos: Photo[];
}

export default function Lightbox({ photos }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openIndex === null) return;
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? null : Math.max(0, i - 1)));
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? null : Math.min(photos.length - 1, i + 1)));
    };
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = openIndex !== null ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [openIndex, photos.length]);

  const active = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            data-cursor="hover"
            className="group block w-full aspect-square rounded-md overflow-hidden border border-stone/30 hover:border-narra transition-colors"
            aria-label={`Open photo: ${p.caption}`}
          >
            <img
              src={p.src}
              alt={p.caption}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && openIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-6"
            style={{ backgroundColor: 'rgba(26, 20, 16, 0.8)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Photo lightbox"
            onClick={() => setOpenIndex(null)}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-cream/10 hover:bg-cream/20 text-cream flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpenIndex(Math.max(0, openIndex - 1)); }}
              disabled={openIndex === 0}
              aria-label="Previous"
              className="absolute left-3 md:left-6 w-10 h-10 rounded-full bg-cream/10 hover:bg-cream/20 text-cream flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpenIndex(Math.min(photos.length - 1, openIndex + 1)); }}
              disabled={openIndex === photos.length - 1}
              aria-label="Next"
              className="absolute right-3 md:right-6 w-10 h-10 rounded-full bg-cream/10 hover:bg-cream/20 text-cream flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <motion.figure
              key={active.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={active.src} alt={active.caption} className="w-full h-auto rounded-md" />
              <figcaption className="mt-3 text-center text-sm text-cream/80">{active.caption}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
