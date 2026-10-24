// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DOMAIN, PREVIEW, SITE, BASE } from './site.config.mjs';

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
    // خريطة الموقع تُنشأ فقط بعد ربط الدومين (رابط المعاينة لا يُفهرس)
    ...(PREVIEW ? [] : [sitemap({ filter: (page) => !page.includes('/admin/') && !page.includes('/404') })]),
    cname,
  ],
  vite: { plugins: [tailwindcss()] },
});
