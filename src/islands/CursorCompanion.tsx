import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorCompanion() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduced) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      setHovering(!!target?.closest('[data-cursor="hover"]'));
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [x, y]);

  if (!enabled) return null;

  const size = hovering ? 40 : 12;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: sx,
        top: sy,
        translateX: '-50%',
        translateY: '-50%',
        width: size,
        height: size,
        borderRadius: 9999,
        backgroundColor: hovering ? 'transparent' : '#c9a14a',
        border: hovering ? '1.5px solid #c9a14a' : 'none',
        pointerEvents: 'none',
        zIndex: 9998,
        mixBlendMode: 'difference',
        transition: 'width 200ms ease, height 200ms ease, background-color 200ms ease, border 200ms ease',
      }}
    />
  );
}
