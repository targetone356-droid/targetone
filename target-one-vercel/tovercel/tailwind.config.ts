import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(142 76% 36%)',
        'primary-foreground': 'hsl(0 0% 100%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222 47% 11%)',
        muted: 'hsl(210 40% 96%)',
        'muted-foreground': 'hsl(215 16% 47%)',
        border: 'hsl(214 32% 91%)',
      },
      fontFamily: {
        display: ['Cairo', 'sans-serif'],
        body: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
