/**
 * عنوان الموقع في مكان واحد.
 *
 * قبل شراء الدومين: اترك DOMAIN فارغًا. يُنشر الموقع للمعاينة على
 *   https://al-aman-travel.github.io/Tanzifko/
 * وتكون كل صفحاته noindex حتى لا يفهرس جوجل رابطًا مؤقتًا ثم ينتقل لاحقًا.
 *
 * بعد شراء الدومين وتوجيهه إلى GitHub Pages: اكتبه هنا (مثل 'tanzeefko.com') فقط.
 * البناء يضع ملف CNAME تلقائيًا، وتُفتح الفهرسة، وتتحول كل الروابط إلى الجذر.
 */
export const DOMAIN = 'hawiyatkw.com';

export const PREVIEW = !DOMAIN;
export const SITE = DOMAIN ? `https://${DOMAIN}` : 'https://al-aman-travel.github.io';
export const BASE = DOMAIN ? '/' : '/Tanzifko/';

/** خدمة الإحصائيات (Netlify): تستقبل الزيارات والنقرات وتعرض الملخص في /admin/stats.html */
export const STATS_API = 'https://hawiyatkw-stats.netlify.app';
