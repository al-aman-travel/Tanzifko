/**
 * بيانات الشركة في مكان واحد. الصفحات والبيانات المنظمة وروابط واتساب كلها تقرأ من هنا،
 * فيبقى الاسم والهاتف متطابقًا في كل مكان (مهم لجوجل وأدوات الذكاء الاصطناعي).
 * القيم القابلة للتعديل في لوحة التحكم ← «بيانات الشركة» (src/data/settings.json).
 * أي حقل فارغ = معلومة لم تُؤكَّد بعد، ولا تُعرض حتى تُعبّأ.
 */
import settings from './settings.json';

const clean = (v: string | undefined) => (v ?? '').trim();
const digits = (v: string) => v.replace(/\D/g, '');

export const business = {
  name: clean(settings.nameAr),
  nameEn: clean(settings.nameEn),
  /** الاسم المختصر للعناوين: «تنظيفكو المحلية» */
  short: clean(settings.nameAr).replace(/^شركة\s+/, ''),
  shortEn: clean(settings.nameEn).replace(/\s+Company$/i, ''),
  whatsapp: digits(settings.whatsapp),
  phone: digits(settings.phone),
  extraPhones: (settings.extraPhones as string[]).map(digits).filter(Boolean),
  openingHoursText: clean(settings.openingHoursText),
  openingHoursTextEn: clean(settings.openingHoursTextEn),
  address: clean(settings.address),
  addressEn: clean(settings.addressEn),
  mapUrl: clean(settings.mapUrl),
  email: clean(settings.email),
  sameAs: [settings.instagram].map(clean).filter(Boolean),
  clients: (settings.clients as { name: string; nameEn?: string }[]).filter((c) => clean(c.name)),
  locale: 'ar_KW',
};

export const description =
  `${business.name} تؤجّر حاويات المخلفات في الكويت: حاوية أنقاض 12 متر مكعب للطابوق والرخام ومخلفات البناء، وحاوية 30 متر مكعب للأخشاب والكرتون والإطارات، مع التوصيل والتبديل والرفع. الطلب عبر واتساب ${business.whatsapp}.`;
export const descriptionEn =
  `${business.nameEn} rents waste containers in Kuwait: a 12 m³ rubble container for bricks, marble and construction waste, and a 30 m³ container for wood, cardboard and tyres, with delivery, swap and pickup. Order on WhatsApp +965 ${business.whatsapp}.`;

/** الخدمات التشغيلية الفعلية (توصيل / تبديل / رفع) */
export const operations = [
  { title: 'توصيل الحاوية', titleEn: 'Container delivery', text: 'نوصل الحاوية بالمقاس المناسب إلى موقع العمل.', textEn: 'We deliver the right container size to your site.' },
  { title: 'تبديل الحاوية', titleEn: 'Container swap', text: 'عند امتلاء الحاوية نرفعها ونضع مكانها حاوية فارغة.', textEn: 'When the container is full, we take it away and leave an empty one.' },
  { title: 'رفع الحاوية', titleEn: 'Container pickup', text: 'نرفع الحاوية من الموقع عند انتهاء العمل.', textEn: 'We collect the container when the work is finished.' },
];
