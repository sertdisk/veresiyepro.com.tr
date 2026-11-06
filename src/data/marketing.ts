// Ana sayfa pazarlama içerikleri.
// Tüm sayısal değerler yalnızca örnek arayüz (demo) verisidir.
// Fiyat bilgisi tek kaynaktan (site.ts → PRICING) okunur.

export const TRUST_ITEMS = [
  {
    icon: 'wifi-off' as const,
    title: 'İnternetsiz çalışma',
    text: 'Bağlantı kopsa da kayıt, tahsilat ve analiz akmaya devam eder.',
  },
  {
    icon: 'database' as const,
    title: 'Ömür boyu veri güvencesi',
    text: 'Lisans süresi bitse de verileriniz kilitlenmez, erişiminiz sürer.',
  },
  {
    icon: 'qr' as const,
    title: '0 TL QR iletişim',
    text: 'WhatsApp, SMS ve arama için ek paket veya servis ücreti yok.',
  },
  {
    icon: 'users' as const,
    title: 'Limitsiz cari',
    text: 'Müşteri, tedarikçi ve personel hesaplarını sınırsız açın.',
  },
];

export const PENDING_POINTS = [
  {
    icon: 'panel' as const,
    title: 'Ana ekranda günün planı',
    text: 'Gecikmiş ve bugün vadesi gelen işlemler, açılışta ilk sırada listelenir.',
  },
  {
    icon: 'user' as const,
    title: 'Cari sayfasında kişiye özel liste',
    text: 'Müşterinin kartına girdiğinizde geçmiş yerine bekleyen işlemler öne çıkar.',
  },
  {
    icon: 'ledger' as const,
    title: 'Tedarikçi ve vadeli borçlar',
    text: 'Ödemeniz gereken işlemler de aynı listede; kasa planı tek ekranda.',
  },
  {
    icon: 'bolt' as const,
    title: 'Tek tıkla aksiyon',
    text: 'Tahsilat veya ödeme kaydını bulunduğunuz ekrandan çıkmadan tamamlayın.',
  },
];

export const FEATURES = [
  {
    icon: 'calendar' as const,
    title: 'Vadesiz, Vadeli ve Taksitli Veresiye',
    text: 'İster serbest vadesiz, ister kesin vade tarihi belirterek veresiye girin. Toplam tutarı taksitlere otomatik bölün, dilediğiniz taksit tutarını elle düzenleyin.',
  },
  {
    icon: 'repeat' as const,
    title: 'Tekrarlayan Veresiye (Aidat & Fatura)',
    text: 'Aylık sabit tutarlı aidat veya değişken tutarlı faturalar gibi periyodik ödemeleri tanımlayın; günü geldiğinde otomatik olarak cariye işlensin.',
  },
  {
    icon: 'users' as const,
    title: 'Müşteri, Tedarikçi ve Personel Carileri',
    text: 'Limitsiz müşteri, tedarikçi ve personel hesabı oluşturun. Veresiye verdiğiniz kişiye kendi borcunuzu da kaydedin, çift yönlü mahsuplaşın.',
  },
  {
    icon: 'wallet' as const,
    title: 'Tüm Ödeme ve Tahsilat Türleri',
    text: 'Nakit, POS, Kredi Kartı, EFT/Havale ve Çek seçenekleriyle, kasa ve banka hesaplarınızla ilişkilendirerek kaydedin.',
  },
  {
    icon: 'document' as const,
    title: 'Çek, Senet ve Satış Sözleşmesi',
    text: 'Çekleri vade, banka ve şube bilgileriyle saklayın. Otomatik senet üretimi ve satış sözleşmesi dökümleri alın.',
  },
  {
    icon: 'bolt' as const,
    title: 'Sıfır Menülü Hızlı Veresiye Arayüzü',
    text: 'İhtiyaç duyduğunuz tüm işlemleri bulunduğunuz ekrandan çıkmadan tek tıkla yapın. Alt menülerde kaybolmadan hızla işlem tamamlayın.',
  },
];

