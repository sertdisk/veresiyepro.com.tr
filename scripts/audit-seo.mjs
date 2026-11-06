#!/usr/bin/env node
/**
 * dist/ üzerinde teknik SEO denetimi.
 *
 * Kullanım:  npm run build && npm run audit
 * Bağımlılık yoktur; yalnızca Node.js çekirdek modülleri kullanılır.
 *
 * Hata (exit 1) veren kontroller:
 *  - <html lang="tr-TR">, benzersiz title/description, canonical, robots
 *  - tek h1, başlık seviyesi atlaması, yinelenen id
 *  - kırık iç bağlantı ve çapa (#hash) hedefleri
 *  - görsellerde alt + width/height
 *  - JSON-LD parse ve sayfa türüne göre beklenen şema tipleri
 *  - sitemap/robots/llms.txt varlığı, noindex URL'lerin sitemap'te olmaması
 *  - indekslenebilir sayfalarda 160 karakterden uzun description
 *  - Open Graph görseli
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const ORIGIN = 'https://veresiyepro.com.tr';

const errors = [];
const warnings = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);
const warn = (file, message) => warnings.push(`${file}: ${message}`);

if (!existsSync(DIST)) {
  console.error('dist/ bulunamadı. Önce "npm run build" çalıştırın.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const rel = (file) => relative(DIST, file).split(sep).join('/');

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');

const allFiles = walk(DIST);
const htmlFiles = allFiles.filter((file) => file.endsWith('.html')).sort();
const allIds = new Map();

const pageOf = (file) => {
  const path = `/${rel(file)}`;
  if (path === '/index.html') return '/';
  if (path.endsWith('/index.html')) return path.slice(0, -'index.html'.length);
  return path;
};

const distFileFor = (pathname) => {
  const clean = pathname.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return join(DIST, 'index.html');
  if (/\.[a-z0-9]+$/i.test(clean)) return join(DIST, clean.replace(/^\//, ''));
  const withSlash = clean.endsWith('/') ? clean : `${clean}/`;
  return join(DIST, `${withSlash.replace(/^\//, '')}index.html`);
};

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'));
  return match ? decodeEntities(match[1]) : null;
};

const parseJsonLd = (html, file) => {
  const blocks = [];
  const regex = /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse(match[1]));
    } catch (error) {
      fail(file, `JSON-LD parse edilemedi: ${error.message}`);
    }
  }
  return blocks;
};

const collectTypes = (node, out = new Set()) => {
  if (Array.isArray(node)) {
    node.forEach((item) => collectTypes(item, out));
    return out;
  }
  if (node && typeof node === 'object') {
    if (typeof node['@type'] === 'string') out.add(node['@type']);
    if (Array.isArray(node['@type'])) node['@type'].forEach((t) => out.add(t));
    if (node['@graph']) collectTypes(node['@graph'], out);
  }
  return out;
};

// ---------- Sayfa bazlı kontroller ----------
const titles = new Map();
const descriptions = new Map();
const pages = [];

for (const file of htmlFiles) {
  const id = rel(file);
  const html = readFileSync(file, 'utf8');
  const url = pageOf(file);

  const lang = (html.match(/<html[^>]*\blang="([^"]*)"/i) ?? [])[1];
  if (lang !== 'tr-TR') fail(id, `<html lang> "${lang ?? 'yok'}" — "tr-TR" beklenir.`);

  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) ?? [])[1]?.trim();
  if (!title) {
    fail(id, 'title yok.');
  } else {
    if (titles.has(title)) fail(id, `title başka sayfayla aynı: "${title}" (${titles.get(title)}).`);
    else titles.set(title, id);
    if (title.length > 70) warn(id, `title ${title.length} karakter (>70).`);
  }

  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const meta = (key, value) =>
    metaTags.find((tag) => attr(tag, key)?.toLowerCase() === value.toLowerCase());

  const descriptionTag = meta('name', 'description');
  const description = descriptionTag ? attr(descriptionTag, 'content') : null;
  const robotsTag = meta('name', 'robots');
  const robots = robotsTag ? (attr(robotsTag, 'content') ?? '') : '';
  const noindex = /noindex/i.test(robots);
  const is404 = url === '/404.html';

  const ogImage = meta('property', 'og:image');
  if (!ogImage || !attr(ogImage, 'content')) fail(id, 'og:image yok.');

  if (!description) {
    fail(id, 'meta description yok.');
  } else {
    if (description.length > 160 && !noindex) {
      fail(id, `description ${description.length} karakter (>160, indekslenebilir sayfa).`);
    }
    if (!noindex) {
      if (descriptions.has(description)) {
        fail(id, `description başka sayfayla aynı: ${descriptions.get(description)}.`);
      } else {
        descriptions.set(description, id);
      }
    }
  }

  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  const canonical = linkTags
    .filter((tag) => (attr(tag, 'rel') ?? '').toLowerCase() === 'canonical')
    .map((tag) => attr(tag, 'href'))[0];

  if (is404) {
    if (canonical) fail(id, '404 sayfasında canonical bulunmamalı.');
    if (!noindex) fail(id, '404 sayfası noindex olmalı.');
  } else if (!noindex) {
    if (!canonical) fail(id, 'canonical yok.');
    else {
      const expected = `${ORIGIN}${url}`;
      if (canonical.replace(/\/$/, '') !== expected.replace(/\/$/, '')) {
        fail(id, `canonical "${canonical}" — beklenen "${expected}".`);
      }
    }
  }

  // script/style içeriklerini id/başlık/bağlantı taramasından çıkar.
  const body = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

  const headings = [...body.matchAll(/<h([1-6])\b[^>]*>/gi)].map((m) => Number(m[1]));
  const h1Count = headings.filter((level) => level === 1).length;
  if (h1Count !== 1) fail(id, `${h1Count} adet h1 (1 beklenir).`);
  if (headings.length > 0 && headings[0] !== 1) {
    fail(id, `ilk başlık h${headings[0]} — h1 ile başlamalı.`);
  }
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i] - headings[i - 1] > 1) {
      fail(id, `başlık atlaması: h${headings[i - 1]} → h${headings[i]}.`);
    }
  }

  const ids = [];
  for (const match of body.matchAll(/\bid="([^"]+)"/g)) ids.push(decodeEntities(match[1]));
  const idSet = new Set();
  for (const value of ids) {
    if (idSet.has(value)) fail(id, `yinelenen id: "${value}".`);
    idSet.add(value);
  }
  allIds.set(url, idSet);

  const images = body.match(/<img\b[^>]*>/gi) ?? [];
  for (const image of images) {
    if (attr(image, 'alt') === null) fail(id, `görselde alt yok: ${image.slice(0, 90)}`);
    if (!attr(image, 'width') || !attr(image, 'height')) {
      fail(id, `görselde width/height yok: ${image.slice(0, 90)}`);
    }
  }

  const jsonLd = parseJsonLd(html, id);
  const types = new Set();
  jsonLd.forEach((block) => collectTypes(block, types));
  if (types.has('Review') || types.has('AggregateRating')) {
    fail(id, 'Review/AggregateRating şeması yayınlanmamalı (gerçek veri yok).');
  }

  const hasBreadcrumbs = /class="[^"]*\bbreadcrumbs\b/.test(body);

  pages.push({
    id,
    url,
    file,
    types,
    hasBreadcrumbs,
    is404,
    noindex,
    description,
    headings: headings.length,
    images: images.length,
    ids: idSet,
  });
}

// ---------- Beklenen şema tipleri ----------
const notFoundPage = pages.find((page) => page.url === '/404.html');
if (notFoundPage?.description) {
  const duplicate = pages.find(
    (page) => page !== notFoundPage && page.description === notFoundPage.description,
  );
  if (duplicate) {
    fail('404.html', `description başka sayfayla aynı: ${duplicate.id}.`);
  }
}

const schemaExpectations = (page) => {
  const expected = ['Organization', 'WebSite'];
  if (page.url === '/') expected.push('SoftwareApplication', 'FAQPage');
  if (page.hasBreadcrumbs) expected.push('BreadcrumbList');
  if (/^\/surum-notlari\/[^/]+\/$/.test(page.url)) expected.push('Article');
  if (/^\/yardim\/[^/]+\/$/.test(page.url)) expected.push('TechArticle');
  if (/^\/blog\/[^/]+\/$/.test(page.url)) expected.push('BlogPosting');
  if (/^\/yasal\/[^/]+\/$/.test(page.url)) expected.push('WebPage');
  if (page.url === '/hakkimizda/') expected.push('WebPage');
  return expected;
};

for (const page of pages) {
  for (const type of schemaExpectations(page)) {
    if (!page.types.has(type)) fail(page.id, `beklenen JSON-LD tipi eksik: ${type}.`);
  }
  if (page.types.has('FAQPage') && page.url !== '/') {
    fail(page.id, 'FAQPage yalnızca görünür SSS bulunan ana sayfada kullanılmalı.');
  }
}

// ---------- İç bağlantı ve çapa kontrolü ----------
for (const page of pages) {
  const html = readFileSync(page.file, 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]*)"/gi)].map((m) =>
    decodeEntities(m[1]).trim(),
  );

  for (const href of links) {
    if (!href || href.startsWith('#') === false && !href.startsWith('/')) continue;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) continue;
    if (href.startsWith('//')) continue;

    let pathname;
    let hash = '';
    if (href.startsWith('#')) {
      pathname = page.url;
      hash = href.slice(1);
    } else if (href.startsWith('/')) {
      const [beforeHash, afterHash] = href.split('#');
      hash = afterHash ?? '';
      pathname = beforeHash.split('?')[0];
    } else {
      continue;
    }

    if (!pathname) continue;
    const target = distFileFor(pathname);
    if (!existsSync(target)) {
      fail(page.id, `kırık iç bağlantı: ${href}`);
      continue;
    }

    if (hash) {
      const decodedHash = decodeURIComponent(hash);
      const targetUrl = target.endsWith('index.html')
        ? pageOf(target)
        : `/${rel(target)}`;
      let targetIds = allIds.get(targetUrl);
      if (!targetIds) {
        const targetHtml = readFileSync(target, 'utf8');
        targetIds = new Set(
          [...targetHtml.matchAll(/\bid="([^"]+)"/g)].map((m) => decodeEntities(m[1])),
        );
      }
      if (!targetIds.has(decodedHash)) {
        fail(page.id, `çapa hedefi yok: ${href}`);
      }
    }
  }
}

// ---------- Sitemap ----------
const sitemapIndex = join(DIST, 'sitemap-index.xml');
if (!existsSync(sitemapIndex)) {
  fail('dist', 'sitemap-index.xml yok.');
} else {
  const sitemapFiles = allFiles.filter(
    (file) => /sitemap-\d+\.xml$/.test(file) || file.endsWith('sitemap-0.xml'),
  );
  const locs = new Set();
  for (const file of [sitemapIndex, ...sitemapFiles]) {
    const xml = readFileSync(file, 'utf8');
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      locs.add(decodeEntities(match[1]).trim());
    }
  }

  const indexable = new Map(pages.map((page) => [page.url, page]));
  for (const loc of locs) {
    if (!loc.startsWith(ORIGIN)) continue;
    const pathname = loc.slice(ORIGIN.length) || '/';
    if (pathname === '/sitemap-index.xml') continue;
    const file = distFileFor(pathname);
    if (!existsSync(file)) {
      fail('sitemap', `sitemap'te üretilmemiş URL: ${loc}`);
      continue;
    }
    const page = indexable.get(pageOf(file));
    if (page?.noindex) fail('sitemap', `noindex sayfa sitemap'te: ${loc}`);
  }

  if (locs.size === 0) fail('sitemap', 'sitemap boş.');

  for (const page of pages) {
    if (page.is404 || page.noindex) continue;
    if (!locs.has(`${ORIGIN}${page.url}`)) {
      fail(page.id, "indekslenebilir sayfa sitemap'te yok.");
    }
  }
}

// ---------- robots.txt / llms.txt ----------
const robots = join(DIST, 'robots.txt');
if (!existsSync(robots)) {
  fail('dist', 'robots.txt yok.');
} else {
  const content = readFileSync(robots, 'utf8');
  if (!/^Sitemap:\s*https:\/\/veresiyepro\.com\.tr\/sitemap-index\.xml/m.test(content)) {
    fail('robots.txt', 'sitemap satırı yok veya yanlış.');
  }
  if (/^\s*Disallow:\s*\/\s*$/m.test(content)) {
    fail('robots.txt', 'tüm siteyi engelleyen Disallow kuralı var.');
  }
}

const llms = join(DIST, 'llms.txt');
if (!existsSync(llms)) {
  fail('dist', 'llms.txt yok.');
} else {
  const content = readFileSync(llms, 'utf8');
  if (!content.includes('sitemap-index.xml')) {
    fail('llms.txt', 'site haritası referansı yok.');
  }
  for (const match of content.matchAll(/\((https:\/\/veresiyepro\.com\.tr[^)]*)\)/g)) {
    const url = match[1];
    const pathname = url.slice(ORIGIN.length) || '/';
    if (!existsSync(distFileFor(pathname))) {
      fail('llms.txt', `çözümlenemeyen bağlantı: ${url}`);
    }
  }
}

// ---------- Rapor ----------
const totalIds = pages.reduce((sum, page) => sum + page.ids.size, 0);
console.log('');
console.log('SEO denetimi — dist/');
console.log('────────────────────────────────────────');
console.log(`Sayfa: ${pages.length}`);
console.log(`Benzersiz title: ${titles.size}`);
console.log(`Benzersiz description (indekslenebilir): ${descriptions.size}`);
console.log(`Toplam id: ${totalIds}`);
console.log(`Uyarı: ${warnings.length}`);
console.log(`Hata: ${errors.length}`);

if (warnings.length > 0) {
  console.log('\nUyarılar:');
  warnings.forEach((message) => console.log(`  ! ${message}`));
}

if (errors.length > 0) {
  console.log('\nHatalar:');
  errors.forEach((message) => console.log(`  ✗ ${message}`));
  console.log('');
  process.exit(1);
}

console.log('\n✓ Tüm SEO kontrolleri geçti.\n');
