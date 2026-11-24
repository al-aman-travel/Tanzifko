import { getCollection, type CollectionEntry } from 'astro:content';

export type Container = CollectionEntry<'containers'>;
export type Work = CollectionEntry<'works'>;
export type Guide = CollectionEntry<'guides'>;
export type GuideEn = CollectionEntry<'guidesEn'>;

export const containers = async () =>
  (await getCollection('containers')).sort((a, b) => a.data.order - b.data.order);

export const works = async (opts: { container?: string; featured?: boolean } = {}) =>
  (await getCollection('works', (w) => !w.data.draft))
    .filter((w) => (opts.container ? w.data.container === opts.container : true))
    .filter((w) => (opts.featured ? w.data.featured : true))
    .sort((a, b) => a.data.order - b.data.order);

/** «6 × 2.30 × 2.1 م» — فقط إن كانت الأبعاد الثلاثة مؤكدة */
export const dims = (c: Container, en = false) => {
  const { length, width, height } = c.data;
  if (!length || !width || !height) return '';
  const f = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));
  return `${f(length)} × ${f(width)} × ${f(height)} ${en ? 'm' : 'م'}`;
};

// النشر المجدول (طلب المالك 2026-11-24): مقال كل أسبوعين. المقال ذو التاريخ القادم لا تُبنى صفحته ولا يظهر في
// الدليل ولا خريطة الموقع ولا llms.txt حتى يحين يومه بتوقيت الكويت؛ البناء اليومي (deploy.yml) ينشره تلقائيًا.
export const todayKuwait = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuwait', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export const isDue = (d: Date) => d.toISOString().slice(0, 10) <= todayKuwait();

/** مقالات الدليل المنشورة: الأحدث أولًا */
export const guides = async () =>
  (await getCollection('guides', (g) => !g.data.draft && isDue(g.data.date))).sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.order - b.data.order);

/** أزواج (المقال العربي + نسخته الإنجليزية إن وُجدت) */
export const guidePairs = async () => {
  const en = await getCollection('guidesEn');
  return (await guides()).map((ar) => ({ ar, en: en.find((e) => e.data.ar === ar.id) }));
};

export const guidePath = (g: Guide) => `/dalil/${g.id}/`;
export const guidePathEn = (g: GuideEn) => `/en/guides/${g.id}/`;
