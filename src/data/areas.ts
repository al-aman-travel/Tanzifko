/**
 * مناطق الخدمة: المالك أكّد أن الشركة تخدم جميع مناطق الكويت بلا استثناء.
 * القوائم أدناه أسماء مناطق فعلية في كل محافظة (للتوضيح والبحث المحلي)، وليست ادعاء مشاريع منفّذة فيها.
 * صفحة واحدة تجمعها (لا صفحة لكل منطقة — الصفحات المتشابهة يعاقب عليها جوجل).
 */
export type Area = { ar: string; en: string };
export type Governorate = { id: string; ar: string; en: string; areas: Area[] };

export const governorateAreas: Governorate[] = [
  {
    id: 'capital', ar: 'محافظة العاصمة', en: 'Capital Governorate',
    areas: [
      { ar: 'مدينة الكويت', en: 'Kuwait City' }, { ar: 'الشويخ', en: 'Shuwaikh' }, { ar: 'الشامية', en: 'Shamiya' }, { ar: 'كيفان', en: 'Kaifan' },
      { ar: 'الروضة', en: 'Rawda' }, { ar: 'العديلية', en: 'Adailiya' }, { ar: 'الخالدية', en: 'Khaldiya' }, { ar: 'الدسمة', en: 'Dasma' },
      { ar: 'الفيحاء', en: 'Faiha' }, { ar: 'القادسية', en: 'Qadsiya' }, { ar: 'اليرموك', en: 'Yarmouk' }, { ar: 'الصليبخات', en: 'Sulaibikhat' }, { ar: 'غرناطة', en: 'Granada' },
    ],
  },
  {
    id: 'hawalli', ar: 'محافظة حولي', en: 'Hawalli Governorate',
    areas: [
      { ar: 'حولي', en: 'Hawalli' }, { ar: 'السالمية', en: 'Salmiya' }, { ar: 'الجابرية', en: 'Jabriya' }, { ar: 'الرميثية', en: 'Rumaithiya' },
      { ar: 'مشرف', en: 'Mishref' }, { ar: 'بيان', en: 'Bayan' }, { ar: 'سلوى', en: 'Salwa' }, { ar: 'الشعب', en: 'Shaab' },
      { ar: 'الزهراء', en: 'Zahra' }, { ar: 'الصديق', en: 'Siddiq' }, { ar: 'حطين', en: 'Hittin' }, { ar: 'الشهداء', en: 'Shuhada' }, { ar: 'السلام', en: 'Salam' },
    ],
  },
  {
    id: 'farwaniya', ar: 'محافظة الفروانية', en: 'Farwaniya Governorate',
    areas: [
      { ar: 'الفروانية', en: 'Farwaniya' }, { ar: 'خيطان', en: 'Khaitan' }, { ar: 'جليب الشيوخ', en: 'Jleeb Al-Shuyoukh' }, { ar: 'العمرية', en: 'Omariya' },
      { ar: 'الرابية', en: 'Rabiya' }, { ar: 'الأندلس', en: 'Andalus' }, { ar: 'الرقعي', en: 'Riggae' }, { ar: 'العارضية', en: 'Ardiya' },
      { ar: 'الفردوس', en: 'Firdous' }, { ar: 'إشبيلية', en: 'Ishbiliya' }, { ar: 'الضجيج', en: 'Dajeej' }, { ar: 'عبدالله المبارك', en: 'Abdullah Al-Mubarak' },
    ],
  },
  {
    id: 'ahmadi', ar: 'محافظة الأحمدي', en: 'Ahmadi Governorate',
    areas: [
      { ar: 'الأحمدي', en: 'Ahmadi' }, { ar: 'الفحيحيل', en: 'Fahaheel' }, { ar: 'المنقف', en: 'Mangaf' }, { ar: 'أبو حليفة', en: 'Abu Halifa' },
      { ar: 'الفنطاس', en: 'Fintas' }, { ar: 'المهبولة', en: 'Mahboula' }, { ar: 'الصباحية', en: 'Sabahiya' }, { ar: 'الرقة', en: 'Riqqa' },
      { ar: 'هدية', en: 'Hadiya' }, { ar: 'جابر العلي', en: 'Jaber Al-Ali' }, { ar: 'العقيلة', en: 'Egaila' }, { ar: 'الوفرة', en: 'Wafra' },
      { ar: 'الخيران', en: 'Khairan' }, { ar: 'مدينة صباح الأحمد', en: 'Sabah Al-Ahmad City' },
    ],
  },
  {
    id: 'jahra', ar: 'محافظة الجهراء', en: 'Jahra Governorate',
    areas: [
      { ar: 'الجهراء', en: 'Jahra' }, { ar: 'الواحة', en: 'Waha' }, { ar: 'القصر', en: 'Qasr' }, { ar: 'النعيم', en: 'Naeem' },
      { ar: 'العيون', en: 'Oyoun' }, { ar: 'النسيم', en: 'Naseem' }, { ar: 'تيماء', en: 'Taima' }, { ar: 'سعد العبدالله', en: 'Saad Al-Abdullah' },
      { ar: 'الصليبية', en: 'Sulaibiya' }, { ar: 'أمغرة', en: 'Amghara' }, { ar: 'مدينة المطلاع', en: 'Mutlaa City' }, { ar: 'مدينة جابر الأحمد', en: 'Jaber Al-Ahmad City' },
    ],
  },
  {
    id: 'mubarak-alkabeer', ar: 'محافظة مبارك الكبير', en: 'Mubarak Al-Kabeer Governorate',
    areas: [
      { ar: 'صباح السالم', en: 'Sabah Al-Salem' }, { ar: 'العدان', en: 'Adan' }, { ar: 'القرين', en: 'Qurain' }, { ar: 'القصور', en: 'Qusour' },
      { ar: 'المسيلة', en: 'Messila' }, { ar: 'أبو فطيرة', en: 'Abu Fatira' }, { ar: 'الفنيطيس', en: 'Funaitees' }, { ar: 'المسايل', en: 'Masayel' }, { ar: 'أبو الحصانية', en: 'Abu Al-Hasaniya' },
    ],
  },
];

