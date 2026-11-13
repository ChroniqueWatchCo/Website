# WATCH STORE WEBSITE — FULL BUILD SPECIFICATION

> This document is the single source of truth for building the site. Read all of it before writing any code. Follow it exactly. Where something is marked **[ASK USER]**, stop and ask the human instead of guessing or inventing a value.

---

## 0. RULES OF ENGAGEMENT (READ FIRST)

1. **Work in the phases defined in Section 20.** Finish one phase, run its acceptance checks, commit, then move on. Do not skip ahead.
2. **Never invent business facts.** Store name, WhatsApp number, prices, policies, warranty terms, addresses, reviews and ratings must come from the human or from the CMS. Use clearly marked placeholders (`REPLACE_ME`) where a value is missing.
3. **No fake social proof.** No made-up reviews, star ratings, "sold X units" counters, or testimonials.
4. **Speed is the top requirement.** Every decision is judged by: does it make the site faster, smoother and more stable on a mid-range Android phone over a slow mobile connection? If a feature adds weight or lag, drop it or make it lighter.
5. **Keep it simple.** No UI frameworks (no React/Vue/Svelte), no jQuery, no Tailwind, no animation libraries, no carousels libraries, no icon libraries, no cart/checkout system. Use plain Astro components, plain CSS and tiny vanilla JavaScript only where unavoidable.
6. **Pin dependency versions** and commit the lockfile. Do not add a dependency without stating why it is needed.
7. **Do not copy content from the reference site** (images, text, logo, layout code). We only borrow its *structure ideas* (Section 3).
8. **Ask before doing anything irreversible** (deleting repos, force pushing, publishing to production with placeholder data).
9. After each phase, print a short summary: what was done, what was tested, what is still open.

---

## 1. PROJECT SUMMARY

A fast, dark-themed online catalogue for a watch shop owned by the human's friend.

- **Sells two product types:** **Original** watches and **Replica** watches. The two are always clearly and honestly labelled (Section 2).
- **No online payments, no cart, no accounts.** Customers browse, open a product page, and tap **Order on WhatsApp**, which opens a WhatsApp chat with the shop's number and a pre-filled message about that exact watch.
- **Not Shopify.** The site is a static site (pre-built HTML) so it loads instantly. Product data is managed by the shop owner in **Sanity CMS**; hosting is on **Netlify**.
- **Research phase is finished; this is the build phase.**

### Must-have qualities (non-negotiable)
- Loads fast **at all times**, especially on mobile devices, with **no perceptible lag** when scrolling, tapping or navigating.
- Mobile-first, fully responsive.
- Stable: it should not break when the owner edits content, and a bad edit must never take the live site down.
- Owner can add/edit/remove products and change the WhatsApp number **without touching code**.

### Colour theme
Dark theme using a mix of **black, gold and silver** (Section 7).

---

## 2. BUSINESS RULES: ORIGINAL vs REPLICA (HONEST LABELLING)

The human confirmed the categories will be made clear in every product. Build this into the structure so it cannot be forgotten:

1. **Two top-level categories:** `Original` and `Replica` appear in the main navigation and have their own collection pages and brand sub-pages.
2. **Every product has a required `type` field** with exactly two allowed values: `original` or `replica`. The CMS must not allow publishing a product without it (required dropdown, no default).
3. **Badge on every product card and every product page.**
   - Original badge: solid gold background, black text, text `ORIGINAL`.
   - Replica badge: transparent background, silver 1px border, silver text, text `REPLICA`.
4. **Replica disclosure line** shown near the price on every Replica product page and in the WhatsApp message: *"Replica watch — not made or endorsed by the brand."* (Text lives in Site Settings so the owner can edit the wording, but the line itself cannot be removed from replica pages.)
5. **Separate policies per type:** warranty, returns/exchange and any other terms are separate documents for Original and Replica, because they normally differ. Policy links on a product page must point to the correct type's policy.
6. **Never use "100% authentic", "authentic guarantee", "genuine" or similar claims on Replica products or in site-wide text** that would apply to Replicas. Trust-strip items and any "authenticity" wording must either be per-type or be written so they are true for both (e.g. "Clear photos of the exact watch", "Order confirmation on WhatsApp"). Trust items are editable by the owner in the CMS; do not hard-code authenticity claims.
7. **Do not use brand logos** in the site design. Brand names appear as plain text only (product titles, brand filter tiles drawn as text/wordmark tiles in our own style). Brand photos/logos are not to be downloaded or hot-linked.
8. The Original/Replica **filters, URLs, page titles and meta descriptions** must reflect the type (e.g. `/replica/` page title includes "Replica Watches").
9. **[Note to the human, include in README]**: selling replicas that carry another brand's name or marks can create legal and platform (Instagram/Meta, ads) risks. The owner is responsible for compliance in their country. The site's honest labelling is a minimum, not legal advice.

---

## 3. REFERENCE SITE ANALYSIS (what we learned)

Reference: `visionairebrandstore.live` — a Shopify store selling **only authentic** "factory leftover" and pre-owned watches in PKR. It does NOT sell replicas, and its "100% Authentic" claims must NOT be reused for our site.

### 3.1 Structure observed

**Header:** 4 category links (Automatic, Chronograph, Quartz, Pre-owned Rolex), logo, account, cart, search.

**Home page, top to bottom:**
1. Hero (image/video) with headline "Luxury that defines you" + Explore button.
2. Short brand-trust paragraph.
3. Brand tiles grid (image tiles linking to brand collections).
4. Featured collections carousel (Automatic / Chronograph / Quartz).
5. One spotlight product with a "Check Availability" button.
6. Women's Best Sellers grid and Men's Best Sellers grid (~25 items each) with strikethrough old price + sale price.
7. A video banner for one featured series with a Buy Now button.
8. Footer: big "Customer guide" link list (About, Warranty, Authenticity, Returns, Contact, Terms, FAQs, Refund, Shipping), newsletter signup, social icons.

**Product page:**
- Gallery of ~4 images with thumbnails and fullscreen zoom.
- Title, badge, regular vs sale price.
- Rating line, scrolling trust strip.
- Guarantee card, quantity selector, Add to cart, **ORDER VIA WHATSAPP** (plain `wa.me/<number>` link, no prefilled message).
- Specs list, "included accessories", policy block (warranty, 7-day return, free delivery, 50% advance payment above a price threshold), support phone, "Goes well with..." section.

