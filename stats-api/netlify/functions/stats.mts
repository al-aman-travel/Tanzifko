import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { TYPES, TZ_OFFSET, kwDay, kwIso, decodeKey, type Ev, type EvType } from "../lib/shared.mts";

// ملخص الإحصائيات للوحة التحكم (محمي بكلمة السر STATS_PASSWORD).
// ?range=24h|7d|30d|1y — الأيام المكتملة تُلخَّص مرة واحدة وتُحفظ (agg/YYYY-MM-DD) فتبقى السنة سريعة.

const ORIGINS = ["https://hawiyatkw.com", "https://www.hawiyatkw.com", "http://localhost:4322"];
const cors = (req: Request) => {
  const o = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "x-pass",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
};

type Counts = Record<EvType, number>;
type Agg = {
  n: Counts; v: number; vs?: string[];
  pages: Record<string, number>; clicks: Record<string, number>; refs: Record<string, number>;
  dev: Record<string, number>; lang: Record<string, number>; cc: Record<string, number>;
};
const zero = (): Counts => ({ pv: 0, wa: 0, order: 0, call: 0, cta: 0, click: 0 });
const emptyAgg = (): Agg => ({ n: zero(), v: 0, pages: {}, clicks: {}, refs: {}, dev: {}, lang: {}, cc: {} });
const inc = (o: Record<string, number>, k: string, by = 1) => { if (k) o[k] = (o[k] || 0) + by; };

const summarize = (evs: Ev[]): Agg => {
  const a = emptyAgg();
  const vis = new Set<string>();
  for (const [t, p, l, h, ref, dev, lang, cc, vh] of evs) {
    a.n[t]++;
    if (t === "pv") {
      inc(a.pages, p); inc(a.refs, ref || "(مباشر)"); inc(a.dev, dev); inc(a.lang, lang); inc(a.cc, cc); vis.add(vh);
    } else {
      inc(a.clicks, `${t}\u0001${l}\u0001${p}`);
    }
  }
  a.v = vis.size;
  return a;
};
const merge = (into: Agg, a: Agg) => {
  for (const t of TYPES) into.n[t] += a.n[t];
  into.v += a.v;
  for (const k of ["pages", "clicks", "refs", "dev", "lang", "cc"] as const) for (const [x, n] of Object.entries(a[k])) inc(into[k], x, n);
};

const store = () => getStore({ name: "events", consistency: "strong" });

async function rawDay(day: string) {
  const { blobs } = await store().list({ prefix: `e/${day}/` });
  return blobs.map((b) => decodeKey(b.key)).filter((x): x is { ts: number; ev: Ev } => !!x);
}

/** ملخص يوم: المكتمل يُقرأ من التخزين أو يُحسب ويُحفظ مرة واحدة؛ اليوم الجاري يُحسب دائمًا */
async function dayAgg(day: string, today: string, existing: Set<string>): Promise<Agg> {
  if (!existing.has(day)) return emptyAgg();
  const s = store();
  if (day < today) {
    const cached = (await s.get(`agg/${day}`, { type: "json" })) as Agg | null;
    if (cached) return cached;
  }
  const a = summarize((await rawDay(day)).map((x) => x.ev));
  if (day < today) await s.setJSON(`agg/${day}`, a, { onlyIfNew: true });
  return a;
}

const top = (o: Record<string, number>, n: number) => Object.entries(o).sort((x, y) => y[1] - x[1]).slice(0, n);
const daysBack = (n: number, from: number) => Array.from({ length: n }, (_, i) => kwDay(from - (n - 1 - i) * 86400000));

