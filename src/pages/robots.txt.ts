import type { APIRoute } from 'astro';
import { PREVIEW } from '../../site.config.mjs';
import { abs } from '../lib/url';

// قبل ربط الدومين: لا فهرسة لرابط المعاينة. بعده: محركات البحث وأدوات الذكاء الاصطناعي مسموح لها، واللوحة مستبعدة.
const bots = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'Meta-ExternalAgent', 'CCBot', 'DuckAssistBot', 'MistralAI-User', 'cohere-ai'];

export const GET: APIRoute = ({ site }) => {
  const body = PREVIEW
    ? 'User-agent: *\nDisallow: /\n'
    : `${[...bots, '*'].map((ua) => `User-agent: ${ua}\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\nAllow: /\nDisallow: /admin/\n`).join('\n')}\nSitemap: ${abs('/sitemap.xml', site)}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
