/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      screens: {
        sm: '480px', // 3 cards per column (fluid width)
        md: '640px', // 3 cards per column (fixes width)
        lg: '850px', // 4 cards per column (fixed width)
        xl: '1270px', // 6 cards per column (fixed width)
      },
      boxShadow: {
        card: '0 0 0 1px rgba(0, 0, 0, 0.10), 0 2px 5px 0 rgba(0, 0, 0, 0.10)',
        cardHover:
          '0 0 0 1px rgba(0, 0, 0, 0.13), 0 3px 6px 0 rgba(0, 0, 0, 0.10)',
      },
    },
  },
  plugins: [],
};