export const COMPARISON = {
  old: {
    label: 'Eski yöntem',
    title: 'Defter, Excel ve dağınık notlar',
    items: [
      'Geciken vadeler gözden kaçar, tahsilat gecikir.',
      'Kimin ne kadar borcu olduğu her an net değildir.',
      'Aynı müşteriye hem alacak hem borç karışır.',
      'Ay sonu mutabakatı saatler sürer.',
    ],
  },
  modern: {
    label: 'Veresiye Pro',
    title: 'Tek ekranda, yapılacak işe odaklı düzen',
    items: [
      'Bekleyen işlemler açılışta önünüzde hazırdır.',
      'Gecikmiş tahsilatlar ayrı ve öncelikli listelenir.',
      'Net bakiye, çift yönlü cariyle kuruşu kuruşuna görünür.',
      'Tahsilat, ödeme ve rapor aynı akışta tamamlanır.',
    ],
  },
};

export type RadarDimension = {
  id: string;
  label: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  rows: { name: string; meta: string; value: string }[];
};

export const RADAR_DIMENSIONS: RadarDimension[] = [
  {
    id: 'yuksek',
    label: 'Yüksek',
    title: 'Yüksek bakiyeli cariler',
    description:
      'Bakiyesi en yüksek hesapları tek listede görün. Riskinizi ve tahsilat önceliğinizi bu listeye göre belirleyin.',
    metric: '₺18.400',
    metricLabel: 'En yüksek cari bakiye',
    rows: [
      { name: 'Demir İnşaat Ltd.', meta: 'Tedarikçi · vadeli', value: '₺18.400' },
      { name: 'Kaya Ticaret', meta: 'Müşteri · taksitli', value: '₺12.750' },
      { name: 'Ahmet Yılmaz', meta: 'Müşteri · vadeli', value: '₺9.600' },
    ],
  },
  {
    id: 'artan',
    label: 'Artan',
    title: 'Hızlı artan bakiyeler',
    description:
      'Son dönemde bakiyesi hızla yükselen carileri fark edin; yeni veresiye verirken daha bilinçli karar alın.',
    metric: '+₺4.250',
    metricLabel: 'Son 30 günde artış',
    rows: [
      { name: 'Kaya Ticaret', meta: 'Son 30 gün · 6 işlem', value: '+₺4.250' },
      { name: 'Ahmet Yılmaz', meta: 'Son 30 gün · 4 işlem', value: '+₺2.100' },
      { name: 'Gül Fırın', meta: 'Son 30 gün · 3 işlem', value: '+₺1.480' },
    ],
  },
  {
    id: 'geciken',
    label: 'Geciken',
    title: 'Geciken veresiyeler',
    description:
      'Vadesi geçmiş alacakları tek listede görün. Müşteriyi aramak veya tahsilat kaydı açmak için doğrudan satırdan ilerleyin.',
    metric: '₺14.200',
    metricLabel: 'Toplam gecikmiş',
    rows: [
      { name: 'Demir İnşaat Ltd.', meta: '3 gün gecikme', value: '₺9.700' },
      { name: 'Ahmet Yılmaz', meta: '2 gün gecikme', value: '₺4.500' },
      { name: 'Yıldız Market', meta: 'Bugün · 2. taksit', value: '₺0' },
    ],
  },
  {
    id: 'uzayan',
    label: 'Uzayan',
    title: 'Uzayan ve hareketsiz hesaplar',
    description:
      'Uzun süredir hareket görmeyen hesapları görün; unutulan bakiyeler ve sessizleşen cariler gözden kaçmasın.',
    metric: '4 cari',
    metricLabel: '90+ gün hareketsiz',
    rows: [
      { name: 'Kaya Ticaret', meta: '112 gündür hareket yok', value: '₺12.750' },
      { name: 'Duran Elektrik', meta: '96 gündür hareket yok', value: '₺3.900' },
      { name: 'Bitmez Oto', meta: '91 gündür hareket yok', value: '₺1.250' },
    ],
  },
  {
    id: 'gelecek',
    label: 'Gelecek',
    title: 'Gelecek nakit akışı',
    description:
      'Önümüzdeki günlerde vadesi gelecek tahsilat ve ödemeleri birlikte görün; kasa planınızı önceden yapın.',
    metric: '₺27.900',
    metricLabel: 'Önümüzdeki 30 gün (net)',
    rows: [
      { name: 'Ahmet Yılmaz', meta: '12 Kasım · taksit 3/4', value: '+₺4.500' },
      { name: 'Demir İnşaat Ltd.', meta: '18 Kasım · ödenecek', value: '-₺6.800' },
      { name: 'Kaya Ticaret', meta: '24 Kasım · taksit 2/6', value: '+₺2.150' },
    ],
  },
];

