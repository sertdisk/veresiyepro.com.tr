# Veresiye Pro — Resmî Tanıtım Sitesi

[veresiyepro.com.tr](https://veresiyepro.com.tr) alan adının kaynak kodudur. Windows için geliştirilen **Veresiye Pro** veresiye programının tanıtım sitesi; Astro ile üretilen, tamamen statik (SSG) bir sitedir.

> İşlem geçmişine değil, yapılacak işlemlere odaklanan Windows veresiye programı. Akıllı bekleyen işlemler, QR iletişim ve 5 boyutlu finansal radar ile veresiye yönetiminize rehberlik eder.

## Teknolojiler

- [Astro](https://astro.build) 7.x — statik site üretimi (SSG)
- TypeScript (strict)
- `@astrojs/sitemap` — otomatik site haritası
- Bağımlılıklar bilinçli olarak minimum tutulur; React/Vue/Tailwind kullanılmaz.

## Gereksinimler

- **Node.js >= 22.23.4** (önerilen: Node 24 LTS)
- npm

> Windows PowerShell'de script execution policy nedeniyle npm komutlarını `cmd /c "npm ..."` biçiminde çalıştırmanız gerekebilir.

## Yerel geliştirme

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/ altına statik çıktı üretir
npm run preview    # dist/ çıktısını önizler
npm run check      # astro check — TypeScript/Astro doğrulaması
npm run audit      # dist/ üzerinde SEO/metadata/JSON-LD/bağlantı denetimi (build sonrası)
```

## Proje yapısı

```
.
├── public/                    # Statik varlıklar (favicon, logo, görseller, robots.txt)
│   └── images/
│       ├── general/           # Logo ve genel görseller
│       ├── help/              # Yardım makalesi görselleri
│       └── testimonials/      # Referans görselleri (henüz boş)
├── src/
│   ├── components/
│   │   ├── content/           # ReleaseCard, HelpSidebar, TestimonialCard, PostCard
│   │   ├── seo/               # SEO, StructuredData (JSON-LD)
│   │   ├── site/              # Header, Footer, Logo, SiteBrand
│   │   └── ui/                # Button, Badge, PageHero, Toc, Prose, vb.
│   ├── content/               # Markdown içerik koleksiyonları
│   │   ├── releases/          # Sürüm notları
│   │   ├── help/              # Yardım makaleleri
│   │   ├── legal/             # Yasal belgeler
│   │   ├── testimonials/      # Referanslar
│   │   └── blog/              # Blog yazıları (başlangıçta boş)
│   ├── content.config.ts      # Koleksiyon şemaları (Zod)
│   ├── data/site.ts           # Site metadata, bağlantılar, fiyatlar, menüler
│   ├── layouts/BaseLayout.astro
│   ├── pages/                 # Sayfa rotaları
│   ├── styles/global.css      # Tasarım token'ları + global stiller
│   └── utils/format.ts        # Tarih biçimlendirme, kategori etiketleri, sıralama
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## İçerik düzenleme

Tüm içerik `src/content/` altındaki Markdown dosyalarındadır. Dosyaları GitHub arayüzünden de düzenleyebilirsiniz.

**Dosya adı = URL adresi (slug).** Ayrı bir `slug` alanı yoktur; dosya adı kebab-case ve Türkçe karaktersiz olmalıdır. Örnek: `src/content/help/tahsilat-kaydi.md` → `/yardim/tahsilat-kaydi/`. Dosya adını değiştirmek URL'yi değiştirir; yayınlanmış bir dosyayı yeniden adlandırırsanız eski adres için sunucuda 301 yönlendirmesi tanımlayın.

Ortak isteğe bağlı SEO alanları (koleksiyona göre değişir): `description` (kısa meta açıklaması, hedef 120–160 karakter), `updated` (gerçek güncelleme tarihi), `image`/`imageAlt`, `canonicalURL`, `noindex`. `noindex: true` sayfada canonical üretilmez; sayfanın sitemap dışında kalması için `astro.config.mjs` içindeki `sitemap.filter` listesine yolun eklenmesi gerekir — `npm run audit`, noindex bir URL'i sitemap'te görürse hata verir.

### Sürüm notu ekleme

`src/content/releases/1-5-0.md`:

```markdown
---
title: 'Sürüm 1.5.0: ...'
version: '1.5.0'
date: 2026-11-20
summary: 'En fazla 280 karakterlik özet.'
highlights:
  - 'Öne çıkan yenilik'
draft: false
---

Markdown gövde...
```

Sürümler tarihe göre otomatik sıralanır; en yeni sürüm sürüm notları sayfasında tam olarak gösterilir. Gelecek tarihli sürümler, tarih gelene kadar taslak gibi davranır ve siteye/sitemap'e dahil edilmez.

### Yardım makalesi ekleme

`src/content/help/` altına Markdown ekleyin. Kategori şunlardan biri olmalı:

`baslangic`, `cari-islemleri`, `veresiye-takibi`, `tahsilat-odeme`, `analiz-raporlar`, `yedekleme-guvenlik`

### Yasal belge ekleme

`src/content/legal/` altına ekleyin. **Yayına almadan önce** `[ŞİRKET ÜNVANI]`, `[TEBLİGAT ADRESİ]`, `[E-POSTA]`, `[VERGİ DAİRESİ / VERGİ NO]`, `[TELEFON]` gibi placeholder'ları gerçek bilgilerle değiştirin; her dosyanın başındaki `<!-- YAYINA ALMADAN ÖNCE ... -->` yorumu bunu hatırlatır.

### Görsel ekleme

- Genel görseller: `public/images/general/`
- Yardım makalesi görselleri: `public/images/help/`
- Markdown içinde: `![Açıklayıcı alt metin](/images/help/dosya-adi.svg)`

Görseller mutlaka anlamlı `alt` metniyle birlikte kullanılmalıdır.

**Görsel politikası**

| Konu | Kural |
| --- | --- |
| Format | Vektörler için SVG; fotoğraf/ekran görüntüsü için WebP (gerekirse AVIF), zorunlu değilse PNG kullanılmaz |
| Paylaşım görseli | Varsayılan `public/images/general/og-default.png`, **1200×630** |
| Logo | `logo.svg` birincil; `logo.png` **512×512** (JSON-LD ve yedek kullanım) |
| Boyutlar | Her `<img>` etiketinde gerçek `width`/`height` verilmeli (CLS önlemi) |
| Lazy loading | İlk ekran dışındaki tüm görsellerde `loading="lazy"`; LCP görselinde asla lazy yok |
| Dosya adı | Kebab-case, Türkçe karaktersiz, konuyla ilişkili: `cari-hesap-ekrani.webp` |
| Boyut sınırı | Tek görsel için hedef ≤ 150 KB (SVG hariç); 1600 px'ten geniş raster yüklenmez |
| Decorative | Süsleme amaçlı görsellerde `alt=""` veya `aria-hidden="true"` |

Markdown içinde boyut vermek için HTML kullanın:

```html
<img src="/images/help/ornek-ekran.svg" alt="Cari işlemlerine örnek şema" width="720" height="420" loading="lazy">
```

Sürüm notu görseli eklerseniz frontmatter'da `image`, `imageAlt` ile birlikte `imageWidth` ve `imageHeight` alanlarını da verin (varsayılan 1200×675).

## Blog bölümü

Blog **başlangıçta kapalıdır**. Menüde Blog bağlantısı görünmez ve `/blog/` rotası hiç üretilmez.

Hazır örnek yazı `src/content/blog/_ornek-haber.md` dosyasındadır. Blog koleksiyonu, dosya adı `_` ile başlayan Markdown dosyalarını yüklemeyecek şekilde yapılandırılmıştır (`src/content.config.ts` içindeki `glob` deseni). Blog'u etkinleştirmek için dosyayı yeniden adlandırın:

```
src/content/blog/_ornek-haber.md  →  src/content/blog/ornek-haber.md
```

Bir yazı yayında olduğu sürece Blog menüde görünür ve `/blog/` indeksi oluşur. Tüm yazılar `draft: true` ise blog yine kapalı kalır. Gelecek tarihli yazılar da tarih gelene kadar yayınlanmaz; yalnızca gelecek tarihli yazı varsa blog kapalı kalır.

## Yayından önce değiştirilmesi gerekenler

| Konu | Dosya | Not |
| --- | --- | --- |
| Destek e-postası | `src/data/site.ts` (`LINKS.contactEmail`) | `destek@veresiyepro.com.tr` geçici placeholder'dır |
| Yasal şirket bilgileri | `src/content/legal/*.md` | `[ŞİRKET ÜNVANI]`, adres, vergi bilgileri, telefon |
| Yasal metinlerin hukuki kontrolü | `src/content/legal/*.md` | Yayından önce bir hukuk danışmanına inceletin |
| Referanslar | `src/content/testimonials/*.md` | **Örnek/fictional** içeriklerdir; gerçek müşteri referanslarıyla değiştirin veya onay alın |
| Sürüm notları ve yardım içerikleri | `src/content/releases/*.md`, `src/content/help/*.md` | Örnek/şablon içeriklerdir; gerçek sürüm geçmişi ve doğrulanmış ürün akışlarıyla değiştirin |
| Görseller | `public/images/help/ornek-ekran.svg` | Nötr şemadır, gerçek ekran görüntüsü değildir |

> **Örnek içerik uyarısı:** Referanslar sayfasındaki isim, işletme ve yorumlar kurgusaldır ve sayfada bu durum görünür bir notla belirtilir. Sürüm notları ile yardım makaleleri de gerçek ürün davranışını doğrulamak için gözden geçirilmelidir. Kurgusal referanslar nedeniyle sitede `Review` veya `AggregateRating` yapılandırılmış verisi **yayınlanmaz**. Yayına çıkmadan önce gerçek, izinli içerikle değiştirin.

## SEO, GEO ve Performans

Site, arama motorları ve yapay zekâ arama sistemleri için statik HTML üzerinden okunabilir olacak şekilde üretilir:

- Her sayfada benzersiz `title`, meta description, canonical, Open Graph ve Twitter Card metaverileri bulunur.
- JSON-LD: `Organization`, `WebSite`, `SoftwareApplication`, `BreadcrumbList`, `Article` (sürüm notu), `TechArticle` (yardım), `BlogPosting` (blog), `WebPage` (yasal ve hakkımızda) ve yalnızca görünür SSS bulunan ana sayfada `FAQPage`. `Review`/`AggregateRating` kullanılmaz.
- Görünür breadcrumb'lar ile `BreadcrumbList` JSON-LD aynı hiyerarşiyi paylaşır; `/hakkimizda/` sayfası ürün yaklaşımını ve veri sahipliğini açıklar.
- `sitemap-index.xml` build sırasında otomatik üretilir; `robots.txt` arama motorları ve AI botları için bilinçli erişim politikası içerir.
- `public/llms.txt` ürünün kamuya açık, makine tarafından okunabilir özetini sunar. Bu bir sıralama garantisi değildir.
- Görsellerde anlamlı `alt`, mümkün olduğunda WebP/AVIF/SVG ve boyut bilgisi; ilk ekran dışındaki görsellerde `loading="lazy"` kullanılır.
- Fontlar kendi sunucumuzdan gelir; harici font/CDN isteği yapılmaz, `font-display: swap` kullanılır.
- JavaScript minimumda tutulur; etkileşimsiz sayfalar statik HTML olarak sunulur.

Kabul hedefleri (Lighthouse, mobil ve masaüstü): Performance ≥ 95, SEO = 100, Accessibility = 100, Best Practices = 100. Core Web Vitals hedefleri: LCP ≤ 2,5 sn, INP ≤ 200 ms, CLS ≤ 0,1. Bu hedefler ölçümle doğrulanır; ölçülmemiş sonuç başarı sayılmaz.

`npm run build` sonrasında `npm run audit` ile üretilen HTML'de metadata, başlık hiyerarşisi, canonical, iç bağlantı, görsel, JSON-LD ve sitemap kontrolleri yapılır. Denetim hata bulursa sıfırdan farklı kodla çıkar; CI (`deploy.yml`) build adımından sonra bu komutu çalıştırır.

### Denetlenen başlıca kurallar

- `<html lang="tr-TR">`; benzersiz `title` ve (indekslenebilir sayfalarda) benzersiz meta description.
- Canonical zorunlu; 404 ve `noindex` sayfalarda canonical üretilmez.
- Her sayfada tek `h1`, başlık seviyesi atlaması yok, yinelenen `id` yok.
- Kırık iç bağlantı ve `#çapa` hedefi yok.
- Görsellerde `alt` + `width`/`height`.
- JSON-LD parse edilebilir; sayfa türüne göre beklenen tipler mevcut; `Review`/`AggregateRating` yasak.
- `sitemap-index.xml`, `robots.txt` (sitemap satırı) ve `llms.txt` mevcut; sitemap'te noindex URL yok.
- İndekslenebilir sayfalarda description ≤ 160 karakter; `og:image` zorunlu.

Sunucu tarafındaki HTTPS, WWW/non-WWW yönlendirmesi, gerçek 404 durum kodu, sıkıştırma (Brotli/Gzip), `Cache-Control` ve güvenlik başlıkları (CSP, `X-Content-Type-Options`, `Referrer-Policy`) bu depodaki statik dosyaların dışında yapılandırılır; ayrıntılar yerel proje dokümantasyonundadır. Bu maddeler depo içi denetimle PASS sayılmaz.

## Dağıtım

GitHub Actions iki aşamalı çalışır:

1. **Build** — her `push` ve `pull_request` üzerinde `npm ci`, `npm run check`, `npm run build` ve `npm run audit` çalışır; `dist/` artifact olarak yüklenir. SEO denetimi başarısızsa artifact yüklenmez.
2. **Deploy** — yalnızca `main` dalına `push` olduğunda **ve** `DEPLOY_ENABLED` değişkeni `true` ise SFTP ile yayınlanır.

Dağıtım varsayılan olarak **kapalıdır** (build-only). Etkinleştirmek için:

- Repository → Settings → Secrets and variables → Actions → Variables bölümünde `DEPLOY_ENABLED=true` tanımlayın.
- Aşağıdaki secret'ları ekleyin.

### Dağıtım secret'ları

| Secret | Zorunlu | Açıklama |
| --- | --- | --- |
| `SFTP_HOST` | Evet | Sunucu adresi |
| `SFTP_PORT` | Hayır | Varsayılan `22` |
| `SFTP_USER` | Evet | SFTP kullanıcısı |
| `SFTP_PASSWORD` | Birini seçin | Parola ile kimlik doğrulama |
| `SFTP_SSH_KEY` | Birini seçin | Özel anahtar (parolasız) |
| `SFTP_REMOTE_DIR` | Evet | Hedef dizin (örn. `/var/www/site/`) |
| `SFTP_KNOWN_HOSTS` | Evet | Sunucunun `known_hosts` satırı; host doğrulaması için zorunlu |

Notlar:

- `SFTP_PASSWORD` ve `SFTP_SSH_KEY`'den en az biri tanımlanmalıdır. **Üretimde SSH anahtarı önerilir**; anahtar varsa parola kullanılmaz. Parola modu `sshpass -e` ile desteklenir ve parola komut satırına yazılmaz.
- Deploy işi yalnızca `push` ile çalışır; **fork PR'ları secret alamaz** ve deploy tetiklemez.
- `StrictHostKeyChecking=yes` kullanılır; `SFTP_KNOWN_HOSTS` olmadan bağlantı kurulmaz. Port 22 dışındaysa `known_hosts` satırı `[host]:port` biçiminde olmalıdır.
- `mirror --delete` kullanıldığı için `SFTP_REMOTE_DIR` yalnızca siteye ait dosyaların bulunduğu dizin olmalıdır.
- Secret değerleri hiçbir zaman log'a yazılmaz.

## Güvenlik

- Depoya **asla** gizli anahtar, parola, sunucu IP'si veya gerçek kişisel veri eklemeyin.
- `.env` dosyaları `.gitignore` ile dışlanır; yalnızca `.env.example` takip edilir ve yalnızca placeholder değer içerir.
- Güvenlik açığı bildirimi için [SECURITY.md](./SECURITY.md) dosyasına bakın.

## Notlar

- Referanslar bölümündeki isim, işletme ve yorumlar **kurgusal örneklerdir**; gerçek kişi ve işletmelerle ilişkisi yoktur.
- Tasarım token'ları `src/styles/global.css` içindeki CSS değişkenlerindedir (`--color-primary`, `--radius-*`, `--space-*`, `--text-*` vb.). Görsel katman bu değişkenler üzerinden değiştirilmelidir.
- Ayrıntılı teknik ve operasyon dokümantasyonu bu depo dışında tutulur.
