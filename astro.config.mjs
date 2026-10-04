import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  i18n: {
    defaultLocale: 'nb',
    locales: ['en', 'nb'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
