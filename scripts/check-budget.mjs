import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Size budget check (Section 13.7)
// total JS > 10 KB gzipped, total CSS > 20 KB gzipped, image in dist/ or public/ > 150 KB, HTML > 80 KB uncompressed
try {
  const distDir = path.resolve('dist');
  if (!fs.existsSync(distDir)) {
    console.log('Budget check: dist directory not found yet, skipping.');
    process.exit(0);
  }

  function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of list) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(getFiles(fullPath));
      } else {
        results.push(fullPath);
      }
    }
    return results;
  }

  const files = getFiles(distDir);
  let totalJsGz = 0;
  let totalCssGz = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const stat = fs.statSync(file);

    if (ext === '.js') {
      const content = fs.readFileSync(file);
      const gz = zlib.gzipSync(content);
      totalJsGz += gz.length;
    } else if (ext === '.css') {
      const content = fs.readFileSync(file);
      const gz = zlib.gzipSync(content);
      totalCssGz += gz.length;
    } else if (['.svg', '.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
      if (stat.size > 150 * 1024) {
        throw new Error(`Image ${file} exceeds 150 KB budget: ${(stat.size / 1024).toFixed(1)} KB`);
      }
    } else if (ext === '.html') {
      if (stat.size > 80 * 1024) {
        throw new Error(`HTML page ${file} exceeds 80 KB budget: ${(stat.size / 1024).toFixed(1)} KB`);
      }
    }
  }

  const MAX_JS = 10 * 1024;
  const MAX_CSS = 20 * 1024;

  if (totalJsGz > MAX_JS) {
    throw new Error(`Total JS gzipped (${(totalJsGz / 1024).toFixed(2)} KB) exceeds 10 KB budget`);
  }
  if (totalCssGz > MAX_CSS) {
    throw new Error(`Total CSS gzipped (${(totalCssGz / 1024).toFixed(2)} KB) exceeds 20 KB budget`);
  }

  console.log(`✓ Size budget passed (JS: ${(totalJsGz / 1024).toFixed(2)} KB gz, CSS: ${(totalCssGz / 1024).toFixed(2)} KB gz)`);
} catch (err) {
  console.error('Budget check error:', err.message);
  process.exit(1);
}
