/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'selector',
  theme: {
    extend: {
      screens: {
        sm: '480px', // 3 cards per column (fluid width)
        md: '640px', // 3 cards per column (fixes width)
        lg: '850px', // 4 cards per column (fixed width)
        xl: '1270px', // 6 cards per column (fixed width)
      },
      boxShadow: {
        card: '0 2px 4px -1px rgba(0, 0, 0, 0.10)',
        'card-hover': '0 3px 6px -1px rgba(0, 0, 0, 0.10)',
        'card-ring': 'inset 0 0 0 1px #60a5fa, 0 0 0 2px #60a5fa', // blue 400
      },
      colors: {
        'slate-775': '#232F42',
      },
    },
  },
  plugins: [],
};
