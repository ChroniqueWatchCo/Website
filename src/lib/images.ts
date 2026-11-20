/**
 * Image URL helper (Section 12).
 * Single swap point: if we move off Sanity's CDN later, only this file changes.
 *
 * For Sanity assets we build cdn.sanity.io URLs with explicit widths,
 * auto format (AVIF/WebP negotiated), q=72 and crop using the hotspot.
 * For local placeholder images we just serve the static file.
 */
import type { ProductImage } from './types';

export interface ImgAttrs {
  src: string;
  srcset?: string;
  sizes?: string;
  width: number;
  height: number;
  alt: string;
}

const CARD_WIDTHS = [240, 320, 480, 640];
const PAGE_WIDTHS = [320, 480, 640, 800, 1200, 1600];

export const CARD_SIZES = '(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw';
export const GALLERY_SIZES = '(min-width:900px) 50vw, 92vw';

function sanityBase(assetId: string): string {
  // assetId like "image-<projectId>-<dataset>-<hash>-jpg"
  const parts = assetId.split('-');
  const ext = parts.pop() ?? 'jpg';
  const hash = parts.pop();
  const dataset = parts.shift(); // after "image"
  parts.shift(); // drop "image"
  const projectId = parts.shift();
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${hash}.${ext}`;
}

function sanityUrl(base: string, w: number, h: number, img: ProductImage): string {
  const params = new URLSearchParams({
    w: String(w),
    h: String(h),
    fit: 'crop',
    fm: 'webp',
    q: '72',
  });
  if (img.hotspot) {
    params.set('rect', `${img.hotspot.x},${img.hotspot.y},${img.hotspot.width},${img.hotspot.height}`);
  }
  return `${base}?${params.toString()}`;
}

/** Build a square 1:1 image at the given display width. */
export function productImage(img: ProductImage, widths: number[], sizes: string): ImgAttrs {
  if (!img.assetId && img.local) {
    // Local image (placeholder or repo-hosted photo in /public/img): single src.
    return { src: img.local, width: img.width || 800, height: img.height || 800, alt: img.alt };
  }
  const base = sanityBase(img.assetId);
  const srcset = widths.map((w) => `${sanityUrl(base, w, w, img)} ${w}w`).join(', ');
  return {
    src: sanityUrl(base, widths[Math.min(2, widths.length - 1)], widths[Math.min(2, widths.length - 1)], img),
    srcset,
    sizes,
    width: img.width || 800,
    height: img.height || 800,
    alt: img.alt,
  };
}

export function cardImage(img: ProductImage): ImgAttrs {
  return productImage(img, CARD_WIDTHS, CARD_SIZES);
}

export function galleryImage(img: ProductImage): ImgAttrs {
  return productImage(img, PAGE_WIDTHS, GALLERY_SIZES);
}

/** Largest version for native-viewer tap-through links on product pages. */
export function fullImage(img: ProductImage): string {
  if (!img.assetId && img.local) return img.local;
  return sanityUrl(sanityBase(img.assetId), 1600, 1600, img);
}

/** OG image: 1200x630 crop. */
export function ogImage(img: ProductImage): string {
  if (!img.assetId && img.local) return img.local;
  const base = sanityBase(img.assetId);
  const params = new URLSearchParams({ w: '1200', h: '630', fit: 'crop', fm: 'webp', q: '72' });
  if (img.hotspot) {
    params.set('rect', `${img.hotspot.x},${img.hotspot.y},${img.hotspot.width},${img.hotspot.height}`);
  }
  return `${base}?${params.toString()}`;
}
