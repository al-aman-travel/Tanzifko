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
  /** الاسم القانوني كما في السجل التجاري */
  legalName: clean(settings.legalName),
  crNumber: clean(settings.crNumber),
  licenseNumber: clean(settings.licenseNumber),
  short: clean(settings.nameAr).replace(/^شركة\s+/, ''),
  shortEn: clean(settings.nameEn).replace(/\s+Company$/i, ''),
  whatsapp: digits(settings.whatsapp),
  phone: digits(settings.phone),
  extraPhones: (settings.extraPhones as string[]).map(digits).filter(Boolean),
  openingHoursText: clean(settings.openingHoursText),
  openingHoursTextEn: clean(settings.openingHoursTextEn),
  /** ساعات العمل لجوجل (24 ساعة): من اللوحة، مثل 07:00 و22:00 */
  openingHours: clean(settings.opens) && clean(settings.closes) ? { opens: clean(settings.opens), closes: clean(settings.closes) } : null,
  address: clean(settings.address),
  addressEn: clean(settings.addressEn),
  mapUrl: clean(settings.mapUrl),
  /** إحداثيات موقع الشركة على خرائط جوجل */
  geo: clean(settings.latitude) && clean(settings.longitude) ? { latitude: Number(settings.latitude), longitude: Number(settings.longitude) } : null,
  email: clean(settings.email),
  sameAs: [settings.instagram].map(clean).filter(Boolean),
  clients: (settings.clients as { name: string; nameEn?: string }[]).filter((c) => clean(c.name)),
  locale: 'ar_KW',
};

/** جملة الترخيص — من السجل التجاري، تظهر في صفحة المقاولين وتذييل الموقع */
export const licenseText = business.crNumber
  ? `شركة ذات مسؤولية محدودة، سجل تجاري رقم ${business.crNumber}، مرخّصة لنشاط نقل النفايات الصلبة والسائلة وخدمات التنظيف العام للمباني، وحاصلة على موافقة بلدية الكويت والهيئة العامة للبيئة.`
  : '';
export const licenseTextEn = business.crNumber
  ? `A limited liability company, commercial registration no. ${business.crNumber}, licensed for solid and liquid waste transport and general building cleaning, with approvals from Kuwait Municipality and the Environment Public Authority.`
  : '';

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

/** مناطق الخدمة: جميع مناطق الكويت بلا استثناء (كما أكّده المالك) — المحافظات الست */
export const governorates = [
  { ar: 'محافظة العاصمة', en: 'Capital Governorate' },
  { ar: 'محافظة حولي', en: 'Hawalli Governorate' },
  { ar: 'محافظة الفروانية', en: 'Farwaniya Governorate' },
  { ar: 'محافظة الأحمدي', en: 'Ahmadi Governorate' },
  { ar: 'محافظة الجهراء', en: 'Jahra Governorate' },
  { ar: 'محافظة مبارك الكبير', en: 'Mubarak Al-Kabeer Governorate' },
];

/** الأسعار حسب الطلب — تُرسل عبر واتساب (لا أسعار منشورة) */
export const priceFaq = (whatsapp: string) => ({
  question: 'كم سعر ايجار حاوية انقاض؟',
  answer: `السعر حسب الطلب. أرسل نوع المخلفات والمقاس ومنطقة العمل عبر واتساب ${whatsapp}، ونرسل لك السعر.`,
});
export const priceFaqEn = (whatsapp: string) => ({
  question: 'How much does it cost to rent a rubble container?',
  answer: `Prices are given on request. Send the waste type, container size and work area on WhatsApp +965 ${whatsapp}, and we will send you the price.`,
});
export const areasFaq = { question: 'هل تخدمون جميع مناطق الكويت؟', answer: 'نعم، نخدم جميع مناطق الكويت بلا استثناء، في المحافظات الست: العاصمة وحولي والفروانية والأحمدي والجهراء ومبارك الكبير.' };
export const areasFaqEn = { question: 'Do you serve all areas of Kuwait?', answer: 'Yes. We serve every area of Kuwait without exception, across all six governorates: Capital, Hawalli, Farwaniya, Ahmadi, Jahra and Mubarak Al-Kabeer.' };

/** تفصيل الحاويات حسب الطلب (كما ذكره المالك): نصمّم ونفصّل الحاوية بالمقاس الذي تطلبه الشركة */
export const custom = {
  title: 'تفصيل حاويات حسب الطلب',
  titleEn: 'Custom-made containers',
  short: 'نفصّل ونصمّم الحاوية بالمقاس الذي تطلبه الشركة.',
  shortEn: 'We design and build containers to the size your company requests.',
  path: '/tafseel-hawiyat/',
  pathEn: '/en/custom-containers/',
};
