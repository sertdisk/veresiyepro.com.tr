import type { CollectionEntry } from 'astro:content';

export type DateValue = Date | string;

// Tarihler içerikte gün olarak yazılır; build sunucusunun saat dilimi ne olursa
// olsun aynı günü göstermek için Türkiye saat dilimi sabitlenir.
const TR_TIME_ZONE = 'Europe/Istanbul';

const trDateLong = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: TR_TIME_ZONE,
});

const trDateShort = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: TR_TIME_ZONE,
});

const trMonthYear = new Intl.DateTimeFormat('tr-TR', {
  month: 'long',
  year: 'numeric',
  timeZone: TR_TIME_ZONE,
});

const toDate = (value: DateValue): Date => (value instanceof Date ? value : new Date(value));

/** "6 Kasım 2026" */
export function formatDateLong(value: DateValue): string {
  return trDateLong.format(toDate(value));
}

/** "06.11.2026" */
export function formatDateShort(value: DateValue): string {
  return trDateShort.format(toDate(value));
}

/** "Kasım 2026" */
export function formatMonthYear(value: DateValue): string {
  return trMonthYear.format(toDate(value));
}

/** Yardım makalesi kategorileri ve Türkçe etiketleri */
export const HELP_CATEGORIES = {
  'baslangic': 'Başlangıç & Kurulum',
  'cari-islemleri': 'Cari İşlemleri',
  'veresiye-takibi': 'Veresiye Takibi',
  'tahsilat-odeme': 'Tahsilat & Ödeme',
  'analiz-raporlar': 'Analiz & Raporlar',
  'yedekleme-guvenlik': 'Yedekleme & Güvenlik',
} as const;

export type HelpCategory = keyof typeof HELP_CATEGORIES;

export function helpCategoryLabel(category: HelpCategory): string {
  return HELP_CATEGORIES[category];
}

/** Kategori sıralama sırası (sözlük sırası yerine mantıksal akış) */
export const HELP_CATEGORY_ORDER: HelpCategory[] = [
  'baslangic',
  'cari-islemleri',
  'veresiye-takibi',
  'tahsilat-odeme',
  'analiz-raporlar',
  'yedekleme-guvenlik',
];

export type HelpEntry = CollectionEntry<'help'>;

/** Yayındaki yardım makalelerini kategoriye göre gruplar */
export function groupHelpByCategory(entries: HelpEntry[]): Map<HelpCategory, HelpEntry[]> {
  const groups = new Map<HelpCategory, HelpEntry[]>();
  for (const category of HELP_CATEGORY_ORDER) {
    groups.set(category, []);
  }
  for (const entry of entries) {
    const list = groups.get(entry.data.category);
    if (list) {
      list.push(entry);
    }
  }
  for (const [category, list] of groups) {
    groups.set(category, sortByOrder(list));
  }
  return groups;
}

/** order alanına göre artan sıralama */
export function sortByOrder<T extends { data: { order: number } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.data.order - b.data.order);
}

/** Tarih alanına göre azalan (en yeni önce) sıralama */
export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** yayın: true → draft olmayanlar */
export const notDraft = <T extends { data: { draft: boolean } }>(entry: T): boolean =>
  !entry.data.draft;

/** Kaba Markdown gövdesinden tahmini okuma süresi (dakika) */
export function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Yönlendirme için gorev sonuna slash ekleyen yardımcı */
export function withTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}
