// مشترك بين دالتي الاستقبال والملخص
export const TZ_OFFSET = 3 * 3600 * 1000; // الكويت UTC+3 بلا توقيت صيفي
export const kwIso = (ms: number) => new Date(ms + TZ_OFFSET).toISOString();
export const kwDay = (ms: number) => kwIso(ms).slice(0, 10);
export const TYPES = ["pv", "wa", "order", "call", "cta", "click"] as const;
export type EvType = (typeof TYPES)[number];
// [type, path, label, href, ref, device, lang, country, visitor, hour]
export type Ev = [EvType, string, string, string, string, string, string, string, string, string];

export const b64url = (s: string) => Buffer.from(s, "utf8").toString("base64url");
export const fromB64url = (s: string) => Buffer.from(s, "base64url").toString("utf8");

/** المفتاح يحمل بيانات الحدث كاملة، فقراءة يوم = استعلام list واحد بلا تحميل ملفات */
export const decodeKey = (key: string): { ts: number; ev: Ev } | null => {
  const name = key.slice(key.lastIndexOf("/") + 1);
  const dot = name.indexOf(".");
  if (dot < 0) return null;
  const ts = Number(name.slice(0, name.indexOf("-")));
  try {
    const ev = JSON.parse(fromB64url(name.slice(dot + 1))) as Ev;
    return Array.isArray(ev) && ev.length >= 10 ? { ts, ev } : null;
  } catch {
    return null;
  }
};
