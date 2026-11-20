import { createClient, type SanityClient } from '@sanity/client';

/**
 * Sanity client + GROQ queries (Section 11.1).
 * Used ONLY at build time (Astro frontmatter / data.ts). Never imported by
 * client-side code; the live site never calls Sanity.
 */

const projectId = process.env.SANITY_PROJECT_ID ?? '';
const dataset = process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || '2025-01-01';

let client: SanityClient | null = null;

export function sanityEnabled(): boolean {
  return projectId !== '';
}

export function getClient(): SanityClient {
  if (!client) {
    client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false, // fresh data on each build
      // Public dataset: no token needed for reads.
    });
  }
  return client;
}

const imageProjection = /* groq */ `
  alt,
  "assetId": asset->_id,
  hotspot,
  "width":  asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
`;

export const productQuery = /* groq */ `
*[_type == "product"] | order(coalesce(sortOrder, 9999) asc, _createdAt desc) {
  "id": _id,
  name, slug, type, gender, movement, chronograph, condition,
  price, oldPrice, shortDescription, inStock, featured,
  paymentNoteOverride, sortOrder,
  "createdAt": _createdAt,
  specs[] { label, value },
  accessories[],
  images[] { ${imageProjection} },
  "brand": brand-> { name, "slug": slug.current }
}
`;

export const settingsQuery = /* groq */ `
*[_type == "siteSettings"][0] {
  storeName, tagline, whatsappNumber, currencyLabel, announcement,
  heroHeadline, heroSubline,
  heroImage { ${imageProjection} },
  heroImageMobile { ${imageProjection} },
  trustItems[] { "text" },
  paymentTerms, deliveryNote, replicaDisclosure, footerReplicaNote,
  contactPhone, contactEmail, address, openingHours,
  instagramUrl, facebookUrl, tiktokUrl, youtubeUrl,
  seoTitle, seoDescription,
  ogImage { ${imageProjection} }
}
`;

export const policyQuery = /* groq */ `
*[_type == "policyPage"] | order(sortOrder asc, title asc) {
  title, "slug": slug.current, category, sortOrder,
  body[] {
    "style": select(
      style == "h2" => "h2",
      style == "h3" => "h3",
      style == "bullet" => "bullet",
      style == "number" => "number",
      "p"
    ),
    "text": pt::text(@),
    "href": markDefs[style == "link"].href[0],
    "hrefText": children[mark == ^..markDefs[0]._ref].text[0]
  }
}
`;
