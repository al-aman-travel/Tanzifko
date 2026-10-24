// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DOMAIN, SITE, BASE } from './site.config.mjs';

// يكتب ملف CNAME من site.config.mjs عند وجود دومين — لا ملف CNAME يدوي يُنسى
const cname = {
  name: 'cname',
  hooks: {
    /** @param {{ dir: URL }} p */
    'astro:build:done': ({ dir }) => {
      if (DOMAIN) writeFileSync(fileURLToPath(new URL('CNAME', dir)), DOMAIN + '\n');
    },
  },
};

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [
    // خريطة الموقع: src/pages/sitemap.xml.ts (hreflang + صور + lastmod من git)
    cname,
  ],
  vite: { plugins: [tailwindcss()] },
});