### 3.2 What to adopt
- Simple 4-ish item navigation.
- Brand tiles on the home page (people shop by brand).
- Strikethrough old price + current price.
- Trust strip close to the price.
- Detailed policy pages (they build trust for WhatsApp ordering).
- Payment terms (e.g. advance payment rules) stated up front on the product page. Make this an editable field in Site Settings.
- Best-seller grids.

### 3.3 What to do better (the reference's weaknesses)
- It requests images up to 3840px wide and uses hero video → heavy on mobile data. **We use small responsive AVIF/WebP images and a still hero. No video.**
- WhatsApp button opens an empty chat. **Ours pre-fills product name, type, price and link.**
- It carries cart, checkout, accounts and heavy theme JS. **We have none of these.**
- Trust strip markup is duplicated several times (marquee). **Ours is a static, single list.**
- Shows "4.8 | 0 reviews" (looks fake). **We show no ratings until real reviews exist.**
- Footer social icons all link to the privacy policy page. **Ours link to the real profiles or are omitted when empty.**
- Typos ("ORIGNAL", "Cronograph"). **Proofread all copy.**

---

## 4. TECH STACK AND DECISIONS

| Concern | Decision | Reason |
|---|---|---|
| Framework | **Astro** (latest stable at project start, version pinned exactly), `output: 'static'`, TypeScript strict | Ships near-zero JS by default; pre-builds every page to HTML |
| UI framework | **None** | Zero framework JS |
| Styling | Hand-written CSS with CSS variables; small global stylesheet + scoped component styles | Smallest CSS, no build-time framework |
| CMS | **Sanity** (Free plan) with Sanity Studio in `/studio` inside the same repo | Owner-friendly dashboard, image hosting/resizing, required-field validation |
| Hosting | **Netlify** (static deploy from GitHub) | CDN, automatic HTTPS, atomic deploys, one-click rollback |
| Source control | **GitHub** repo, `main` = production | Netlify auto-deploys on push |
| Ordering | `https://wa.me/<number>?text=<encoded message>` links | No backend required |
| Rebuild on content change | Sanity webhook → Netlify Build Hook | Site stays static; edits go live in ~1–2 min |
| Analytics | **None by default** | Zero third-party weight. If the owner wants any, see Section 13.9 |
| Node | Current LTS, set in `.nvmrc` and `netlify.toml` | Reproducible builds |

**Why static:** the visitor's phone receives ready-made HTML, CSS and images from a CDN. There is no database call, no server rendering and no client-side data fetching when browsing. This is the main reason the site will feel instant.

**Do not use:** WordPress, WooCommerce, Shopify, Next.js with client-side data fetching, runtime API calls to Sanity from the browser, serverless functions for browsing, client-side rendering of product lists.

---

## 5. ACCOUNTS, ENVIRONMENT AND INPUTS NEEDED

### 5.1 Status
- A **Sanity account exists** (created via GitHub login). **No Sanity project has been created yet.**
- **Netlify** will be used for hosting. **[ASK USER]** whether the Netlify account exists yet and which GitHub account/org holds the repo.

### 5.2 Information the human must provide (**[ASK USER]** for each; use placeholders until supplied)
- Store name (shown in header, titles, WhatsApp message): `REPLACE_ME_STORE_NAME`
- WhatsApp number in international format, digits only, e.g. `923XXXXXXXXX` (no `+`, no spaces): `REPLACE_ME_WHATSAPP`
- Logo file or confirm text-only wordmark.
- Currency (**assumption: PKR, shown as `Rs. 132,850`**; confirm). Keep currency configurable in Site Settings.
- Contact phone / email / address (optional) and social profile URLs (optional).
- Domain name (later).
- Payment terms text (e.g. advance payment rules), delivery text, warranty text and return text **for each type**. Never invent these.
- 5–10 real products with photos for launch testing (until then use sample data, Section 11.3).

### 5.3 Environment variables (never commit secrets; provide `.env.example`)
```
SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01   # use a fixed date string
SITE_URL=https://REPLACE_ME.netlify.app   # used for canonical URLs and WhatsApp product links
```
- Dataset must be **public** (free plan allows public datasets), so **no read token is needed** for the build. Do not add a token unless a private dataset is later required.
- A **write token** is only needed if you create a seed script; keep it local, never commit it, never put it in Netlify env for production.

---

## 6. REPOSITORY STRUCTURE

```
/
├─ .nvmrc
├─ .env.example
├─ .gitignore
├─ README.md                    (developer + deployment instructions)
├─ netlify.toml
├─ package.json / package-lock.json   (exact versions)
├─ astro.config.mjs
├─ tsconfig.json
├─ docs/
│  └─ OWNER-GUIDE.md            (plain-language guide for the shop owner, Section 18)
├─ scripts/
│  ├─ validate-content.mjs      (build-time content checks, Section 14)
│  └─ check-budget.mjs          (post-build size budget check, Section 13)
├─ public/
│  ├─ favicon.svg
│  ├─ robots.txt
│  ├─ placeholders/             (small sample images for dev data)
│  └─ fonts/                    (only if a self-hosted font is approved)
├─ src/
│  ├─ data/
│  │  └─ sample-products.json   (dev fallback only)
│  ├─ lib/
│  │  ├─ sanity.ts              (client + GROQ queries)
│  │  ├─ data.ts                (getProducts, getSettings... with sample fallback)
│  │  ├─ images.ts              (single image URL helper, Section 12)
│  │  ├─ whatsapp.ts            (link builder)
│  │  └─ format.ts              (price formatting etc.)
│  ├─ styles/
│  │  └─ global.css             (tokens, reset, base, utilities)
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  ├─ components/
│  │  ├─ Header.astro  Footer.astro  AnnouncementBar.astro
│  │  ├─ ProductCard.astro  ProductGrid.astro
│  │  ├─ TypeBadge.astro  Price.astro  OrderButton.astro
│  │  ├─ Gallery.astro  Specs.astro  BrandTiles.astro
│  │  ├─ TrustStrip.astro  Breadcrumbs.astro  Seo.astro
│  └─ pages/
│     ├─ index.astro
│     ├─ original/index.astro        original/[brand].astro
│     ├─ replica/index.astro         replica/[brand].astro
│     ├─ watch/[slug].astro
│     ├─ policies/[slug].astro
│     ├─ contact.astro
│     └─ 404.astro
└─ studio/                      (Sanity Studio project)
   ├─ sanity.config.ts
   ├─ schemaTypes/ (product, brand, siteSettings, policyPage)
   └─ structure.ts              (desk structure with singleton Site Settings)
```

