import { SITE } from '../data/site';

/** Görünür breadcrumb bileşeninin kullandığı biçim. */
export type Crumb = { label: string; href?: string };

/** JSON-LD BreadcrumbList üretiminde kullanılan biçim. */
export type Breadcrumb = { name: string; url?: string };

export type ArticleType = 'Article' | 'BlogPosting' | 'TechArticle';

export type ArticleInput = {
  type: ArticleType;
  headline: string;
  description?: string;
  datePublished: Date | string;
  dateModified?: Date | string;
  author?: string;
  image?: string;
  url?: string;
};

export type WebPageInput = {
  name: string;
  description?: string;
  dateModified?: Date | string;
  url?: string;
};

export type StructuredDataInput = {
  softwareApplication?: boolean;
  faq?: { question: string; answer: string }[];
  breadcrumbs?: Breadcrumb[];
  article?: ArticleInput;
  webPage?: WebPageInput;
};

/** Görünür breadcrumb listesini şema girdisine çevirir. */
export function toBreadcrumbs(crumbs: Crumb[]): Breadcrumb[] {
  return crumbs.map((crumb) => ({ name: crumb.label, url: crumb.href }));
}

/** Site içi yolu mutlak URL'ye çevirir; zaten mutlak olanı olduğu gibi bırakır. */
export function absoluteUrl(pathOrUrl: string, site: URL = new URL(SITE.url)): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, site).toString();
}

/**
 * Meta description'ı kelime ortasından kesmeden 160 karaktere sınırlar.
 * İçerik tarafında açıklamalar zaten kısa tutulur; bu yalnızca güvenlik ağıdır.
 */
export function clampDescription(value: string, max = 160): string {
  const text = value.trim().replace(/\s+/g, ' ');
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const body = (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '');
  return `${body}…`;
}
