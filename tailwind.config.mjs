/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#1a1410',
        narra: '#6b3410',
        gold: '#c9a14a',
        cream: '#f4ecd8',
        stone: '#8a7d6e',
        leaf: '#4a6b3a',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Inter Tight"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