---

## 7. DESIGN SYSTEM (DARK: BLACK + GOLD + SILVER)

### 7.1 Colour tokens (define once on `:root`; use only these)
```css
:root {
  --bg:        #0b0b0d;  /* page background (near-black, not pure #000) */
  --surface:   #141418;  /* cards, header, footer */
  --surface-2: #1b1b21;  /* raised/hover surface */
  --border:    #2a2a30;  /* thin dividers and card outlines */
  --text:      #e8e9ec;  /* primary text */
  --silver:    #c9ccd1;  /* body/secondary text, replica badge */
  --silver-muted: #9a9ea6;/* captions, meta */
  --gold:      #c9a24b;  /* accent: prices, key buttons, original badge */
  --gold-hover:#e0bf6a;
  --on-gold:   #0b0b0d;  /* text on gold */
  --success:   #3fae6a;  /* in stock indicator only */
  --danger:    #d9534f;  /* sold out indicator only */
  color-scheme: dark;
}
```

### 7.2 Colour usage rules
- Use gold **sparingly** (prices, primary buttons, original badge, small accents, focus ring). If everything is gold nothing stands out.
- **Original badge** = solid gold. **Replica badge** = silver outline.
- **Order on WhatsApp** button = gold fill with black text (premium look). Do not use heavy green.
- Silver for secondary text and thin lines. Keep contrast at WCAG AA or better (all token pairs above already pass on `--bg`/`--surface`; keep it that way).
- No gradients with large blur areas, no neon, no glow effects.

### 7.3 Typography
- **Default: system font stack, zero downloads.** Body: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. Headings (luxury feel): `Georgia, "Times New Roman", serif`, weight 400–600, slightly increased letter-spacing on small uppercase labels.
- **Optional:** one self-hosted heading font (WOFF2, Latin subset, ≤ 25 KB, `font-display: swap`, `<link rel="preload" as="font" crossorigin>`), only if the human approves. Never use Google Fonts requests.
- Fluid sizes via `clamp()`. Base 16px, line-height 1.55. Prices use `font-variant-numeric: tabular-nums`.

### 7.4 Layout and spacing
- Mobile-first. Breakpoints: 480, 768, 1024, 1280. Max content width 1200px, side padding 16px (mobile) / 24px (desktop).
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64.
- Product grid: 2 columns on mobile, 3 at ≥768, 4 at ≥1024. Gap 12px mobile / 20px desktop.
- Product images are **1:1** (use `aspect-ratio: 1 / 1`, `object-fit: cover`).
- Border radius 10–12px on cards, 8px on buttons. Thin 1px borders instead of shadows (see Section 13 on avoiding expensive effects).
- Tap targets **≥ 44×44px**.

### 7.5 Motion
- Subtle only: hover/press feedback and the mobile menu open/close using `transform` and `opacity` (≤ 200ms).
- Respect `@media (prefers-reduced-motion: reduce)` (disable all transitions).
- No parallax, no scroll-triggered animations, no auto-playing carousels.

---

## 8. PAGES AND COMPONENTS

All pages are pre-built at build time from CMS data. All text must be real content or marked placeholder.

### 8.1 Global layout (`BaseLayout.astro`)
- `<html lang="en">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<meta name="theme-color" content="#0b0b0d">`.
- "Skip to content" link, `<header>`, `<main id="main">`, `<footer>`.
- SEO component (Section 16) on every page.
- Inline critical CSS (Astro auto-inlines small CSS; keep total CSS small).
- **No third-party scripts, fonts, iframes, embeds or tracking** by default.

### 8.2 Announcement bar (optional)
Single line, text from Site Settings (e.g. delivery or payment note). Hidden if empty. Not sticky, no animation.

### 8.3 Header
- Left: logo or text wordmark (store name) linking to `/`.
- Navigation: **Original**, **Replica**, **Contact**. (Brand access is via the type pages, Section 8.5.)
- **Mobile:** hamburger menu implemented with a CSS-only `<details>`/checkbox pattern or ≤ 1 KB of vanilla JS. Menu is a full-width panel; closing on link tap. No JS framework.
- **WhatsApp icon-link** in the header (inline SVG, a `wa.me` link to the shop number without product text) for quick contact.
- Header is **not sticky on mobile** (saves screen space and avoids repaint cost); on desktop, sticky is allowed with no blur effects.

### 8.4 Home page (`/`)
Sections in order:
1. **Hero** — a single still image (from Site Settings, 16:9 desktop and a separate portrait/square crop for mobile via `<picture>`), headline, short sub-line, and two buttons: **Shop Original** and **Shop Replica**. Hero image is the LCP element: `loading="eager"`, `fetchpriority="high"`, explicit width/height, ≤ 60 KB on mobile. No video.
2. **Two large category tiles:** Original and Replica (image + label + count of watches).
3. **Trust strip** — a static list of 3–5 short items editable in Site Settings (e.g. "Order on WhatsApp", "Clear photos of the exact watch", "Delivery across the country"). No marquee/scrolling. Only true statements.
4. **Brand tiles** — text/wordmark tiles (our own style, no logos) linking to brand pages; split under Original and Replica headings or show a combined list with a type toggle implemented as two links.
5. **Best sellers** (products with `featured = true`), max 8, grid. Separate rows for Original and Replica.
6. **New arrivals** — latest 8 by `_createdAt`.
7. **How ordering works** — 3 steps: (1) Pick a watch, (2) Tap **Order on WhatsApp**, (3) Confirm details and payment terms with the shop. Uses the payment-terms text from Site Settings.
8. Footer.

Below-the-fold sections use `content-visibility: auto; contain-intrinsic-size: 1px 600px;` so the browser skips their rendering work until needed.

### 8.5 Collection pages
- `/original/` and `/replica/`: heading, short intro, filter bar, product grid.
- `/original/[brand]/` and `/replica/[brand]/`: statically generated for each brand that has ≥ 1 product of that type.
- **Filters** (movement: Automatic / Quartz; Chronograph; Men / Women / Unisex; In stock; Pre-owned for originals): a tiny vanilla JS script (≤ 2 KB gzipped) toggles `hidden` on cards using `data-*` attributes. Filters must work without layout shift. If JS fails, all products still show (progressive enhancement).
- **Sorting:** newest (default), price low→high, price high→low, using the same tiny script (DOM reorder with `requestAnimationFrame`; no re-render of images).
- **No pagination/infinite scroll while a type has ≤ 60 products.** If it grows past 60, add static pagination (`/original/page/2/`), not infinite scroll.
- Show product count and a friendly empty state.

