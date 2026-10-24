import { getCollection, type CollectionEntry } from 'astro:content';

export type Container = CollectionEntry<'containers'>;
export type Work = CollectionEntry<'works'>;

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
