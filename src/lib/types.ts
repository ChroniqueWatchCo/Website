/** Shared domain types for the watch store. */

export type WatchType = 'original' | 'replica';
export type Gender = 'men' | 'women' | 'unisex';
export type Movement = 'automatic' | 'quartz' | 'manual';
export type Condition = 'new' | 'pre-owned';

/** Normalized image reference used by the UI layer. */
export interface ProductImage {
  /** Sanity asset _id when available; empty for local placeholders. */
  assetId: string;
  /** Local path (dev/sample data) — used when assetId is empty. */
  local?: string;
  alt: string;
  width: number;
  height: number;
  hotspot?: { x: number; y: number; height: number; width: number };
}

export interface Spec {
  label: string;
  value: string;
}

export interface Brand {
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  type: WatchType;
  brand: Brand;
  gender: Gender;
  movement: Movement;
  chronograph: boolean;
  condition: Condition;
  price: number;
  oldPrice?: number;
  images: ProductImage[];
  shortDescription?: string;
  specs: Spec[];
  accessories: string[];
  inStock: boolean;
  featured: boolean;
  paymentNoteOverride?: string;
  sortOrder?: number;
  createdAt: string; // ISO date, for "newest" sorting / new arrivals
}

export interface TrustItem {
  text: string;
}

export interface SiteSettings {
  storeName: string;
  tagline?: string;
  whatsappNumber: string; // digits only, international format
  currencyLabel: string;  // e.g. "Rs."
  announcement?: string;
  heroImage?: ProductImage;
  heroImageMobile?: ProductImage;
  heroHeadline?: string;
  heroSubline?: string;
  trustItems: string[];
  paymentTerms?: string;
  deliveryNote?: string;
  replicaDisclosure: string;
  footerReplicaNote: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  openingHours?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: ProductImage;
}

export type PolicyCategory = 'general' | 'original' | 'replica';

/** Minimal Portable-Text-ish block model so policies render without a PT library. */
export interface PolicyBlock {
  style: 'h2' | 'h3' | 'p' | 'bullet' | 'number';
  text: string;
  /** optional link URL for paragraphs */
  href?: string;
  hrefText?: string;
}

export interface PolicyPage {
  title: string;
  slug: string;
  category: PolicyCategory;
  body: PolicyBlock[];
  sortOrder?: number;
}