### 8.6 Product card (`ProductCard.astro`)
- Image (1:1, 400w/800w responsive, `loading="lazy"`, `decoding="async"`, explicit width/height) — the first row of the first grid on a page may be eager if it is above the fold.
- Type badge (top-left over image), optional "Sold out" ribbon (the image is dimmed, using opacity only).
- Brand (small, silver), product name (max 2 lines, clamp), price block (current price in gold, old price struck through in muted silver, discount % pill if `oldPrice` > `price`).
- Entire card is a single link to `/watch/[slug]/`. Use `data-astro-prefetch="tap"` on card links.
- No hover zoom animations, no box-shadows.

### 8.7 Product page (`/watch/[slug]/`) — see Section 9 for details

### 8.8 Policy pages (`/policies/[slug]/`)
Rendered from the `policyPage` documents (Portable Text → semantic HTML with a small renderer). Each has a `type` (`general`, `original`, `replica`). Footer groups links: General, Original watches, Replica watches. Expected pages (create with clearly marked placeholder text **for the owner to replace**, never invented legal claims): About us, Shipping & delivery, Returns & exchange (Original), Returns & exchange (Replica), Warranty (Original), Warranty (Replica), Payment terms, Terms & conditions, Privacy policy, FAQs.

### 8.9 Contact page (`/contact/`)
Store name, WhatsApp button (generic message), phone, email, address/hours if provided, social links. **No contact form** (it would need a backend; WhatsApp is the contact channel).

### 8.10 404 page
Branded, dark, links to Original, Replica and home.

### 8.11 Footer
Policy links grouped as above, contact info, social links (only those with values), copyright line with store name. Plus the replica disclosure sentence once: "Replica watches are not made or endorsed by the brands they resemble." (editable in Site Settings).

---

## 9. PRODUCT PAGE AND WHATSAPP ORDERING (CORE FEATURE)

### 9.1 Layout (mobile first, one column; two columns ≥ 900px)
1. Breadcrumbs: Home › Original/Replica › Brand › Product.
2. **Gallery:**
   - Mobile: horizontally swipeable using **CSS scroll-snap** (`overflow-x: auto; scroll-snap-type: x mandatory`), with small dot indicators (CSS or ≤ 1 KB JS). No JS carousel library.
   - First image: `loading="eager"`, `fetchpriority="high"` (this is the LCP element). Other images: `loading="lazy"`.
   - Desktop: main image + clickable thumbnail strip (≤ 1.5 KB JS to swap the main image; thumbnails are real `<a>`/`<button>` elements).
   - Images ≥ 800px wide max served on mobile; ≥ 1200 on desktop (Section 12). No fullscreen/zoom library; tapping may open the largest image in the browser's native viewer (link to the 1600w version).
3. **Type badge** + brand.
4. **H1** product name.
5. **Price block:** current price (gold), old price struck through, discount %.
6. **Stock status:** In stock / Sold out.
7. **Replica disclosure line** (replica products only, Section 2.4).
8. **Primary button: ORDER ON WHATSAPP** (below).
9. Short description.
10. **Key specs** table (label/value rows from the product's `specs`), movement, case size, etc.
11. **Included with the watch** (from `accessories`, e.g. box, warranty card — **only what the owner lists**).
12. **Payment & delivery terms** (from Site Settings, with a per-product override field), warranty/return summary linking to the correct type's policy pages.
13. **Related watches:** up to 4 products of the same type and same brand (fallback: same type, newest). Cards use the same lightweight `ProductCard`.

### 9.2 Sticky order bar (mobile)
- A fixed bottom bar on product pages (< 900px) containing the price (left) and the **Order on WhatsApp** button (right).
- `position: fixed; bottom: 0; padding-bottom: env(safe-area-inset-bottom)`. Add bottom padding to `<main>` so content is not hidden behind it.
- No blur/backdrop-filter; solid `--surface` background with a 1px top border.
- Must not cause layout shift or jank while scrolling.

### 9.3 WhatsApp link builder (`src/lib/whatsapp.ts`)
Built **at build time**, rendered as a plain `<a href>` (works with JS disabled).

```ts
export function buildWhatsAppLink(opts: {
  phone: string;       // digits only, international format, from Site Settings
  storeName: string;
  productName: string;
  type: 'original' | 'replica';
  price: number;
  currencyLabel: string; // e.g. "Rs."
  url: string;         // absolute product URL using SITE_URL
}) {
  const digits = opts.phone.replace(/\D/g, '');
  const typeLabel = opts.type === 'original' ? 'Original' : 'Replica';
  const msg =
`Hi ${opts.storeName}, I want to order this watch:
• ${opts.productName}
• Type: ${typeLabel}
• Price: ${opts.currencyLabel} ${opts.price.toLocaleString('en-PK')}
• Link: ${opts.url}
Please confirm availability.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}
```
- Validate that `phone` has 10–15 digits at build time; **fail the build** if the number is missing/invalid in production (Section 14).
- Open in the same tab (no `target="_blank"` required; if used add `rel="noopener noreferrer"`). On mobile, `wa.me` hands off to the WhatsApp app.
- **Sold out** products: replace the button with a disabled "Sold out" state and a secondary link **"Ask about similar watches"** that opens WhatsApp with a generic message.
- Also provide a generic "Chat on WhatsApp" link (no product) in header, footer and contact page. The number lives only in Site Settings; **never hard-code it in components**.
- **Test inside the Instagram in-app browser** (traffic arrives from "link in bio") and mobile Chrome/Safari that the link opens WhatsApp correctly.

### 9.4 Structured data
JSON-LD `Product` on each product page (name, image, brand, `offers` with `price`, `priceCurrency`, `availability` = InStock/OutOfStock, `url`). Do **not** include `aggregateRating` or `review` (no real reviews). For replica products, do not describe the item as genuine.

---

## 10. SANITY CMS (SCHEMAS AND STUDIO)

### 10.1 Setup steps
1. In `/studio`, run the Sanity CLI scaffold (`npm create sanity@latest`) with TypeScript, dataset `production`, **public** dataset visibility. **[ASK USER]** to complete the interactive login/project creation (account exists via GitHub login) and share the **Project ID**.
2. Deploy the Studio to Sanity's hosted domain (`npx sanity deploy`) so the owner opens a simple URL like `https://<studio-name>.sanity.studio`.
3. Invite the shop owner as an **Administrator** from the Sanity project's members settings (sanity.io/manage). Best practice: the project should end up owned by, or at least administrated by, the **shop owner**, not only the developer.
4. Create a webhook (Section 15.3) to rebuild the site on publish.

