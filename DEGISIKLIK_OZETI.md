# index.html yeniden yazımı: değişiklik özeti

Tarih: 2026-10-31 · Eski dosyanın yedeği: oturumun geçici klasöründe (`index.old.html`).
İddialar `tonara-core/docs/CLAIMS.md`, `LIMITLER.md`, `GUVENLIK_OZETI.md`, `DECISIONS.md`, `evidence/eval/REAL_INJECTION_gemma3_4b.md` ve kaynak kodla karşılaştırıldı.

## İkinci tur (2026-10-31): Selman Vural kaldırıldı, Hakkımızda sıfırdan yazıldı
- **Selman Vural sayfası (`#/selman-vural`) kaldırıldı.** Menüdeki ve alt bilgideki bağlantılar, Güvenlik sayfasındaki "Kurucumuz Selman Vural" kutusu, `PERSONAL_EMAIL` / `LINKEDIN` ayarları ve onları dolduran kod da çıktı. Sitede bu isim artık geçmiyor.
- Eski `#/selman-vural` bağlantısı kırılmıyor: açan kişi Hakkımızda'ya yönlenir.
- Staj (Bursa Plastik Omnium), üniversite ve "ham kanıt olmadan PASS yoktur" bölümleri o sayfayla birlikte gitti.
- **Hakkımızda sıfırdan yazıldı**, kişi adı yok. Bölümler: ne yapıyoruz → nereden geliyoruz (veritabanı güvenliği, AXIS'in üç kararı ve Tonara'daki karşılığı) → sizinle nasıl çalışırız → şu an hangi aşamadayız (örnek veriyle test edildi, ilk pilotlar başlıyor).
- **Projeler** birinci tekil şahıstan "biz" diline çevrildi. SENTINEL'in "Lise bitirme projesi" etiketi "İlk proje" oldu.
- Menüdeki "Biz" grubu: Hakkımızda, Projeler.

## Korunanlar
- Tüm adresler çalışıyor: `#top`, `#/pilot`, `#/hakkimizda`, `#/paketler`, `#/senaryolar`, `#/guvenlik`, `#/muhakeme`, `#/projeler`; `#/selman-vural` Hakkımızda'ya yönlenir. Ana sayfa bölüm adresleri de (`#iletisim`, `#sss`, `#pilot`, `#paketler`, `#guvenlik`, `#nasil-calisir`, `#moduller`, `#takvim`) çalışıyor.
- Tek dosya, harici CSS/JS yok, sistem fontları. Tema token'ları birebir aynı.
- `aria-labelledby`, `aria-expanded`, `aria-current`, başlıklarda `tabindex="-1"`, görünür odak halkası, `prefers-reduced-motion`.

## Eklenenler (yapı ve erişilebilirlik)
- **404 görünümü (`ad`)**: tanımsız `#/...` adresi artık sessizce ana sayfaya düşmüyor, "Bu sayfa yok" sayfası açılıyor.
- **Sayfa adı duyurusu**: sayfa değişince ekran okuyucuya "Sayfa: …" okunuyor (`aria-live`).
- **Bölüm adresine gidince** odak o bölümün başlığına taşınıyor.
- **Açılır menü**: Aşağı ok ile ilk bağlantıya inme; Tab ile menüden çıkınca kapanma.
- **Karar sayfası sekmeleri**: ok tuşları, Home/End ile gezilebiliyor. JS kapalıyken iki yol alt alta görünüyor.
- Form: zorunlu alanlar ekranda ve ekran okuyucuda belirtiliyor; hata çerçevesi kalınlaşıyor (renk tek başına değil).
- Sayfa değişiminde başa dönüş artık anında (önce yumuşak kaydırmayla yavaş iniyordu).

## Bölüm bölüm değişenler

