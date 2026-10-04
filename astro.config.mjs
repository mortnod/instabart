import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import { defaultLang, languageCodes } from './src/i18n/config.ts';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  i18n: {
    defaultLocale: defaultLang,
    locales: languageCodes,
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