export default async (req: Request) => {
  const h = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  const pass = req.headers.get("x-pass") || "";
  const want = Netlify.env.get("STATS_PASSWORD") || "";
  const enc = new TextEncoder();
  const [x, y] = [enc.encode(pass.padEnd(64).slice(0, 64)), enc.encode(want.padEnd(64).slice(0, 64))];
  let diff = pass.length === want.length && want ? 0 : 1;
  for (let i = 0; i < 64; i++) diff |= x[i] ^ y[i];
  if (diff) return Response.json({ ok: false, error: "unauthorized" }, { status: 401, headers: h });

  const range = new URL(req.url).searchParams.get("range") || "7d";
  const now = Date.now();
  const today = kwDay(now);
  const { directories } = await store().list({ prefix: "e/", directories: true });
  const existing = new Set(directories.map((d) => d.replace(/^e\//, "").replace(/\/$/, "")));

  type Point = { key: string; label: string } & Counts & { v: number };
  let series: Point[] = [];
  const total = emptyAgg();
  let prev: Counts & { v: number } | null = null;

  if (range === "24h") {
    // 48 ساعة خام: آخر 24 للعرض و24 قبلها للمقارنة
    const days = daysBack(3, now);
    const evs = (await Promise.all(days.map((d) => (existing.has(d) ? rawDay(d) : Promise.resolve([]))))).flat();
    const start = now - 24 * 3600000, pstart = start - 24 * 3600000;
    const cur = evs.filter((e) => e.ts >= start), old = evs.filter((e) => e.ts >= pstart && e.ts < start);
    merge(total, summarize(cur.map((e) => e.ev)));
    const p = summarize(old.map((e) => e.ev)); prev = { ...p.n, v: p.v };
    const hourStart = Math.floor((start + TZ_OFFSET) / 3600000) * 3600000 - TZ_OFFSET;
    series = Array.from({ length: 25 }, (_, i) => {
      const t0 = hourStart + i * 3600000;
      const a = summarize(cur.filter((e) => e.ts >= t0 && e.ts < t0 + 3600000).map((e) => e.ev));
      return { key: kwIso(t0).slice(0, 13), label: kwIso(t0).slice(11, 13) + ":00", ...a.n, v: a.v };
    }).slice(1);
  } else {
    const n = range === "30d" ? 30 : range === "1y" ? 365 : 7;
    const days = daysBack(n, now);
    const aggs = await Promise.all(days.map((d) => dayAgg(d, today, existing)));
    aggs.forEach((a) => merge(total, a));
    if (range === "1y") {
      const months = new Map<string, Agg>();
      days.forEach((d, i) => { const m = d.slice(0, 7); if (!months.has(m)) months.set(m, emptyAgg()); merge(months.get(m)!, aggs[i]); });
      series = [...months.entries()].slice(-12).map(([m, a]) => ({ key: m, label: m, ...a.n, v: a.v }));
    } else {
      series = days.map((d, i) => ({ key: d, label: d.slice(5), ...aggs[i].n, v: aggs[i].v }));
      const pdays = daysBack(n, now - n * 86400000);
      const p = emptyAgg();
      (await Promise.all(pdays.map((d) => dayAgg(d, today, existing)))).forEach((a) => merge(p, a));
      prev = { ...p.n, v: p.v };
    }
  }

  // ملخص ثابت في كل طلب: اليوم (منذ منتصف الليل بتوقيت الكويت) وآخر 7 و30 و365 يومًا
  const yearDays = daysBack(365, now);
  const yearAggs = await Promise.all(yearDays.map((d) => dayAgg(d, today, existing)));
  const sumLast = (k: number) => { const a = emptyAgg(); yearAggs.slice(-k).forEach((x) => merge(a, x)); return { ...a.n, v: a.v }; };
  const summary = { today: sumLast(1), week: sumLast(7), month: sumLast(30), year: sumLast(365) };

  const clicks = top(total.clicks, 20).map(([k, n]) => { const [t, l, p] = k.split("\u0001"); return { type: t, label: l, page: p, n }; });
  return Response.json(
    {
      ok: true, range, generatedAt: kwIso(now).slice(0, 16).replace("T", " "),
      totals: { ...total.n, v: total.v }, prev, series, clicks, summary,
      pages: top(total.pages, 12), refs: top(total.refs, 10), dev: total.dev, lang: total.lang, cc: top(total.cc, 8),
    },
    { headers: { ...h, "cache-control": "no-store" } },
  );
};

export const config: Config = { path: "/api/stats", method: ["GET", "OPTIONS"] };
