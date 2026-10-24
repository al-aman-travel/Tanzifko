import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// لوحة التحكم قد تحفظ الحقل الاختياري الفارغ كنص فارغ ('') — نعامله كأنه غير موجود
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const optStr = () => z.preprocess(blank, z.string().optional());
const optNum = () => z.preprocess(blank, z.number().optional());
const textOrEmpty = () => z.preprocess(blank, z.string().default(''));
const list = () => z.preprocess((v) => (Array.isArray(v) ? v.filter((x) => x !== '' && x != null) : []), z.array(z.string()));

const faqs = z.preprocess(
  (v) => (Array.isArray(v) ? v : []),
  z.array(z.object({ question: z.string(), answer: z.string() })),
);

/**
 * الحاويات: ملف لكل مقاس. اسم الملف هو رابط الصفحة العربية ولا يتغير.
 * المقاسات والأبعاد من بيانات الشركة فقط — الحقل الفارغ لا يُعرض.
 */
const containers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/containers' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(), // الاسم في القوائم: «حاوية أنقاض 12 متر مكعب»
      h1: z.string(),
      capacity: z.number(), // متر مكعب
      length: optNum(), // متر
      width: optNum(),
      height: optNum(),
      accepts: list(), // المخلفات المناسبة
      notFor: optStr(), // جملة توجيه: ما لا يوضع فيها وأين يذهب
      image: z.preprocess(blank, image().optional()),
      imageAlt: optStr(),
      faqs,
      description: textOrEmpty(), // وصف جوجل
      seoTitle: optStr(),
      order: z.number().default(0),
      // الإنجليزية
      enSlug: z.string(),
      titleEn: z.string(),
      h1En: z.string(),
      acceptsEn: list(),
      notForEn: optStr(),
      imageAltEn: optStr(),
      bodyEn: textOrEmpty(),
      faqsEn: faqs,
      descriptionEn: textOrEmpty(),
      seoTitleEn: optStr(),
    }),
});

/** صور الأعمال: حاوياتنا في مواقع العمل */
const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      image: image(),
      title: z.string(), // يُستخدم وصفًا للصورة (alt) وتعليقًا تحتها
      titleEn: optStr(),
      container: optStr(), // اسم ملف الحاوية (hawiyat-anqad / hawiya-30-metr) إن كان المقاس مؤكدًا
      area: optStr(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
});

export const collections = { containers, works };
