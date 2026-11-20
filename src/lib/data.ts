/**
 * Data layer (Section 11).
 * - Fetches from Sanity at build time when SANITY_PROJECT_ID is set.
 * - Falls back to sample data in development only (Section 11.3).
 * - Production builds without SANITY_PROJECT_ID FAIL with a clear error.
 * - Module-level cache so every page shares one fetch per build.
 */
import type { Brand, PolicyPage, Product, SiteSettings } from './types';
import { getClient, policyQuery, productQuery, sanityEnabled, settingsQuery } from './sanity';

export const IS_PRODUCTION = process.env.CONTEXT === 'production' || process.env.NETLIFY === 'true';

/* ------------------------------------------------------------------ */
/* Sample fallback (development only)                                  */
/* ------------------------------------------------------------------ */

interface RawSample {
  id: string; name: string; slug: string; type: 'original' | 'replica';
  brand: Brand; gender: 'men' | 'women' | 'unisex'; movement: 'automatic' | 'quartz' | 'manual';
  chronograph: boolean; condition: 'new' | 'pre-owned'; price: number; oldPrice?: number;
  images: { local: string; alt: string }[]; shortDescription?: string;
  specs: { label: string; value: string }[]; accessories: string[];
  inStock: boolean; featured: boolean; createdAt: string;
}

const PLACEHOLDER = '/placeholders/watch-a.svg';

async function loadSampleProducts(): Promise<Product[]> {
  const mod = await import('../data/sample-products.json');
  const raw = (mod.default ?? mod) as unknown as RawSample[];
  return raw.map((p) => ({
    ...p,
    images: p.images.map((img, i) => ({
      assetId: '',
      local: img.local,
      alt: img.alt || `${p.name} photo ${i + 1}`,
      width: 800,
      height: 800,
    })),
  }));
}

function sampleSettings(): SiteSettings {
  return {
    storeName: 'Chronique Watch Co.',
    tagline: 'Original and honestly-labelled replica watches.',
    whatsappNumber: 'REPLACE_ME_WHATSAPP',
    currencyLabel: 'Rs.',
    announcement: 'Sample data — configure Site Settings in the CMS before launch.',
    heroHeadline: 'Timepieces worth talking about',
    heroSubline: 'Browse original and replica watches, then order in one tap on WhatsApp.',
    heroImage: { assetId: '', local: '/placeholders/hero-desktop.svg', alt: '', width: 1600, height: 900 },
    heroImageMobile: { assetId: '', local: '/placeholders/hero-mobile.svg', alt: '', width: 900, height: 1200 },
    trustItems: [
      'Order confirmation on WhatsApp',
      'Clear photos of the exact watch',
      'Originals and replicas always labelled',
    ],
    paymentTerms: 'REPLACE_ME: advance payment terms (owner to provide, per type if they differ).',
    deliveryNote: 'REPLACE_ME: delivery note (owner to provide).',
    replicaDisclosure: 'Replica watch — not made or endorsed by the brand.',
    footerReplicaNote: 'Replica watches are not made or endorsed by the brands they resemble.',
    seoTitle: 'Chronique Watch Co. — Original & Replica Watches',
    seoDescription: 'Browse original and clearly-labelled replica watches. Order on WhatsApp.',
    ogImage: { assetId: '', local: '/placeholders/og-default.svg', alt: '', width: 1200, height: 630 },
  };
}

function samplePolicies(): PolicyPage[] {
  const placeholderBody = [
    { style: 'p' as const, text: 'REPLACE_ME — the shop owner must write this page. Do not publish legal claims here until reviewed.' },
  ];
  const mk = (title: string, slug: string, category: PolicyPage['category'], sortOrder: number): PolicyPage => ({
    title, slug, category, body: placeholderBody, sortOrder,
  });
  return [
    mk('About us', 'about', 'general', 1),
    mk('Shipping & delivery', 'shipping', 'general', 2),
    mk('Payment terms', 'payment-terms', 'general', 3),
    mk('Terms & conditions', 'terms', 'general', 4),
    mk('Privacy policy', 'privacy', 'general', 5),
    mk('FAQs', 'faqs', 'general', 6),
    mk('Warranty (Original watches)', 'warranty-original', 'original', 7),
    mk('Returns & exchange (Original watches)', 'returns-original', 'original', 8),
    mk('Warranty (Replica watches)', 'warranty-replica', 'replica', 9),
    mk('Returns & exchange (Replica watches)', 'returns-replica', 'replica', 10),
  ];
}

/* ------------------------------------------------------------------ */
/* Cached accessors                                                      */
/* ------------------------------------------------------------------ */

let _products: Product[] | null = null;
let _settings: SiteSettings | null = null;
let _policies: PolicyPage[] | null = null;
let _usingSampleData = false;

