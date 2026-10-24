import { execFileSync } from 'node:child_process';

/**
 * تاريخ آخر تعديل حقيقي لملفات الصفحة من سجل git (لا تاريخ البناء) —
 * جوجل يعتمد lastmod فقط حين يكون صادقًا ومتسقًا.
 */
const cache = new Map<string, string | undefined>();
export function lastmod(files: string[]): string | undefined {
  const key = files.join('|');
  if (cache.has(key)) return cache.get(key);
  let out: string | undefined;
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...files], { encoding: 'utf8' }).trim();
    out = iso || undefined;
  } catch {
    out = undefined;
  }
  cache.set(key, out);
  return out;
}
