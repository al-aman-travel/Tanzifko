import type { APIRoute } from 'astro';
import { PREVIEW } from '../../site.config.mjs';
import { abs } from '../lib/url';

// قبل ربط الدومين: لا فهرسة لرابط المعاينة. بعده: محركات البحث وأدوات الذكاء الاصطناعي مسموح لها، واللوحة مستبعدة.
const bots = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot'];

export const GET: APIRoute = ({ site }) => {
  const body = PREVIEW
    ? 'User-agent: *\nDisallow: /\n'
    : `${[...bots, '*'].map((ua) => `User-agent: ${ua}\nAllow: /\nDisallow: /admin/\n`).join('\n')}\nSitemap: ${abs('/sitemap-index.xml', site)}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
