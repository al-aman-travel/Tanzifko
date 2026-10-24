import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/** صورة الواجهة: نفس srcset في <img> وفي preload حتى يبدأ تحميلها مبكرًا (LCP) */
export async function heroImage(src: ImageMetadata, sizes: string) {
  const img = await getImage({ src, widths: [480, 720, 960, 1200], sizes, format: 'webp' });
  return {
    src: img.src,
    srcset: img.srcSet.attribute,
    sizes,
    width: src.width,
    height: src.height,
  };
}
