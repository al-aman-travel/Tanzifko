/**
 * كل الروابط الداخلية تمر من هنا، فتعمل في رابط المعاينة (/Tanzifko/) وبعد ربط الدومين (/) بلا تعديل.
 * href('/talab-hawiya/') → '/Tanzifko/talab-hawiya/' أثناء المعاينة.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const href = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`;
/** الرابط الكامل (للـ canonical والبيانات المنظمة) */
export const abs = (path: string, site: URL | undefined) => new URL(href(path), site).toString();
