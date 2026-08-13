import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorState = {
  hovering: boolean;
  pressed: boolean;
  label: string | null;
  hidden: boolean;
};

const INTERACTIVE = 'a, button, [role="button"], [data-cursor="hover"]';
const TYPING = 'input, textarea, select, [contenteditable="true"]';

export default function CursorCompanion() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>({
    hovering: false,
    pressed: false,
    label: null,
    hidden: true,
  });
  // Keeps the pill text visible while it fades out after leaving a labelled target.
  const lastLabel = useRef<string>('');
  if (state.label) lastLabel.current = state.label;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // The dot tracks tight; the ring trails behind it.
  const dotX = useSpring(x, { stiffness: 900, damping: 60, mass: 0.3 });
  const dotY = useSpring(y, { stiffness: 900, damping: 60, mass: 0.3 });
  const ringX = useSpring(x, { stiffness: 240, damping: 24, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 240, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduced) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target instanceof Element ? e.target : null;
      const hovering = !!target?.closest(INTERACTIVE);
      const label = target?.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel ?? null;
      const hidden = !!target?.closest(TYPING);
      setState((prev) =>
        prev.hovering === hovering && prev.label === label && prev.hidden === hidden
          ? prev
          : { ...prev, hovering, label, hidden },
      );
    };
    const onDown = () => setState((prev) => ({ ...prev, pressed: true }));
    const onUp = () => setState((prev) => ({ ...prev, pressed: false }));
    const onLeave = () => setState((prev) => ({ ...prev, hidden: true }));
    const onEnter = () => setState((prev) => ({ ...prev, hidden: false }));

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, [x, y]);

  if (!enabled) return null;

  const pressScale = state.pressed ? 0.75 : 1;
  const showLabel = !!state.label && !state.hidden;

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={false}
        style={{
          position: 'fixed',
          left: ringX,
          top: ringY,
          translateX: '-50%',
          translateY: '-50%',
          borderRadius: 9999,
          border: '1.5px solid #c9a14a',
          pointerEvents: 'none',
          zIndex: 9997,
          mixBlendMode: 'difference',
        }}
        animate={{
          width: state.hovering ? 52 : 34,
          height: state.hovering ? 52 : 34,
          opacity: state.hidden ? 0 : state.hovering ? 0.9 : 0.5,
          scale: pressScale,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        aria-hidden="true"
        initial={false}
        style={{
          position: 'fixed',
          left: dotX,
          top: dotY,
          translateX: '-50%',
          translateY: '-50%',
          borderRadius: 9999,
          backgroundColor: '#c9a14a',
          pointerEvents: 'none',
          zIndex: 9998,
          mixBlendMode: 'difference',
        }}
        animate={{
          width: state.hovering ? 5 : 10,
          height: state.hovering ? 5 : 10,
          opacity: state.hidden ? 0 : 1,
          scale: pressScale,
        }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        aria-hidden="true"
        initial={false}
        style={{
          position: 'fixed',
          left: dotX,
          top: dotY,
          translateX: 18,
          translateY: 20,
          pointerEvents: 'none',
          zIndex: 9999,
          backgroundColor: '#c9a14a',
          color: '#1a1410',
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '5px 9px',
          borderRadius: 9999,
          whiteSpace: 'nowrap',
        }}
        animate={{
          opacity: showLabel ? 1 : 0,
          scale: showLabel ? 1 : 0.6,
          y: showLabel ? 0 : 6,
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {state.label ?? lastLabel.current}
      </motion.div>
    </>
  );
}