| Bölüm | Değişiklik | Neden |
|---|---|---|
| Hero | "belgelerinizle **eğitip**" → "modelini kendi sunucunuza kuruyoruz; belgelerinizi okuyup cevabı kaynağıyla veriyor" | Ürün modeli eğitmiyor (CLAIMS #5) |
| Hero örnek ekranı | Kaynağa revizyon eklendi, "rakamlar kurgusal" notu, "Erişim: sadece izin verilen sistemler" satırı çıktı | Ekran örnek; ürün cevapta revizyon gösteriyor |
| Güven şeridi | "KVKK (6698) gözetilerek kurulur" yerine "Her cevapta kaynak gösterilir" | KVKK iddiası kısmi (CLAIMS #10); SSS'de doğru haliyle anlatıldı |
| Güven şeridi, muhakeme | "Açık kaynak" → "açık lisanslı" | Kullanılan model (gemma3) OSI anlamında açık kaynak değil |
| Sorun | "Sizi tanımıyor… kısaltmaları bilmez" → "Belgelerinizi görmez" | Üründe şirket içi kısaltma sözlüğü yok; dolaylı vaat oluyordu |
| Nasıl çalışır / Kurarız | "belgelerinizden bilgi tabanını oluşturur" | Eğitim iddiası yok |
| Nasıl çalışır / Bağlarız | "ERP'ye, Excel'e, e-postaya ve belge arşivine bağlarız" → "bağlantıyı kurulum sırasında, sizin sisteminize göre yazarız" | Hazır bağlayıcı yok (CLAIMS #6) |
| Kurulum süresi | "4–12 hafta sürer" → "tahminimiz 4–12 hafta; kesin süre teklifte" | Rakamın varsayım olduğu belli olsun |
| **Yeni: "Modeli eğitmiyoruz. Bilerek."** | Belge güncellenince anında güncel, kaynak gösterilebilir, yanlış bilgi modele gömülmez | Brief 2.1: zayıflık değil tercih |
| **Yeni: "Sistemlerinize bağlantı"** | Bağlantıların kurulumda yazıldığı; demoda ERP'nin örnek, e-postanın gönderilmeyip taslak olduğu, tekliflerin dosyadan alındığı | Brief 2.2 |
| Demo video altyazısı | Örnek ERP ve gönderilmeyen e-posta notu | Brief 2.2 |
| Modüller | "Tedarikçilerden teklif ister" → "teklif isteğinin taslağını hazırlar"; "tedarikçiye yazar" → "hatırlatma e-postasının taslağını hazırlar"; "Prosedürü **hemen** bulur" çıktı; yetki ve kaynak maddeleri eklendi | Ürün taslak hazırlar, onaysız göndermez; hız ölçülmedi |
| Güvenlik özeti (ana sayfa) | "Her şey sizin" yerine "Her adım kayıtlı" (sonradan değiştirme fark edilir) | Kayıt iddiası doğru seviyede |
| Muhakeme özeti | "Karar verir, gerekçesini yazar…" → "Sistem nasıl karar verir?" + model/kod/insan özeti | Aynı soruyu muhakeme sayfasıyla tekrar cevaplamasın |
| SSS / bağlantı | "Kullandığınız ERP, Excel ve e-postaya bağlanırız" → "Hazır bir bağlayıcı yok; kurulumda sizin sisteminize göre yazarız" | Brief 2.2 |
| SSS / veri | Uygulama içi çıkış korumasının güvenlik duvarı yerine geçmediği eklendi | LIMITLER / Güvenlik |
| SSS / hata | Kodla kaynak kontrolü ve sınırı eklendi | Ürünün gerçekten yaptığı |
| SSS / KVKK | Teknik parçalar (maskeleme, kayıt, silme) var; hukuki uyum müşterinin hukuk birimiyle | CLAIMS #10 |
| SSS / yeni | "Taranmış belgeleri okuyabiliyor mu? Hayır" | OCR yok (LIMITLER) |
| Pilot / takvim | "belgelerinizle **eğitir**" → "belgelerinizden bilgi tabanını kurar ve gereken sisteme bağlarız" | Brief 2.1 |
| Pilot / dahil | "Belgelerinizle **eğitim** ve 1 sisteme bağlantı" → "Belgelerinizden bilgi tabanı ve 1 sisteme bağlantı" | Brief 2.1 |
| Pilot / SSS | NDA sorusu çıktı (iletişime taşındı); "Başarıyı neyle ölçüyorsunuz?" eklendi | Tekrar azaltıldı; test seti ve geri bildirim üründe var |
| Paketler | Kurulum sütunu "tahmini"; bağlantıların kurulumda yazıldığı notu; kapsam dışına "ödeme, banka bilgisi, tedarikçi ekleme" | Ürün bu yetenekleri bilinçli olarak içermiyor |
| Senaryo 1 | Talep okuma, okunamayan alanı işaretleme eklendi; "geçmiş alımlardan" → "bu kalemi veren tedarikçiler" | Ürün katalogdaki tedarikçiyi buluyor |
| Senaryo 3 | "uydurmaz" → "dayanak bulamazsa cevap vermez"; belgenin varlığını da söylemez | Mutlak iddia yumuşatıldı; varlık gizleme üründe var |
| Senaryo 4 | "her sabah tarar" çıktı; "kendisi gönderir" → "onaylar, onaysız gitmez"; "Pilotta salt okunur bağlanır" çıktı | Zamanlayıcı yok; gönderim onaydan sonra |
| Senaryo 5 | Malzeme adı çelişkisi → sayısal değer (kurutma sıcaklığı) çelişkisi; sınır notu eklendi | Çelişki tespiti yalnızca sayısal (LIMITLER) |
| Güvenlik / Ağ | "dışarı giden trafiği kapatırız" → uygulama içi koruma + güvenlik duvarında da kapatılması kurulum planında; yerini tutmadığı açıkça | LIMITLER |
| Güvenlik / Erişim | "pilotta salt okunur erişim alırız" yerine "yapay zekanın doğrudan erişimi yok, yalnızca öneri üretir; izin listesi" | Ürünün gerçek mimarisi |
| Güvenlik / Yetki, Onay, Kayıt | PII maskeleme, tutar kademeleri, iki onaycı, acil durdurma, imzalı zincirli kayıt eklendi | Üründe var ve testli |
| Güvenlik / risk tablosu | "Belge içerikleri komut sayılmaz" çıkarıldı | Yanlıştı: model bazen uyuyor |
| **Yeni: Belgeye gizlenmiş talimat** | Gördük / Olmadı / Açık / Yapılmadı: model bir kısım denemede uydu; onaysız işlem olmadı (kapı koda bağlı); meşru görünen öneri kuyruğa girebilir, savunma onaylayan insan; bağımsız sızma testi yapılmadı | Brief 2.3 |
| Güvenlik / sınırlar | İmza anahtarının dosyada durması ve OCR yokluğu eklendi | LIMITLER |
| Muhakeme | Beyin haritası kaldırıldı; yerine "Bir soru" / "Bir sipariş önerisi" iki yolu, her adımda kimin iş yaptığı (Model / Kod / İnsan) yazılı | Haritadaki "Dil: şirket sözlüğü" ve "gerekirse ince ayar" üründe yok; akış ürünün gerçek ilkesini gösteriyor |
| Muhakeme / ayar | Kuralların imzalı olduğu, geri bildirimin kullanıldığı eklendi | Üründe var |
| Projeler | Test sayıları "AXIS belgelerine göre" diye kaynaklandı | Rakamın kaynağı belli olsun |

## Emin olunamadığı için çıkarılan ya da yumuşatılan iddialar
1. **Model belgelerle eğitilir / gerekirse ince ayar** — üründe yok. Tamamen çıktı.
2. **ERP, Excel, e-posta ve belge arşivine hazır bağlantı** — prototipte örnek ERP ve dosya var. Çıktı.
3. **Şirket içi kısaltma sözlüğü** ("Dil" bölgesi, iz adımı, "kısaltmaları bilmez" karşılaştırması) — kodda yok. Çıktı.
4. **Açık siparişleri her sabah tarama** — zamanlayıcı yok, istekle çalışıyor. Çıktı.
5. **Sözel çelişkiyi fark etme** (iki malzeme adı) — yalnızca sayısal. Senaryo değiştirildi, sınır yazıldı.
6. **"Belge ve e-posta içerikleri komut sayılmaz"** — model uyabiliyor. Çıktı, yerine dürüst bölüm.
7. **"Pilotta bağlandığımız sistemlere salt okunur erişim alırız"** — onaydan sonra örnek ERP'ye sipariş yazılıyor; her pilotta salt okunur olacağı garanti değil. "Bağlantılar okuma yetkisiyle başlar" diye yumuşatıldı.
8. **"Sunucunun dışarı çıkış trafiğini kapatırız"** — güvenlik duvarı müşteri altyapısında. "Kurulum planına yazarız" oldu.
9. **"KVKK (6698) çerçevesinde çalışacak şekilde kurulur"** — hukuki uyum üründe yok. Teknik parçalarla sınırlandı.
10. **"Açık kaynak model"** — gemma3 lisansı açık kaynak sayılmaz. "Açık lisanslı" oldu.
11. **"Prosedürü hemen bulur"** — hız sunucu donanımında ölçülmedi. "Hemen" çıktı.
12. **"Her şey kayıt altında, kayıtlar değiştirilemez"** gibi mutlak ifade kullanılmadı: sunucuya ve anahtara tam erişen biri kaydı baştan yazabilir (LIMITLER).

## Doğrulayamadığım ama bıraktığım
- Pilot ücreti (60.000 TL), paket kullanıcı/sistem sayıları, destek dönüş süreleri, "iki iş günü içinde dönüyoruz": ticari karar, ürünle ilgisi yok. Sizin onayınız.
- AXIS, AXIS Control Plane, VARUX projeleriyle ilgili rakamlar ve ifadeler: bu depoda kanıtı yok. Rakamlara kaynak eklendi; metin sizin.
- "Ekibinize nasıl kullanılacağını öğretiriz", "her hafta değerlendirme": hizmet sözü, ürün yeteneği değil.

## Kontrol edilenler (localhost:8123, gerçek tarayıcı)
- 9 adres + bilinmeyen `#/...` (404) + 6 bölüm adresi + `#/pilot/` sondaki eğik çizgi: doğru görünüm, doğru başlık, `aria-current`, odak başlıkta, duyuru metni.
- Açılır menü: tıkla aç/kapa, Esc (odak düğmeye döner), Aşağı ok, dışarı tıklama, odak dışarı çıkınca kapanma, bağlantıya basınca kapanma.
- Mobil menü (375 px): aç, alt menü, Esc iki aşamalı, bağlantıya basınca kapanma. 10 görünümün hiçbirinde yatay taşma yok.
- Senaryo oynatıcı, karar sayfası sekmeleri (ok tuşları, Home), form doğrulaması.
- Yinelenen `id` yok; `aria-labelledby` / `aria-controls` / `aria-describedby` kırık referans yok; her görünümde tek `h1`, hepsinde `tabindex="-1"`. Konsolda hata yok.
- **Yapılamayan:** tarayıcı paneli gizli olduğu için ekran görüntüsüyle görsel kontrol sınırlı kaldı; gerçek Tab tuşuyla gezinme yerine olaylar betikle tetiklendi. Bir kez kendi tarayıcınızda Tab ile baştan sona geçmenizi öneririm.

## Üçüncü tur (2026-10-31): iletişim modalı, TR/EN, SEO, güvenlik
- **İletişim:** bölümde yalnızca "İletişime Geçin" düğmesi; form `<dialog>` modalda açılır, Formspree'ye (`mqppyagr`) gider. Sayfadaki tüm `#iletisim` bağlantıları da modalı açar. E-posta alanı eklendi (zorunlu). JS kapalıyken form sayfada normal form olarak görünür ve doğrudan Formspree'ye gönderilir.
- **Spam:** `_gotcha` bal küpü, 3 sn alt süre, 60 sn sıklık sınırı, uzunluk sınırları, en fazla 2 bağlantı. reCAPTCHA v2 hazır ama **kapalı**: `js/config.js` içinde `RECAPTCHA_SITE_KEY` doldurulmalı ve aynı anahtar Formspree panelinde tanımlanmalı.
- **Dil:** `?lang=` > kullanıcı seçimi > tarayıcı dili; Türkçe değilse İngilizce. Üst çubukta TR/EN. Çeviriler `js/i18n-en.js` (anahtar = Türkçe metin). Türkçe metin değişirse anahtar da güncellenmeli.
- **Dosya yapısı:** JS artık `js/config.js` (ayarlar) ve `js/app.js`; satır içi script yok (CSP için).
- **SEO:** robots meta, twitter etiketleri, JSON-LD (Organization, WebSite, Service, FAQPage), `robots.txt`, `sitemap.xml`, `site.webmanifest`. Alan adı `https://tonara.tech`: canonical, hreflang (tr, en = `?lang=en`), og:url ve og:image `<head>` içinde sabit yazılı.
- **Güvenlik:** meta CSP, referrer politikası, `rel="noopener noreferrer"`, bozuk adreste çökmeyen yönlendirme, demo video adı doğrulaması. Sunucu başlıkları `_headers` (Netlify/Cloudflare) ve `.htaccess` (Apache) dosyalarında.
- **İçerik koruması:** form alanları dışında seçim/kopyalama/sağ tık/sürükleme engelli. Yalnızca caydırıcıdır.
