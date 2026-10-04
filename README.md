# What is Instabart?

Instabart is a collection of nifty links that makes life as a NTNU student a tad easier. You can see it in action at [instabart.no](http://instabart.no).

As an NTNU student there are lots of useful websites at your disposal. Unfortunately, finding them is nearly impossible. Even if you know what you're looking for, good luck finding it via the [university website](http://xkcd.com/773/). Instabart solves this problem by collecting all the things you need in one place.

## 🌍 Internationalization (i18n)

Instabart supports multiple languages with Norwegian (Bokmål) as the default and English and Dutch as additional languages. Translations are stored in per-language JSON files under `src/i18n/` and the language selector is available in the top-right corner of the page.

### Supported Languages

**English (en)** - English language support
**Norwegian Bokmål (nb)** - Default language
**Dutch (nl)** - Dutch language support

### Adding New Languages

Adding support for a new language is now extremely simple - just add a new JSON translation file!

### File-based translations

Translations are now stored as JSON files in `src/i18n/`. Each language has its own file named with the language code (for example `en.json`, `nb.json`). The translation utilities in `src/i18n/utils.ts` import these files and expose the same helpers as before.

#### 1. Create Your Translation File

Create a new JSON file in `src/i18n/` named with your language code (e.g., `nl.json` for Dutch). Copy all keys from `en.json` and translate the values:

```json
{
  "nav.home": "Home",
  "nav.about": "Over",
  "nav.twitter": "Twitter",
  "site.title": "Instabart",
  "site.tagline": "Alles wat een NTNU-student nodig heeft... behalve koffie"
  // ... copy all keys from en.json and translate the values
}
```

#### 2. Import Your Translation

Add an import for your new language in `src/i18n/utils.ts`:

```typescript
// Import all translation files
import en from './en.json';
import nb from './nb.json';
import nl from './nl.json'; // Add this line

const allTranslations = {
  en,
  nb,
  nl, // Add this line
} as const;

// Language display names - add new languages here too
export const languages = {
  en: 'English',
  nb: 'Norsk',
  nl: 'Nederlands', // Add this line
} as const;
```

#### 3. Update Astro Configuration

Add your language to the `locales` array in `astro.config.mjs`:

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'nb',
    locales: ['en', 'nb', 'nl'], // Add your language here
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

#### 4. Create Language-Specific Pages

Create a new directory and page for your language in `src/pages/`:

```
src/pages/nl/index.astro
```

Copy the content from `src/pages/en/index.astro` and update the language in the `useTranslations` call:

```astro
const t = useTranslations('nl'); // Change this line
```

That's it! Your new language will automatically be available in the language selector.

#### 5. Translation Keys Reference

All translation keys are defined in `src/i18n/en.json`. Make sure to include all the same keys in your new language file. The current keys include:
'site.title': 'Instabart',
'site.tagline': 'Site tagline in your language',
// ... add all translation keys
},
} as const;

````

#### 3. Update Language Mapping (if needed)

If your language requires a specific HTML lang attribute format, update the `langMap` in `src/components/Page.astro`:

```typescript
const langMap = {
  'en': 'en',
  'nb': 'nb-NO',
  'your-language-code': 'your-html-lang-code', // Add this line
};
````

#### 4. Create Language-Specific Pages

Create a new directory and page for your language in `src/pages/`:

```
src/pages/your-language-code/index.astro
```

Copy the content from `src/pages/en/index.astro` and update the language in the `useTranslations` call. The `useTranslations` helper continues to work the same way but now reads from the JSON files:

```astro
---
// ... other imports
import { useTranslations } from '../../i18n/utils';

const t = useTranslations('your-language-code'); // Change this line
---
```

#### 5. Translation Keys Reference

Here are all the translation keys you need to provide:

````typescript
Create a JSON object with the same keys as shown below and place it in `src/i18n/<lang>.json`.

Example `src/i18n/your-language-code.json`:

```json
{
  "nav.home": "Home",
  "nav.about": "About",
  "nav.twitter": "Twitter",
  "site.title": "Instabart",
  "site.tagline": "Everything an NTNU student needs... except for coffee",
  "cards.blackboard": "Blackboard",
  "cards.email": "E-post",
  "cards.schedule": "Schedule",
  "cards.microsoft365": "Office 365",
  "cards.studentweb": "Studentweb",
  "cards.room_reservation": "Book room",
  "cards.map": "Campus map",
  "cards.printing": "Printing",
  "cards.literature_search": "Literature search",
  "cards.pdf": "Edit PDF",
  "cards.dictionary": "Dictionaries",
  "cards.exercise": "Exercise",
  "cards.canteen": "Canteen",
  "footer.about": "About",
  "footer.feedback": "Feedback",
  "footer.schedule_settings": "Schedule settings",
  "footer.theme": "Theme",
  "taglines": [
    "Array of fun taglines in your language",
    "Each item should be a string",
    "You can include <strong>HTML</strong> formatting"
  ],
  "language.selector": "Language",
  "language.switch": "Switch language"
}
````

````

#### 6. Test Your Implementation

1. Start the development server: `npm run dev`
2. Navigate to `/your-language-code` to test your new language
3. Verify that the language selector shows your language option
4. Check that all text is properly translated

### Language Routing

The application uses Astro's built-in i18n routing:

- **Default language (Norwegian Bokmål)**: Available at `/` (no language prefix)
- **Other languages**: Available at `/language-code/` (e.g., `/en/` for English and `/nl/` for Dutch)

The language selector automatically handles URL generation and navigation between languages while preserving the current page context.

### Development Tips

- Use consistent translation keys across all languages
- Test all navigation scenarios when adding a new language
- Consider cultural context when translating (not just literal translation)
- The taglines array can contain HTML for formatting (e.g., `<strong>` tags)
- Always provide fallbacks to Norwegian Bokmål if a translation is missing

## 🚀 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
````

## 📁 Project Structure

```
/
├── public/
│   ├── locales/          # Legacy locale structure (can be removed)
│   └── ...
├── src/
│   ├── components/
│   │   ├── LanguageSelector.astro  # Language switching component
│   │   └── ...
│   ├── content/          # Page content components
│   ├── i18n/
│   │   └── utils.ts      # Translation utilities and language definitions
│   ├── pages/
│   │   ├── index.astro   # Norwegian home page
│   │   ├── en/
│   │   │   └── index.astro  # English home page
│   │   └── nl/
│   │       └── index.astro  # Dutch home page
│   └── ...
└── ...
```