export const SECURITY_CARDS = [
  {
    icon: 'shield' as const,
    title: 'Yerel ve şifreli veritabanı',
    text: 'Veresiye kayıtlarınız bilgisayarınızdaki şifreli yerel veritabanında tutulur. Bulut kesintisi veya internet yavaşlığı veri girişinizi durdurmaz.',
  },
  {
    icon: 'database' as const,
    title: 'Otomatik yerel yedek',
    text: 'Seçtiğiniz güvenli klasöre veya harici belleğe sık aralıklarla otomatik yedek alınır. Dilediğiniz an tek tıkla elle yedek de alabilirsiniz.',
  },
  {
    icon: 'cloud' as const,
    title: 'Şifreli sunucu bulut yedeği',
    text: 'Son günlük yedekleriniz sunucuda uçtan uca şifreli olarak saklanır. Bilgisayarınız arızalansa da yeni cihazınıza geri dönebilirsiniz.',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Akıllı Bekleyen İşlemler Sistemi nasıl çalışır ve işletmeme nasıl rehberlik eder?',
    answer:
      "Veresiye Pro'nun en önemli avantajı işlem geçmişine değil, yapılacak işlemlere odaklanmasıdır. Ana ekranı açtığınızda veya bir müşterinin kartına girdiğinizde, geçmiş satırlar yerine öncelikle gecikmiş ve bugün gerçekleşmesi beklenen işlemler listelenir.",
  },
  {
    question: 'Veresiye Pro veresiye programı internet bağlantısı olmadan çalışır mı?',
    answer:
      'Evet. Veresiye Pro tamamen Offline-First (çevrimdışı öncelikli) olarak tasarlanmış bir veresiye programıdır. Veresiye kayıtlarınız bilgisayarınızdaki şifreli yerel veritabanında tutulur. İnternetiniz tamamen kesilse bile tüm veresiye kayıt, tahsilat, taksit ve analiz işlemlerinizi eksiksiz sürdürebilirsiniz.',
  },
  {
    question: 'QR ile iletişim özelliği nasıl çalışır, ekstra SMS ücreti öder miyim?',
    answer:
      'Sıfır maliyetlidir. Müşterinizin cari ekranında oluşturulan akıllı QR kodu telefonunuzun kamerasıyla okutarak doğrudan telefonunuz üzerinden WhatsApp mesajı, SMS gönderebilir veya tek dokunuşla arama başlatabilirsiniz.',
  },
  {
    question: 'Aynı kişiye hem veresiye borcu hem de mal alımı kaydedebilir miyim?',
    answer:
      "Evet. Veresiye Pro'da müşteri, tedarikçi veya personel ayrımı olmadan tek bir cari karta hem sizin veresiye alacağınızı hem de kendi borcunuzu girebilirsiniz. Sistem iki hareketi otomatik mahsuplaştırarak net bakiyeyi kuruşu kuruşuna gösterir.",
  },
  {
    question: 'Lisans süresi bittiğinde verilerime ne olur?',
    answer:
      "Veresiye Pro'da verileriniz asla kilitlenmez. Lisans süreniz bitse dahi mevcut verilerinize her zaman erişebilir, yeni kayıtlarınızı girmeye devam edebilir ve verilerinizi Excel, CSV veya JSON formatlarında dışa aktarabilirsiniz.",
  },
  {
    question: 'Bilgisayarıma bir şey olursa veresiye kayıtlarımı kaybeder miyim?',
    answer:
      'Hayır. Veresiye Pro iki katmanlı güvenlik sağlar. Belirlediğiniz yerel klasöre otomatik sık aralıklarla tam veresiye yedeği alır ve son günlük yedekleriniz sunucumuzda uçtan uca şifrelenmiş olarak depolanır.',
  },
];
