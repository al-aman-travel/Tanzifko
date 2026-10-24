import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { TYPES, kwIso, b64url, type EvType } from "../lib/shared.mts";

// يستقبل حدثًا واحدًا من الموقع (زيارة صفحة أو نقرة) عبر navigator.sendBeacon.
// بلا كوكيز ولا تخزين IP: الزائر يُميَّز ببصمة يومية مجهولة (SHA-256 لعنوان IP والمتصفح مع ملح يتغير كل يوم).

const SITE_HOSTS = ["hawiyatkw.com", "www.hawiyatkw.com"];
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|gtmetrix|facebookexternalhit|whatsapp|telegram|python|curl|wget|httpclient|java\//i;
const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";

const sha = async (s: string) => {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Buffer.from(d).toString("hex");
};

export default async (req: Request, context: Context) => {
  const done = new Response(null, { status: 204 });
  if (req.method !== "POST") return done;
  const ua = req.headers.get("user-agent") || "";
  if (!ua || BOT.test(ua)) return done;
  const origin = req.headers.get("origin");
  if (origin) {
    try { if (!SITE_HOSTS.includes(new URL(origin).hostname)) return done; } catch { return done; }
  }
  let b: Record<string, unknown>;
  try { b = JSON.parse((await req.text()).slice(0, 2000)); } catch { return done; }
  const t = String(b.t) as EvType;
  if (!TYPES.includes(t)) return done;
  const p = clean(b.p, 120);
  if (!p.startsWith("/") || p.startsWith("/admin")) return done;
  let l = clean(b.l, 60);
  const h = clean(b.h, 120);
  let ref = "";
  try {
    const r = new URL(String(b.r || ""));
    if (!SITE_HOSTS.includes(r.hostname)) ref = r.hostname.replace(/^www\./, "");
  } catch {}
  const w = Number(b.w);
  const dev = w > 0 && w < 768 ? "m" : "d";
  const lang = p.startsWith("/en/") ? "en" : "ar";
  const now = Date.now();
  const iso = kwIso(now);
  const day = iso.slice(0, 10);
  const hour = iso.slice(11, 13);
  const salt = Netlify.env.get("VISITOR_SALT") || "";
  const vh = (await sha(`${salt}|${day}|${context.ip}|${ua}`)).slice(0, 10);
  const country = context.geo?.country?.code || "";
  const rand = crypto.randomUUID().slice(0, 6);
  const mk = () => `e/${day}/${now}-${rand}.${b64url(JSON.stringify([t, p, l, h, ref, dev, lang, country, vh, hour]))}`;
  let key = mk();
  while (new TextEncoder().encode(key).length > 590 && l.length > 0) { l = l.slice(0, -5); key = mk(); }
  context.waitUntil(getStore("events").set(key, "1"));
  return done;
};

export const config: Config = {
  path: "/api/e",
  method: ["POST"],
  rateLimit: { windowLimit: 120, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
