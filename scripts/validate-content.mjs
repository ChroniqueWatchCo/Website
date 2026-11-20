import fs from 'node:fs';
import path from 'node:path';

// Validate content (Section 14.2)
try {
  const samplePath = path.resolve('src/data/sample-products.json');
  if (fs.existsSync(samplePath)) {
    const raw = fs.readFileSync(samplePath, 'utf-8');
    const products = JSON.parse(raw);
    const slugs = new Set();

    for (const p of products) {
      if (!p.type || !p.price || !p.slug || !p.brand) {
        throw new Error(`Product ${p.id || 'unknown'} is missing required fields`);
      }
      if (p.type !== 'original' && p.type !== 'replica') {
        throw new Error(`Product ${p.id} has invalid type: ${p.type}`);
      }
      if (slugs.has(p.slug)) {
        throw new Error(`Duplicate slug found: ${p.slug}`);
      }
      slugs.add(p.slug);
      if (p.oldPrice && p.oldPrice <= p.price) {
        throw new Error(`Product ${p.id} oldPrice (${p.oldPrice}) must be greater than price (${p.price})`);
      }
      if (!p.images || p.images.length === 0) {
        throw new Error(`Product ${p.id} must have at least one image`);
      }
    }
    console.log(`✓ Content validation passed (${products.length} products verified)`);
  } else {
    console.log('✓ Content validation: No sample data file found, skipping.');
  }
} catch (err) {
  console.error('Content validation error:', err.message);
  process.exit(1);
}
