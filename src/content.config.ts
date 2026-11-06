import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** SEO meta açıklaması: kelime ortasından kesilmemesi için üst sınır 300,
 *  hedef aralık 120–160 karakterdir (bkz. README "SEO, GEO ve Performans"). */
const seoDescription = z.string().max(300);

/** Sürümler (sürüm notları) koleksiyonu */
const releases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/releases' }),
  schema: z.object({
    title: z.string(),
    version: z.string(),
    date: z.coerce.date(),
    summary: z.string().max(280).optional(),
    /** Kısa SEO açıklaması (<= 160 karakter). `summary` yerine meta'da kullanılır. */
    description: seoDescription.optional(),
    /** İçerik gerçekten güncellendiyse girilir; boşsa `date` kullanılır. */
    updated: z.coerce.date().optional(),
    highlights: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    /** Görselin gerçek piksel boyutları; CLS önlemek için önerilir (varsayılan 1200×675). */
    imageWidth: z.number().int().positive().optional(),
    imageHeight: z.number().int().positive().optional(),
    canonicalURL: z.string().optional(),
    noindex: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** Yardım merkezi makaleleri koleksiyonu */
const help = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/help' }),
  schema: z.object({
    title: z.string(),
    description: seoDescription,
    category: z.enum([
      'baslangic',
      'cari-islemleri',
      'veresiye-takibi',
      'tahsilat-odeme',
      'analiz-raporlar',
      'yedekleme-guvenlik',
    ]),
    order: z.number(),
    updated: z.coerce.date(),
    keywords: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    canonicalURL: z.string().optional(),
    noindex: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** Yasal belgeler koleksiyonu */
const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: seoDescription,
    updated: z.coerce.date(),
    order: z.number(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    canonicalURL: z.string().optional(),
    noindex: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** Müşteri yorumları (referanslar) koleksiyonu — yalnızca veri, sayfa sağlamaz */
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    business: z.string(),
    city: z.string(),
    quote: z.string(),
    rating: z.number().min(1).max(5),
    featured: z.boolean().default(false),
    order: z.number(),
    since: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/** Blog yazıları koleksiyonu. `_` ile başlayan dosyalar (ör. `_ornek-haber.md`)
 *  yüklenmez; blog bölümünü etkinleştirmek için dosya adındaki öneki kaldırın. */
const blog = defineCollection({
  loader: glob({ pattern: '**/[!_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: seoDescription,
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Veresiye Pro'),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    canonicalURL: z.string().optional(),
    noindex: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { releases, help, legal, testimonials, blog };
