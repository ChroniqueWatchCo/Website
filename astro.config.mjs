import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Public site URL used for canonicals, sitemap and WhatsApp product links.
// Set SITE_URL in .env locally and in Netlify site settings for production.
const site = process.env.SITE_URL || 'https://REPLACE_ME.netlify.app';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  prefetch: false, // we use per-link data-astro-prefetch="tap" instead of global prefetch
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto'
  }
});
