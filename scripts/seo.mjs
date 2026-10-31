import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

// Change this one origin when moving to a custom domain, then run npm run seo.
export const origin = 'https://calquivo.swastu1111.workers.dev';
const root = new URL('../public/', import.meta.url);
async function walk(dir) {
  const paths = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) paths.push(...await walk(path));
    else if (entry.name === 'index.html') paths.push(path);
  }
  return paths;
}
import { fileURLToPath } from 'node:url';
const directory = fileURLToPath(root);
const urls = [];
for (const path of await walk(directory)) {
  let html = await readFile(path, 'utf8');
  const route = '/' + relative(directory, path).replaceAll('\\', '/').replace(/index\.html$/, '');
  const url = origin + route;
  urls.push(url);
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)[1];
  const metadata = `<!-- seo:start -->
<link rel="canonical" href="${url}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Calquivo">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<!-- seo:end -->`;
  html = html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->\s*/g, '');
  await writeFile(path, html.replace('</head>', metadata + '\n</head>'));
}
await writeFile(new URL('sitemap.xml', root), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.sort().map(url => `  <url><loc>${url}</loc></url>`).join('\n') + '\n</urlset>\n');
await writeFile(new URL('robots.txt', root), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Updated metadata and sitemap for ${urls.length} pages.`);
