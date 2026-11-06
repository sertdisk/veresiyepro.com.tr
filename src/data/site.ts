// Merkezi site metadata ve sabitleri.
// NOT: `contactEmail` geçici bir PLACEHOLDER'dır; yayından önce gerçek destek
// adresiyle değiştirilmelidir. Bkz. README "Yayından önce değiştirilecekler".

export const SITE = {
  name: 'Veresiye Pro',
  title: 'Veresiye Programı — Veresiye Pro | Windows Veresiye Takip',
  description:
    'Windows için akıllı veresiye programı: bekleyen işlemler, taksitli takip, QR iletişim ve 5 boyutlu finansal radar. İnternetsiz çalışır.',
  url: 'https://veresiyepro.com.tr',
  locale: 'tr_TR',
  defaultImage: '/images/general/og-default.png',
  defaultImageAlt: 'Veresiye Pro — Windows için akıllı veresiye programı tanıtım görseli',
  defaultImageWidth: 1200,
  defaultImageHeight: 630,
  keyboardCompatible: 'Windows 10 & 11 uyumlu masaüstü uygulaması',
} as const;

export const LINKS = {
  download: 'https://veresiyepro.com.tr/indir/VeresiyePro-setup.exe',
  panelSignup: 'https://panel.veresiyepro.com.tr/#/giris?mode=kayit',
  panelLogin: 'https://panel.veresiyepro.com.tr/#/giris',
  // PLACEHOLDER — yayından önce gerçek destek adresiyle değiştirilmeli.
  contactEmail: 'destek@veresiyepro.com.tr',
} as const;

export const PRICING = {
  firstYear: '5.000₺',
  renewal: '3.000₺',
  renewalBase: '5.000₺',
  discountPercent: 40,
  note: 'Tek lisansla tüm premium avantajlar. Yenilemelerinizde %40 indirim uygulanır.',
} as const;

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavGroup = {
  title: string;
  links: NavLink[];
};

/** Header birincil navigasyon. Blog bağlantısı yalnızca yazı varsa gösterilir. */
export const HEADER_NAV: NavLink[] = [
  { label: 'Özellikler', href: '/#ozellikler' },
  { label: 'Sürüm Notları', href: '/surum-notlari/' },
  { label: 'Yardım', href: '/yardim/' },
  { label: 'Referanslar', href: '/referanslar/' },
  { label: 'Fiyatlar', href: '/#premium' },
];

export const FOOTER_GROUPS: NavGroup[] = [
  {
    title: 'Ürün',
    links: [
      { label: 'Özellikler', href: '/#ozellikler' },
      { label: 'Premium Lisans', href: '/#premium' },
      { label: 'Windows için İndir', href: LINKS.download, external: true },
      { label: 'Panel Girişi', href: LINKS.panelLogin, external: true },
      { label: 'Sürüm Notları', href: '/surum-notlari/' },
      { label: 'Hakkımızda', href: '/hakkimizda/' },
    ],
  },
  {
    title: 'Kaynaklar',
    links: [
      { label: 'Yardım Merkezi', href: '/yardim/' },
      { label: 'Referanslar', href: '/referanslar/' },
      { label: 'Sıkça Sorulan Sorular', href: '/#sss' },
    ],
  },
  {
    title: 'Yasal',
    links: [
      { label: 'KVKK Aydınlatma Metni', href: '/yasal/kvkk-aydinlatma-metni/' },
      { label: 'Gizlilik Politikası', href: '/yasal/gizlilik-politikasi/' },
      { label: 'Çerez Politikası', href: '/yasal/cerez-politikasi/' },
      { label: 'Kullanım Koşulları', href: '/yasal/kullanim-kosullari/' },
    ],
  },
];
