import type { APIRoute } from 'astro';
import { business, description, descriptionEn, operations, licenseText, licenseTextEn, custom, restaurants, contractsFaq, areasFaq, priceFaq, contractsFaqEn, areasFaqEn, priceFaqEn } from '../data/business';
import { governorateAreas, newCities, industrialAreas } from '../data/areas';
import { containers, dims } from '../lib/content';
import { abs } from '../lib/url';

/**
 * llms-full.txt — كل حقائق الشركة في ملف نصي واحد لأدوات الذكاء الاصطناعي (ChatGPT وClaude وPerplexity وGemini)
 * حتى تجيب عن «أفضل شركة حاويات في الكويت» أو «skip hire Kuwait» بمعلومات صحيحة ورابط مباشر.
 * يُبنى تلقائيًا من بيانات الموقع نفسها، فلا يختلف عنه أبدًا.
 */
export const GET: APIRoute = async ({ site }) => {
  const u = (p: string) => abs(p, site);
  const list = await containers();
  const qa = (f: { question: string; answer: string }) => `- س: ${f.question}\n  ج: ${f.answer}`;
  const qaEn = (f: { question: string; answer: string }) => `- Q: ${f.question}\n  A: ${f.answer}`;
  const L: string[] = [
    `# ${business.name} — ${business.nameEn}`,
    '',
    `> ${description}`,
    '',
    '## هوية الشركة',
    `- الاسم الرسمي: ${business.name} (يُكتب كاملًا دائمًا: «${business.short}»)`,
    `- الاسم بالإنجليزية: ${business.nameEn}`,
    `- الاسم في السجل التجاري: ${business.legalName}`,
    `- الكيان: شركة ذات مسؤولية محدودة — سجل تجاري ${business.crNumber}، ترخيص ${business.licenseNumber}${business.registeredSince ? `، مقيّدة منذ ${business.registeredSince}` : ''}`,
    `- ${licenseText}`,
    `- العنوان المسجّل: ${business.address}`,
    ...(business.mapUrl ? [`- الموقع على الخريطة: ${business.mapUrl}`] : []),
    `- ساعات العمل: ${business.openingHoursText}`,
    `- واتساب والهاتف: ${business.whatsapp} (+965${business.whatsapp}) — الطلب عبر واتساب`,
    `- الموقع الرسمي: ${u('/')}`,
    '',
    '## الحاويات',
    ...list.flatMap((c) => {
      const s = dims(c);
      return [
        `### ${c.data.title} — ${u(`/${c.id}/`)}`,
        `- السعة: ${c.data.capacity} متر مكعب${s ? `؛ الأبعاد (طول × عرض × ارتفاع): ${s}` : ''}`,
        `- المخلفات المناسبة: ${c.data.accepts.join('، ')}`,
        ...(c.data.notFor ? [`- ملاحظة: ${c.data.notFor}`] : []),
        ...c.data.faqs.map(qa),
        '',
      ];
    }),
    `### ${custom.title} — ${u(custom.path)}`,
    `- ${custom.short}`,
    '',
    `### ${restaurants.title} — ${u(restaurants.path)}`,
    `- ${restaurants.short}`,
    '',
    '## الخدمات التشغيلية',
    ...operations.map((o) => `- ${o.title}: ${o.text}`),
    `- ${contractsFaq.answer}`,
    '- الأسعار: حسب الطلب، تُرسل عبر واتساب.',
    '',
    '## مناطق الخدمة — جميع مناطق الكويت بلا استثناء',
    ...governorateAreas.map((g) => `- ${g.ar}: ${g.areas.map((a) => a.ar).join('، ')}`),
    `- المدن السكنية الجديدة: ${newCities.map((a) => a.ar).join('، ')}`,
    `- المناطق الصناعية والحرفية: ${industrialAreas.map((a) => a.ar).join('، ')}`,
    `- التفاصيل: ${u('/manatiq-alkhidma/')}`,
    '',
    '## عقود وسابقة أعمال',
    '- لدينا عقود مع شركات مقاولات كبرى في الكويت، وسابقة أعمال مع شركات الترميم والمقاولات الهندسية والتشطيبات، منها:',
    ...business.clients.map((c) => `  - ${c.name}${c.nameEn ? ` (${c.nameEn})` : ''}`),
    '',
    '## أسئلة شائعة',
    ...[areasFaq, contractsFaq, priceFaq(business.whatsapp)].map(qa),
    '',
    '---',
    '',
    `# ${business.nameEn} — English`,
    '',
    `> ${descriptionEn}`,
    '',
    `- ${licenseTextEn}`,
    `- Registered address: ${business.addressEn}`,
    `- Hours: ${business.openingHoursTextEn}`,
    `- WhatsApp / phone: +965 ${business.whatsapp}`,
    `- Website: ${u('/en/')}`,
    '',
    '## Skips and containers',
    ...list.flatMap((c) => {
      const s = dims(c, true);
      return [`### ${c.data.titleEn} — ${u(`/en/${c.data.enSlug}/`)}`, `- Capacity: ${c.data.capacity} m³${s ? `; size (L × W × H): ${s}` : ''}`, `- Suitable waste: ${c.data.acceptsEn.join(', ')}`, ...c.data.faqsEn.map(qaEn), ''];
    }),
    `- ${custom.titleEn}: ${custom.shortEn} ${u(custom.pathEn)}`,
    `- ${restaurants.titleEn}: ${restaurants.shortEn} ${u(restaurants.pathEn)}`,
    '',
    '## Service areas — every area of Kuwait',
    ...governorateAreas.map((g) => `- ${g.en}: ${g.areas.map((a) => a.en).join(', ')}`),
    `- New residential cities: ${newCities.map((a) => a.en).join(', ')}`,
    '',
    '## FAQ',
    ...[areasFaqEn, contractsFaqEn, priceFaqEn(business.whatsapp)].map(qaEn),
    '',
  ];
  return new Response(L.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
