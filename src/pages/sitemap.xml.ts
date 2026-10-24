import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { containers, works } from '../lib/content';
import { abs } from '../lib/url';
import { lastmod } from '../lib/lastmod';
import { custom } from '../data/business';
import { PREVIEW } from '../../site.config.mjs';

/**
 * خريطة الموقع: كل صفحة عربية ومقابلتها الإنجليزية مع روابط hreflang متبادلة (xhtml:link)،
 * وصور الصفحة الحقيقية (image:image)، وتاريخ آخر تعديل من git.
 * قبل ربط الدومين تُنشر فارغة (رابط المعاينة لا يُفهرس).
 */
type Entry = { ar: string; en?: string; files: string[]; images?: { src: ImageMetadata; title: string }[] };

const SHARED = ['src/data/settings.json', 'src/data/business.ts'];
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  if (PREVIEW) {
    return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n', {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }
  const list = await containers();
  const all = await works();
  const featured = all.filter((w) => w.data.featured);
  const workFiles = all.map((w) => `src/content/works/${w.id}.md`);
  const img = (w: (typeof all)[number]) => ({ src: w.data.image, title: w.data.title });

  const entries: Entry[] = [
    { ar: '/', en: '/en/', files: ['src/pages/index.astro', 'src/pages/en/index.astro', ...SHARED, ...workFiles], images: featured.map(img) },
    ...list.map((c) => ({
      ar: `/${c.id}/`,
      en: `/en/${c.data.enSlug}/`,
      files: ['src/pages/[container].astro', 'src/pages/en/[slug].astro', `src/content/containers/${c.id}.md`, ...SHARED],
      images: [
        ...(c.data.image ? [{ src: c.data.image, title: c.data.imageAlt ?? c.data.title }] : []),
        ...all.filter((w) => w.data.container === c.id).slice(0, 6).map(img),
      ],
    })),
    { ar: '/manatiq-alkhidma/', en: '/en/service-areas/', files: ['src/pages/manatiq-alkhidma.astro', 'src/pages/en/service-areas.astro', 'src/data/areas.ts', ...SHARED] },
    { ar: '/maqasat-hawiyat/', en: '/en/container-sizes/', files: ['src/pages/maqasat-hawiyat.astro', 'src/pages/en/container-sizes.astro', 'src/content/containers', ...SHARED] },
    { ar: custom.path, en: custom.pathEn, files: ['src/pages/tafseel-hawiyat.astro', 'src/pages/en/custom-containers.astro', ...SHARED] },
    { ar: '/hawiyat-lilmuqawilin/', en: '/en/contractors/', files: ['src/pages/hawiyat-lilmuqawilin.astro', 'src/pages/en/contractors.astro', 'src/data/areas.ts', ...SHARED, ...workFiles] },
    { ar: '/aamaluna/', en: '/en/our-work/', files: ['src/pages/aamaluna.astro', 'src/pages/en/our-work.astro', 'src/content/works'], images: all.map(img) },
    { ar: '/talab-hawiya/', en: '/en/request/', files: ['src/pages/talab-hawiya.astro', 'src/pages/en/request.astro', 'src/components/RequestForm.astro', ...SHARED] },
  ];

  // رابط ثابت لكل صورة (WebP بعرض 1200) — نفس الملف يُنشر ضمن البناء
  const imageUrl = async (src: ImageMetadata) => new URL((await getImage({ src, width: Math.min(1200, src.width), format: 'webp' })).src, site).toString();

  const urls: string[] = [];
  for (const e of entries) {
    const mod = lastmod(e.files);
    const images = await Promise.all((e.images ?? []).map(async (i) => ({ loc: await imageUrl(i.src), title: i.title })));
    const alts = [
      `    <xhtml:link rel="alternate" hreflang="ar-KW" href="${abs(e.ar, site)}"/>`,
      ...(e.en ? [`    <xhtml:link rel="alternate" hreflang="en" href="${abs(e.en, site)}"/>`] : []),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(e.ar, site)}"/>`,
    ].join('\n');
    for (const [path, isEn] of [[e.ar, false], ...(e.en ? [[e.en, true]] : [])] as [string, boolean][]) {
      const imgXml = images.map((i) => `    <image:image>\n      <image:loc>${esc(i.loc)}</image:loc>\n    </image:image>`).join('\n');
      urls.push(
        [
          '  <url>',
          `    <loc>${abs(path, site)}</loc>`,
          ...(mod ? [`    <lastmod>${mod}</lastmod>`] : []),
          alts,
          // الصور تُدرج مع الصفحة العربية فقط (الصفحة الإنجليزية تعرض الصور نفسها)
          ...(!isEn && imgXml ? [imgXml] : []),
          '  </url>',
        ].join('\n'),
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
