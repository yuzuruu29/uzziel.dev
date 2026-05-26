import { useEffect, useRef, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'uzziel-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';

    if (!reducedMotion && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const ripple = document.createElement('span');
      ripple.className = 'theme-ripple';
      ripple.style.left = `${cx}px`;
      ripple.style.top = `${cy}px`;
      ripple.style.width = '24px';
      ripple.style.height = '24px';
      ripple.style.background = next === 'dark' ? '#1a1410' : '#f4ecd8';
      document.body.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 800);
    }

    setTheme(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <button
      ref={btnRef}
      onClick={toggle}
      data-cursor="hover"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-stone/30 hover:border-gold transition-colors"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
