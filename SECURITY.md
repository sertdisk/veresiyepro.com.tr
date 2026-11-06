# Güvenlik Politikası

## Desteklenen sürümler

Bu depo, `veresiyepro.com.tr` tanıtım sitesinin kaynak kodunu içerir. Yalnızca `main` dalındaki en güncel içerik desteklenir.

## Güvenlik açığı bildirimi

Bir güvenlik açığı bulduysanız lütfen **açıkça (public) bir GitHub issue açmayın**.

Bunun yerine, ayrıntıları [SECURITY-PLACEHOLDER e-postası] adresine gönderin ve sürdürücülerle doğrudan iletişime geçmek için depo yöneticisiyle bir kanal talep edin. İdeal bir bildirim şunları içerir:

- Güvenlik açığının türü (ör. bilgi sızdırma, XSS, bağımlılık riski)
- Etkilenen dosya/yol veya sayfa
- Yeniden üretim adımları (adım adım)
- Varsa, etkisini gösteren örnek kod veya istek
- Varsa, önerilen yama

Bu depo **statik tanıtım sitesi** olduğundan, bildirimlerinizi yönlendirmede yardımcı olabilecek notlar:

- Dağıtım altyapısını (sunucu, SFTP kimlik bilgileri, host bilgisi vb.) değil, yalnızca bu repodaki içerik/derleme sürecini etkileyen konuları bildirin.
- **Uygulama kendisinde** (Windows masaüstü programı) bir güvenlik açığı bulursanız, bu depo üzerinden değil, ürün destek kanalı üzerinden bildirin.

## Yanıt süresi

Bildirimler gün içinde incelenir; 90 gün içinde sızdırılmış bilgi kullanımına tolerans yoktur. Sorun giderildikçe güncellemeleri takip edin.

## Depo güvenlik kuralları

Tüm katkıda bulunanlar için:

- **Gizli anahtar/secrets göndermeyin**: API anahtarları, sunucu IP'leri, sunucu adresleri, SSH/SFTP kimlik bilgileri, gerçek e-postalar veya parola değerleri depoya girmez.
- Dağıtım sırları yalnızca **GitHub Actions repository secrets** olarak tanımlanır; yerel `.env` dosyaları `.gitignore` ile dışlanır.
- Hassas değer önerileri gerekiyorsa `.env.example` içine yalnızca **yalancı placeholder** değerler eklenir.
- Bağımlılıkları mümkün olduğunca minimum tutun; güncellemeleri GitHub Actions ve Dependabot ile takip edin.