/** المدن السكنية الجديدة — أعمال بناء وتشطيب كثيرة تحتاج حاويات أنقاض */
export const newCities: Area[] = [
  { ar: 'مدينة المطلاع', en: 'Mutlaa City' },
  { ar: 'مدينة جابر الأحمد', en: 'Jaber Al-Ahmad City' },
  { ar: 'مدينة صباح الأحمد', en: 'Sabah Al-Ahmad City' },
  { ar: 'الخيران', en: 'Khairan' },
  { ar: 'عبدالله المبارك', en: 'Abdullah Al-Mubarak' },
];

/** مناطق صناعية وحرفية */
export const industrialAreas: Area[] = [
  { ar: 'الشويخ الصناعية', en: 'Shuwaikh Industrial' },
  { ar: 'الري', en: 'Al-Rai' },
  { ar: 'العارضية الحرفية', en: 'Ardiya Craft Area' },
  { ar: 'أمغرة', en: 'Amghara' },
  { ar: 'الصليبية', en: 'Sulaibiya' },
  { ar: 'الشعيبة الصناعية', en: 'Shuaiba Industrial' },
];

/** أنواع المشاريع (من صور أعمال الشركة: ترميم فلل، مبانٍ تجارية، مخازن، أنابيب تنزيل مخلفات من مبانٍ) */
export const projectTypes = [
  { ar: 'بناء جديد', en: 'New construction', textAr: 'مخلفات مواقع البناء من طابوق وخرسانة وبقايا مواد.', textEn: 'Construction site waste such as bricks and leftover materials.' },
  { ar: 'هدم', en: 'Demolition', textAr: 'أنقاض الهدم الكلي أو الجزئي للمباني والملاحق.', textEn: 'Rubble from full or partial demolition of buildings and annexes.' },
  { ar: 'ترميم وتجديد', en: 'Renovation', textAr: 'ترميم المنازل والفلل والشقق وإزالة البلاط والرخام القديم.', textEn: 'Renovating homes, villas and flats, including removing old tiles and marble.' },
  { ar: 'تشطيبات', en: 'Finishing works', textAr: 'مخلفات التشطيبات من أخشاب وكرتون ومواد تغليف.', textEn: 'Finishing waste such as wood, cardboard and packaging.' },
  { ar: 'محلات ومخازن', en: 'Shops and warehouses', textAr: 'تفريغ المخازن والمحلات من الكرتون والأخشاب والطبليات.', textEn: 'Clearing cardboard, wood and pallets from shops and warehouses.' },
];