### 10.2 Document types

**`product`**
| Field | Type | Rules |
|---|---|---|
| `name` | string | required, max 100 |
| `slug` | slug (from name) | required, unique |
| `type` | string (radio/dropdown): `original` / `replica` | **required, NO default value** |
| `brand` | reference → `brand` | required |
| `gender` | string: `men` / `women` / `unisex` | required |
| `movement` | string: `automatic` / `quartz` / `manual` | required |
| `chronograph` | boolean | default false |
| `condition` | string: `new` / `pre-owned` | default `new` |
| `price` | number | required, integer, > 0 |
| `oldPrice` | number | optional; must be > `price` if present |
| `images` | array of image (with `alt` text, `hotspot` enabled) | required, 1–8 images; first image = main; **alt required** |
| `shortDescription` | text (max ~300 chars) | optional |
| `specs` | array of `{label, value}` | optional |
| `accessories` | array of string | optional |
| `inStock` | boolean | default true |
| `featured` | boolean | default false (best seller) |
| `paymentNoteOverride` | string | optional |
| `sortOrder` | number | optional (lower = first) |

Studio preview in lists: product image + name + a visible `ORIGINAL`/`REPLICA` subtitle + price. Allow list sorting by newest. The `type` field description should say: "Choose honestly. Replica products must be labelled Replica."