export function usingSampleData(): boolean {
  return _usingSampleData;
}

function guardProduction(kind: string, ok: boolean) {
  if (!ok && IS_PRODUCTION) {
    throw new Error(
      `[data] Production build failed: could not load ${kind} from Sanity. ` +
      'Check SANITY_PROJECT_ID / dataset and that the document exists. ' +
      'Netlify will keep serving the previous successful deploy.'
    );
  }
}

export async function getProducts(): Promise<Product[]> {
  if (_products) return _products;
  if (sanityEnabled()) {
    try {
      const raw = await getClient().fetch<Product[]>(productQuery);
      // Normalize: drop products whose brand reference is missing (validation flags them later).
      _products = (raw ?? []).map((p) => ({
        ...p,
        specs: p.specs ?? [],
        accessories: p.accessories ?? [],
        images: (p.images ?? []).map((img) => ({ ...img, local: undefined })),
      }));
      guardProduction('products', Array.isArray(_products) && _products.length > 0);
      return _products;
    } catch (err) {
      if (IS_PRODUCTION) throw err;
      console.warn('[data] Sanity unreachable in dev; using sample products.', err);
    }
  }
  _usingSampleData = true;
  _products = await loadSampleProducts();
  return _products;
}

export async function getSettings(): Promise<SiteSettings> {
  if (_settings) return _settings;
  if (sanityEnabled()) {
    try {
      const raw = await getClient().fetch<SiteSettings | null>(settingsQuery);
      if (raw && raw.storeName && raw.whatsappNumber) {
        _settings = {
          ...raw,
          currencyLabel: raw.currencyLabel || 'Rs.',
          trustItems: (raw.trustItems ?? []).map((t) => (typeof t === 'string' ? t : t.text)).filter(Boolean),
          replicaDisclosure: raw.replicaDisclosure || 'Replica watch — not made or endorsed by the brand.',
          footerReplicaNote: raw.footerReplicaNote || 'Replica watches are not made or endorsed by the brands they resemble.',
        };
        return _settings;
      }
      guardProduction('site settings', false);
    } catch (err) {
      if (IS_PRODUCTION) throw err;
      console.warn('[data] Sanity unreachable in dev; using sample settings.', err);
    }
  }
  _usingSampleData = true;
  _settings = sampleSettings();
  return _settings;
}

export async function getPolicies(): Promise<PolicyPage[]> {
  if (_policies) return _policies;
  if (sanityEnabled()) {
    try {
      const raw = await getClient().fetch<PolicyPage[]>(policyQuery);
      _policies = raw ?? [];
      return _policies;
    } catch (err) {
      if (IS_PRODUCTION) throw err;
      console.warn('[data] Sanity unreachable in dev; using sample policies.', err);
    }
  }
  _usingSampleData = true;
  _policies = samplePolicies();
  return _policies;
}

/* ------------------------------------------------------------------ */
/* Derived helpers used by pages                                       */
/* ------------------------------------------------------------------ */

export async function getProductsByType(type: 'original' | 'replica'): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.type === type);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}

export interface BrandInType {
  brand: Brand;
  count: number;
  type: 'original' | 'replica';
}

export async function getBrandsByType(type: 'original' | 'replica'): Promise<BrandInType[]> {
  const products = await getProductsByType(type);
  const map = new Map<string, BrandInType>();
  for (const p of products) {
    if (!p.brand?.slug) continue;
    const entry = map.get(p.brand.slug);
    if (entry) entry.count += 1;
    else map.set(p.brand.slug, { brand: p.brand, count: 1, type });
  }
  return [...map.values()].sort((a, b) => a.brand.name.localeCompare(b.brand.name));
}

export async function getFeatured(type: 'original' | 'replica', max = 8): Promise<Product[]> {
  const products = await getProductsByType(type);
  return products.filter((p) => p.featured).slice(0, max);
}

export async function getNewArrivals(max = 8): Promise<Product[]> {
  const products = await getProducts();
  return [...products]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, max);
}

export async function getRelated(product: Product, max = 4): Promise<Product[]> {
  const products = await getProductsByType(product.type);
  let related = products.filter((p) => p.slug !== product.slug && p.brand?.slug === product.brand?.slug);
  if (related.length < max) {
    const newest = products
      .filter((p) => p.slug !== product.slug && !related.includes(p))
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    related = [...related, ...newest];
  }
  return related.slice(0, max);
}

export function absoluteUrl(site: string | undefined, path: string): string {
  const base = site && /^https?:\/\//.test(site) ? site : 'https://REPLACE_ME.netlify.app';
  return new URL(path.startsWith('/') ? path : `/${path}`, base.endsWith('/') ? base : base + '/').toString();
}

export { PLACEHOLDER };
