import type { APIRoute } from 'astro';
import { business, description, descriptionEn, operations, licenseText, custom, restaurants } from '../data/business';
import { containers, dims } from '../lib/content';
import { abs } from '../lib/url';

// ملخص واضح للشركة لأدوات الذكاء الاصطناعي (llms.txt)
export const GET: APIRoute = async ({ site }) => {
  const u = (p: string) => abs(p, site);
  const list = await containers();
  const lines = [
    `# ${business.name} (${business.nameEn})`,
    '',
    `> ${description}`,
    '',
    `> ${descriptionEn}`,
    '',
    '## معلومات الشركة',
    `- الاسم الرسمي: ${business.name} — يُكتب دائمًا «${business.short}» كاملًا.`,
    ...(business.legalName ? [`- الاسم في السجل التجاري: ${business.legalName}`] : []),
    ...(licenseText ? [`- الترخيص: ${licenseText}`] : []),
    `- الطلب: واتساب ${business.whatsapp} (+965${business.whatsapp}).`,
    ...(business.phone && business.phone !== business.whatsapp ? [`- الهاتف: ${business.phone}`] : []),
    ...(business.address ? [`- العنوان: ${business.address}`] : []),
    ...(business.openingHoursText ? [`- ساعات العمل: ${business.openingHoursText}`] : []),
    '- منطقة الخدمة: جميع مناطق الكويت بلا استثناء (المحافظات الست).',
    '- الأسعار: حسب الطلب، تُرسل عبر واتساب.',
    ...(business.mapUrl ? [`- موقع الشركة على الخريطة: ${business.mapUrl}`] : []),
    '',
    '## الحاويات',
    ...list.map((c) => {
      const s = dims(c);
      return `- [${c.data.title}](${u(`/${c.id}/`)}): ${c.data.accepts.join('، ')}${s ? `. الأبعاد ${s}` : ''}.`;
    }),
    '',
    '## الخدمات',
    ...operations.map((o) => `- ${o.title}: ${o.text}`),
    `- [${custom.title}](${u(custom.path)}): ${custom.short}`,
    `- [${restaurants.title}](${u(restaurants.path)}): ${restaurants.short}`,
    '- عقود شهرية وسنوية للشركات والمشاريع والمطاعم، إلى جانب الطلب لمرة واحدة.',
    '',
    ...(business.clients.length
      ? ['## عقود وسابقة أعمال', '- لدينا عقود مع شركات مقاولات كبرى في الكويت، وسابقة أعمال مع شركات الترميم والمقاولات الهندسية والتشطيبات، منها:', ...business.clients.map((c) => `  - ${c.name}`), '']
      : []),
    '## صفحات أخرى',
    `- [مناطق الخدمة: جميع مناطق الكويت](${u('/manatiq-alkhidma/')})`,
    `- [دليل مقاسات حاويات الأنقاض](${u('/maqasat-hawiyat/')})`,
    `- [حاويات للمقاولين والشركات](${u('/hawiyat-lilmuqawilin/')})`,
    `- [صور الأعمال](${u('/aamaluna/')})`,
    `- [اطلب حاوية](${u('/talab-hawiya/')})`,
    '',
    '## English',
    `- [${business.nameEn} — waste container rental in Kuwait](${u('/en/')})`,
    ...list.map((c) => {
      const s = dims(c, true);
      return `- [${c.data.titleEn}](${u(`/en/${c.data.enSlug}/`)}): ${c.data.acceptsEn.join(', ')}${s ? `. Size ${s}` : ''}.`;
    }),
    `- [Service areas — all of Kuwait](${u('/en/service-areas/')})`,
    `- [Skip sizes guide](${u('/en/container-sizes/')})`,
    `- [Skip hire for contractors and projects](${u('/en/contractors/')})`,
    `- Skip hire in every area of Kuwait. Orders on WhatsApp: +965${business.whatsapp}.`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