**`brand`**: `name` (required), `slug`, optional `image` (owner's own brand tile photo, optional). No logos required.

**`siteSettings`** (singleton — only one document, hidden from "create new"):
- `storeName` (required), `tagline`
- `whatsappNumber` (required, digits only, validation 10–15 digits, helper text "International format, e.g. 923XXXXXXXXX, no + or spaces")
- `currencyLabel` (default `Rs.`)
- `announcement` (optional string)
- `heroImage` (desktop) + `heroImageMobile` (optional), `heroHeadline`, `heroSubline`
- `trustItems` (array of short strings, 3–5)
- `paymentTerms` (text), `deliveryNote` (text)
- `replicaDisclosure` (text, default: "Replica watch — not made or endorsed by the brand.")
- `contactPhone`, `contactEmail`, `address`, `openingHours` (optional)
- `instagramUrl`, `facebookUrl`, `tiktokUrl`, `youtubeUrl` (optional URLs)
- `seoTitle`, `seoDescription`, `ogImage`

**`policyPage`**: `title`, `slug`, `category` (`general` / `original` / `replica`), `body` (Portable Text: headings H2/H3, paragraphs, bullet and numbered lists, links, bold/italic only), `sortOrder`.

### 10.3 Studio structure
Left menu: **Products → Original**, **Products → Replica**, **All products**, **Brands**, **Site settings** (singleton), **Policy pages**. Keep the Studio minimal: no unused plugins.

### 10.4 What the owner can do (must all work)
- Add a new watch (fill the form, upload photos, choose Original/Replica, **Publish**).
- Edit price, description, photos.
- Mark **sold out** (toggle `inStock`) — page stays, order button disabled.
- Remove a watch (delete or unpublish).
- Change the WhatsApp number in **one place** (Site Settings).
- Edit policies and trust items.
Changes appear on the live site **within ~1–2 minutes** after Publish (rebuild time).

---

## 11. DATA LAYER

### 11.1 Fetching
- Fetch **only at build time** in Astro frontmatter using `@sanity/client` with `useCdn: false` (fresh data on each build), fixed `apiVersion`.
- **Never** call Sanity from the visitor's browser.
- Use one GROQ query per data need, selecting only needed fields, with image `asset->{_id, metadata{dimensions, lqip}}` (dimensions for width/height attributes).
- Fetch products, brands, settings and policies once per build and share via module-level cache so every page does not re-query.

### 11.2 Failure behaviour
- If Sanity is unreachable or returns invalid data during a **production** build, the build must **fail**. Netlify keeps serving the **previous successful deploy**, so the live site is never broken by a failed build.
- Never publish a deploy built from sample data (see 11.3).

### 11.3 Sample-data fallback (development only)
- If `SANITY_PROJECT_ID` is not set and `CONTEXT !== 'production'` (Netlify sets `CONTEXT`), `data.ts` returns data from `src/data/sample-products.json` (8–10 fake products across both types, brands, two genders, with a couple sold-out and discounted) and local placeholder images in `public/placeholders/`. This lets the full site be built and reviewed **before** the CMS is configured.
- Sample/placeholder watch names must obviously be fake (e.g. "Sample Watch 01") so they cannot be mistaken for real listings.
- When `CONTEXT === 'production'` and `SANITY_PROJECT_ID` is missing → **throw and fail the build**.

---

## 12. IMAGES (THE BIGGEST PERFORMANCE LEVER)

### 12.1 Strategy
Use **Sanity's image CDN** through one helper (`src/lib/images.ts`) so it can be swapped later (e.g. to Astro/Netlify-hosted optimized images) by editing one file.

- Use `@sanity/image-url` (or build URLs manually) with explicit width, height, `fm=webp` (or `auto=format` so AVIF/WebP is negotiated), `q=70–75`, `fit=crop` for 1:1 product images using the hotspot.
- Helper returns `{ src, srcset, sizes, width, height }`.
- Generate `srcset` widths: **320, 480, 640, 800, 1200, 1600** (product pages), **240, 320, 480, 640** (cards).
- Provide correct `sizes` (e.g. cards: `(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw`).
- **Always** set `width` and `height` attributes (and CSS `aspect-ratio`) → prevents layout shift.
- Use `loading="lazy"` + `decoding="async"` for everything except the LCP image(s) (`loading="eager"` + `fetchpriority="high"`). Never lazy-load the LCP image.
- Use a tiny blurred placeholder (Sanity `lqip` as a CSS background colour/blur is optional; skip if it adds weight).
- **If Sanity bandwidth on the free plan ever becomes a concern**, switch `images.ts` to download images at build time and serve them from Netlify using Astro's image pipeline. Document this in the README.

### 12.2 Size targets
| Image | Target |
|---|---|
| Card thumbnail (≈ 400–480w) | ≤ 25 KB |
| Product main image on mobile (≈ 800w) | ≤ 70 KB |
| Hero on mobile | ≤ 60 KB |
| Anything above the fold in total | ≤ 150 KB |

### 12.3 Rules
- No GIFs, no video, no background videos.
- No image used purely as decoration that CSS can do.
- Icons are inline SVG (WhatsApp, menu, close, arrows), each < 1 KB. No icon font/library.
- Do not hot-link any external image.
- Favicon is SVG.

---

## 13. PERFORMANCE: "NO LAG, LOADS FAST AT ALL TIMES"

### 13.1 Targets (test on throttled Slow 4G + 4× CPU slowdown, and on a real mid-range Android phone)
- **Lighthouse mobile:** Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- **LCP < 2.0 s**, **CLS < 0.02**, **TBT < 100 ms**, **INP < 200 ms**.
- **Total JavaScript across the entire site < 10 KB gzipped** (filters, gallery, mobile menu combined). Pages with none of those features ship **0 KB JS**.
- **Total CSS < 20 KB gzipped** for the whole site.
- **HTML per page < 40 KB** gzipped (collection pages with many cards may be larger; keep markup lean).
- **Home page initial load (HTML+CSS+JS+above-the-fold images) < 300 KB.**
- Product page initial load < 250 KB.

### 13.2 Loading rules
- Inline critical CSS; no render-blocking third-party resources.
- Preload only the LCP image (via `fetchpriority="high"`; add `<link rel="preload" as="image" imagesrcset imagesizes>` for the hero if it measurably helps) and the optional heading font.
- Add `<link rel="dns-prefetch">`/`preconnect` **only** for the Sanity image CDN (`cdn.sanity.io`) since product images load from it.
- No client-side routing library, no View Transitions/ClientRouter (adds JS). Use normal page navigations.
- Enable Astro's built-in prefetch with the **`tap`** strategy on product cards and nav links (prefetch when the finger touches down; no wasted data on mobile). Do not use viewport/load prefetching.
- Defer all non-essential scripts; scripts are `type="module"` (deferred by default) and inlined if tiny.

### 13.3 Rendering smoothness (scrolling and tapping must feel instant)
- **Animate only `transform` and `opacity`.** Never animate `width/height/top/left/margin`.
- **Avoid expensive paint effects:** no `backdrop-filter`, no large `box-shadow`/`filter: blur()`, no big gradients, no `position: fixed` full-screen overlays other than the mobile menu and the sticky order bar.
- Use `content-visibility: auto` (+ `contain-intrinsic-size`) on below-the-fold sections and long grids.
- Use `contain: layout paint` on cards where safe.
- Use `aspect-ratio` on every image/media box.
- Use `100dvh`/`min-height: 100svh` where full height is needed (not `100vh`, which jumps on mobile browsers).
- Event listeners are `passive`; no scroll listeners (use CSS `scroll-snap` and `IntersectionObserver` only if unavoidable). Filtering/sorting touches the DOM once per interaction.
- `touch-action: manipulation` on buttons/links to remove the tap delay.
- No layout shift: reserve space for everything that loads later (images, sticky bar).

### 13.4 Caching and delivery
- Hashed assets in `/_astro/*` get `Cache-Control: public, max-age=31536000, immutable` (Section 15.2).
- HTML is revalidated on each visit (Netlify default) so content updates appear immediately after a rebuild.
- Netlify serves Brotli/gzip automatically; verify with response headers.
- Everything is served from the CDN edge; no server code runs for visitors.

### 13.5 Fonts
System fonts by default (zero request). If a custom heading font is approved: one WOFF2, Latin subset, `font-display: swap`, preloaded, same-origin.

### 13.6 Third-party code
**None by default.** No chat widgets, no social embeds, no Facebook Pixel, no Google Tag Manager, no reCAPTCHA, no live-chat. WhatsApp is just a link.

### 13.7 Size-budget enforcement
`scripts/check-budget.mjs` runs after `astro build` (as part of `npm run build`) and **fails the build** if: total JS > 10 KB gzipped, total CSS > 20 KB gzipped, any single image file in `dist/` or `public/` > 150 KB, or any page's HTML > 80 KB uncompressed (warn above 60 KB).

### 13.8 Performance regression rule
Any pull request/commit that adds a dependency or script must state its size cost. Re-run Lighthouse after each phase and record scores in the README's "Performance log".

### 13.9 Optional analytics (only if the owner asks)
Use a cookie-less, tiny script (e.g. Cloudflare Web Analytics or Plausible), `defer`, loaded after page `load`, < 5 KB. Not Google Analytics/Tag Manager. Meta Pixel only if the owner runs paid ads, loaded after first user interaction. Each addition must be re-tested against the budget.

---

## 14. STABILITY AND RELIABILITY

1. **Atomic deploys:** Netlify only publishes a build if it fully succeeds. Any failure (bad data, Sanity outage, validation error) leaves the previous version live.
2. **Content validation at build time (`scripts/validate-content.mjs`)** — fail the build with a clear message listing the offending documents if any of the following are true:
   - A product is missing `type`, `price`, `slug`, `brand`, at least one image, or image alt text.
   - `type` is not exactly `original` or `replica`.
   - Duplicate slugs.
   - `oldPrice` ≤ `price`.
   - Missing/invalid WhatsApp number or store name in Site Settings.
   - A replica product page would render without the disclosure line.
   - A product references a brand that does not exist.
   - Sample data detected in a production build.
3. **Reproducible builds:** exact dependency versions, committed lockfile, `.nvmrc`, `NODE_VERSION` in `netlify.toml`, `npm ci` in CI/Netlify.
4. **No runtime dependencies:** the live site never calls Sanity, so a Sanity outage cannot break browsing.
5. **Rollback:** document in README that Netlify keeps every previous deploy; "Publish deploy" on an older one restores it in seconds.
6. **Webhook hygiene:** the Sanity webhook fires only on **published** (not draft) changes to avoid constant rebuilds; Netlify queues builds, so rapid edits are fine.
7. **Error handling:** custom 404 page; no JS errors in the console on any page; handle zero-product states gracefully (e.g. a brand with no products is simply not generated).
8. **Progressive enhancement:** all content, navigation and the WhatsApp order link work with JavaScript disabled. JS only enhances filters, gallery thumbnails and the mobile menu.
9. **Security headers** via `netlify.toml` (Section 15.2). No inline event handlers. No third-party scripts. (A strict CSP is optional; if added, allow `cdn.sanity.io` for images and inline JSON-LD, and test thoroughly.)
10. **Link safety:** external links use `rel="noopener noreferrer"`.
11. **Uptime check (optional):** the owner can add a free uptime monitor for the homepage and one product page.
12. **Backups:** the code lives in GitHub; content lives in Sanity. Add a README section: how to export the dataset (`sanity dataset export`) monthly as a backup.
13. **Secrets:** no tokens in the repo; `.env` is git-ignored; Netlify env vars hold `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `SITE_URL`.

---

## 15. NETLIFY HOSTING AND DEPLOY PIPELINE

### 15.1 Connect
1. Push repo to GitHub. In Netlify: Add new site → Import from Git → select the repo.
2. Build command `npm run build`, publish directory `dist`.
3. Set environment variables from Section 5.3 in the Netlify site settings.
4. Branch deploys / deploy previews can stay on for testing; production branch = `main`.
5. **Ownership:** the Netlify site, the domain and the Sanity project must be controlled by the **shop owner** (or the developer adds the owner as an owner/admin). **[ASK USER]** how they want to handle this.

### 15.2 `netlify.toml` (start from this, adjust as needed)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"   # use the current LTS and keep in sync with .nvmrc

# Long-term caching for hashed build assets
[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Self-hosted fonts (only if used)
[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Placeholder/static images
[[headers]]
  for = "/placeholders/*"
  [headers.values]
    Cache-Control = "public, max-age=604800"

# Security headers on every response
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```
(Netlify serves custom `404.html` automatically.)

### 15.3 Content-change → rebuild
1. In Netlify: Site configuration → Build & deploy → **Build hooks** → create a hook named "Sanity publish" → copy its URL.
2. In Sanity (sanity.io/manage → project → API → **Webhooks**): create a webhook:
   - URL: the Netlify build hook URL
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: `!(_id in path("drafts.**"))` (published documents only)
   - HTTP method: POST, no body needed.
3. Test: publish a change in Studio and watch a build start in Netlify, then confirm the live page updates.

### 15.4 Domain and HTTPS
Custom domain added in Netlify; HTTPS certificate is automatic. Set `SITE_URL` to the final domain, enforce HTTPS, choose one canonical host (www or apex) and redirect the other.

### 15.5 Pre-launch rule
Do not point the real domain at the site, and do not share the link publicly, until Section 21's checklist passes with **real** content (no sample data).

---

## 16. SEO AND SHARING

- Unique `<title>` and meta description per page (product: "{Name} — {Original|Replica} | {Store}").
- Canonical URL, Open Graph + Twitter card tags (OG image = the product's main image at 1200×630 crop; fallback = Site Settings `ogImage`).
- `@astrojs/sitemap` (generates `sitemap-index.xml`), `robots.txt` referencing it.
- Semantic headings: one H1 per page.
- JSON-LD `Product` (Section 9.4) and `Organization`/`WebSite` on the home page.
- Clean URLs with trailing slash (`build.format: 'directory'`); URLs with tracking parameters (`?utm_source=ig&fbclid=...`) must still resolve to the same page (they do on a static host; verify). Canonical tag always points to the clean URL.
- Share previews: confirm a product link pasted into WhatsApp and Instagram DM shows the image, name and price.

---

## 17. ACCESSIBILITY AND USABILITY

- Semantic HTML, landmarks, visible focus (gold 2px outline with offset), keyboard operable menu/gallery/filters.
- Every image has meaningful `alt` (product name + dial/colour); decorative images `alt=""`.
- Contrast ≥ WCAG AA. Never rely on colour alone (badges also contain the words ORIGINAL/REPLICA, sold-out has text).
- Tap targets ≥ 44px; font size ≥ 16px for inputs/buttons text (prevents iOS zoom).
- `prefers-reduced-motion` respected.
- Support up to 200% zoom without horizontal scrolling; no horizontal page scroll at any width ≥ 320px.
- Table/long content wrapped in `overflow-x: auto` containers.

---

## 18. OWNER GUIDE, PHOTO RULES AND OPERATIONS

### 18.1 Generate `docs/OWNER-GUIDE.md` (plain English, screenshots optional) covering
1. How to log in to the Studio.
2. How to add a watch (field by field, including choosing **Original** or **Replica** honestly).
3. How to upload photos and write alt text.
4. How to mark a watch sold out / back in stock.
5. How to change a price or add a discount (set old price).
6. How to feature a watch on the home page (`featured`).
7. How to change the WhatsApp number, hero, announcement and trust items (Site Settings).
8. How to edit policies.
9. "Changes take 1–2 minutes to go live" and what to do if they do not (check Netlify deploys).
10. How to roll back a mistake (Netlify → Deploys → pick previous → Publish deploy).

### 18.2 Photo guidelines (put in the owner guide)
- Same background and lighting for every watch (consistency sells).
- 4–5 photos per watch: front/dial, side/crown, caseback, on-wrist, box/accessories (if included).
- Square (1:1) compositions with the watch centred; upload originals at least 1600 px on the long side — Sanity and the site resize automatically, so the owner does not need to compress.
- No watermarks or other shops' logos; no screenshots of other sites.
- Photos must show the **actual item being sold**.

### 18.3 Orders (no order system, by design)
- Orders arrive via WhatsApp chat. Recommend the owner keep a simple **Google Sheet** log: Date, Customer, Watch (link), Type, Price, Advance paid, Status, Delivery details. (Not part of the website.)
- Payment and delivery terms shown on the site come from Site Settings so the written terms match what is said in chat.

### 18.4 README must include
Setup, env vars, scripts, how the data layer works, how to deploy, how to roll back, how to export a Sanity backup, how to switch image hosting if bandwidth limits are hit, the Performance log, and the legal note from Section 2.9.

---

## 19. COPY AND CONTENT RULES

- English, clear and short. Proofread (no "orignal"/"cronograph" style typos).
- Prices format: `Rs. 132,850` via `toLocaleString('en-PK')` (currency label from Site Settings).
- Discount % computed at build time: `Math.round((1 - price/oldPrice) * 100)`.
- Never write claims the owner has not provided (warranty duration, "2 years", "free delivery", "7-day return", etc.). Use the owner's text from Site Settings/policies, or a `REPLACE_ME` placeholder.
- Do not call replicas "authentic", "genuine", "original", "Swiss made" or "factory leftover". Do not call originals "replica".
- Calls to action: "Order on WhatsApp", "Shop Original", "Shop Replica".

---

## 20. BUILD PHASES (with acceptance criteria)

### Phase 1 — Project scaffold and design system
- Astro project (static), TypeScript strict, git initialised, `.nvmrc`, `.env.example`, `netlify.toml`.
- `global.css` with tokens, reset, typography, utilities. `BaseLayout`, `Header` (with CSS-only/≤1 KB mobile menu), `Footer`.
- **Accept:** dark theme renders correctly at 320 / 375 / 768 / 1280 px; zero JS on the page except the menu if JS-based; Lighthouse mobile ≥ 95 on an empty page.

### Phase 2 — Data layer with sample data
- `data.ts`, `sample-products.json`, `images.ts`, `format.ts`, `whatsapp.ts`; placeholder images.
- **Accept:** site can build with no Sanity project; sample data clearly fake; production build with missing `SANITY_PROJECT_ID` fails with a clear error.

### Phase 3 — Components and pages
- `TypeBadge`, `Price`, `ProductCard`, `ProductGrid`, `TrustStrip`, `BrandTiles`, `Gallery`, `Specs`, `OrderButton`.
- Pages: home, `/original/`, `/replica/`, brand pages, `/watch/[slug]/`, policies, contact, 404.
- **Accept:** every page works on mobile and desktop; Original/Replica labels visible everywhere (Section 2); WhatsApp links open a chat with the correct pre-filled text; sticky order bar works; sold-out state works; filters/sorting work and fall back gracefully without JS.

### Phase 4 — Performance pass
- Implement budgets and `check-budget.mjs`, LCP image handling, `content-visibility`, prefetch `tap`, remove any unused CSS/JS.
- **Accept:** all Section 13.1 targets met on a throttled run; scores recorded in README; no console errors.

### Phase 5 — Sanity CMS
- Studio in `/studio` with schemas (Section 10), singleton settings, desk structure, validations, deploy Studio. **[ASK USER]** to complete login and share the Project ID.
- Switch `data.ts` to Sanity; add `validate-content.mjs`.
- **Accept:** the owner (or the human acting as owner) can add a product, mark it sold out, change the WhatsApp number and edit a policy in the Studio; validation blocks a product without `type`; the build fails clearly on invalid content.

### Phase 6 — Netlify deployment and webhook
- Connect GitHub → Netlify, set env vars, create build hook and Sanity webhook (Section 15).
- **Accept:** publishing in Studio triggers a build and the live site updates within ~2 minutes; a deliberately broken document leaves the live site unchanged (build fails); rollback tested once.

### Phase 7 — SEO, accessibility and documentation
- Meta/OG/JSON-LD/sitemap/robots; a11y checks; `docs/OWNER-GUIDE.md`; README.
- **Accept:** Section 21 checklist fully passed.

---

## 21. FINAL TEST CHECKLIST (all must pass before launch)

**Speed (run on Slow 4G + CPU 4× slowdown, and on a real Android phone)**
- [ ] Lighthouse mobile: Perf ≥ 95, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on home, a collection page and a product page.
- [ ] LCP < 2.0 s, CLS < 0.02, TBT < 100 ms.
- [ ] Scrolling product grids and the gallery is smooth (no jank) on a mid-range phone.
- [ ] JS total < 10 KB gz, CSS < 20 KB gz, no image above budget.
- [ ] No third-party requests in the network panel except images from `cdn.sanity.io`.

**Function**
- [ ] Original and Replica are clearly labelled on cards, product pages, page titles, WhatsApp messages; the replica disclosure shows on every replica product.
- [ ] **Order on WhatsApp** opens the right number with the right product text in: Android Chrome, iOS Safari, **Instagram in-app browser**, desktop (WhatsApp Web).
- [ ] Sold-out products cannot be ordered; "Ask about similar" works.
- [ ] Filters/sorting work; page still usable with JS disabled.
- [ ] Mobile menu, gallery swipe, sticky order bar work and do not overlap content (check iPhone notch/home-bar area).
- [ ] URLs with `?utm_source=ig&fbclid=...` open the same pages.
- [ ] 404 page works.

**Content and CMS**
- [ ] No sample/placeholder data and no `REPLACE_ME` text remains.
- [ ] Owner can add/edit/hide/sold-out a product, change WhatsApp number, edit policies without touching code.
- [ ] Webhook → build → live update works; failed build keeps the old site live.
- [ ] Owner has admin access to Sanity, Netlify and the domain.

**Quality**
- [ ] No console errors/warnings on any page.
- [ ] Spelling and prices proofread; no unverified claims; no fake reviews.
- [ ] Share previews look right in WhatsApp and Instagram.
- [ ] Contrast and focus states pass.

---

## 22. DO / DON'T SUMMARY

**DO**
- Static pages, tiny JS, system fonts, small responsive AVIF/WebP images with explicit dimensions.
- Required Original/Replica field, badges everywhere, per-type policies.
- Pre-filled WhatsApp message, number only in Site Settings.
- Fail the build on bad content; keep the previous deploy live.
- Test on a real mid-range phone and inside Instagram's browser.

**DON'T**
- Don't add cart, checkout, login, forms, chat widgets, trackers, video, sliders, parallax or big animations.
- Don't use React/Vue/jQuery/Tailwind/icon fonts/Google Fonts.
- Don't fetch data from the browser or call Sanity at runtime.
- Don't copy the reference site's assets or text, and don't reuse its "100% authentic" claims.
- Don't invent policies, prices, warranty terms, reviews or stock claims.
- Don't hard-code the WhatsApp number or store name in components.
- Don't commit secrets.
- Don't deploy sample data to production.

---

## 23. ASSUMPTIONS TO CONFIRM WITH THE HUMAN

1. Currency is PKR (`Rs.`) — confirm.
2. Store name, logo or text wordmark — needed.
3. Final WhatsApp number — needed.
4. Domain name and who owns the Netlify/Sanity/GitHub accounts — needed.
5. Whether a custom heading font is wanted (default: none, system fonts).
6. Policy texts (warranty, returns, payment/advance terms, delivery) for Original and Replica — owner must write/approve.
7. Social profile URLs — optional.
8. Expected catalogue size at launch and growth (design supports up to ~60 products per type without pagination; plan pagination beyond that).

---

*End of specification. Start with Phase 1, and report back after each phase.*
