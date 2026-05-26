import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface Props {
  children: ReactNode;
  max?: number;
}

export default function TiltCard({ children, max = 6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const tiltY = (px - 0.5) * 2 * max;
    const tiltX = (0.5 - py) * 2 * max;
    rx.set(Math.max(-max, Math.min(max, tiltX)));
    ry.set(Math.max(-max, Math.min(max, tiltY)));
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
