# Tonara: tek sayfadan ayrı sayfalara geçiş raporu

Tarih: 2026-10-31. Eski tek dosyalı site ve eski `js/` klasörü `_kaynak/eski/` altında yedekli.

## 1. Dosyalar

| Dosya | Adres | İçerik | Yapısal veri (JSON-LD) |
|---|---|---|---|
| `index.html` | `/` | ana sayfa (tüm bölümler: `#nasil-calisir`, `#egitim`, `#moduller`, `#baglantilar`, `#iletisim`, `#sss` …) | Organization, WebSite, FAQPage (7 soru) |
| `pilot.html` | `/pilot` | eski `#/pilot` | BreadcrumbList, Service + Offer (60.000 TRY, KDV hariç), FAQPage (3) |
| `paketler.html` | `/paketler` | eski `#/paketler` | BreadcrumbList, Service (**fiyat yok**), FAQPage (3) |
| `senaryolar.html` | `/senaryolar` | eski `#/senaryolar` | BreadcrumbList (Ana sayfa › Çözüm › Senaryolar) |
| `guvenlik.html` | `/guvenlik` | eski `#/guvenlik` | BreadcrumbList |
| `muhakeme.html` | `/muhakeme` | eski `#/muhakeme` | BreadcrumbList (Ana sayfa › Güvenlik › …) |
| `hakkimizda.html` | `/hakkimizda` | eski `#/hakkimizda` | BreadcrumbList |
| `projeler.html` | `/projeler` | eski `#/projeler` | BreadcrumbList (Ana sayfa › Hakkımızda › Projeler) |
| `404.html` | bilinmeyen her adres | eski 404 görünümü | yok, `noindex` |
| `sitemap.xml` | | 8 sayfa, `lastmod`, her biri için tr / en (`?lang=en`) / x-default | |
| `robots.txt` | | değişmedi: her şey açık, `Sitemap:` satırı var | |

Her HTML dosyası tek başına çalışıyor: stil, üç betik (ayarlar, İngilizce sözlük, uygulama) ve logo sembolü dosyanın içinde. Dışarıdan yalnızca `favicon.svg`, `site.webmanifest` ve (paylaşım önizlemesi için) `og-image.png` çağrılıyor. Font yok, sistem fontları.

Her sayfanın kendi `<title>`'ı (≤ 60 karakter), `description`'ı (150–160 karakter), canonical adresi, `hreflang`'ı ve `og:`/`twitter:` etiketleri var. EN seçilince başlık ve açıklama da İngilizceye dönüyor.

## 2. Nasıl düzenlenir: `_kaynak/build.py`

Dokuz sayfa elle değil, `_kaynak/` altındaki parçalardan üretiliyor. Tema token'ları, menü ve alt bilgi tek yerde durduğu için sayfalar arasında fark oluşamıyor.

```
_kaynak/ortak/stil.css            tüm sayfaların stili (token'lar burada)
_kaynak/ortak/ust.html, alt.html  menü, alt bilgi
_kaynak/ortak/iletisim-modal.html iletişim formu
_kaynak/sayfalar/<sayfa>.html     her sayfanın içeriği
_kaynak/js/*.js                   gömülen betikler
_kaynak/build.py                  başlıklar, açıklamalar, JSON-LD, sitemap
```

Bir şeyi değiştirdikten sonra proje kökünde şunu çalıştırın:
`python _kaynak/build.py`. Kökteki HTML dosyaları doğrudan düzenlenirse bir sonraki üretimde değişiklik silinir.

## 3. Adres yönlendirmeleri

**Eski hash adresleri** (`index.html` içindeki betik, `location.replace` ile; `?lang=en` korunur):

| Eski | Yeni |
|---|---|
| `/#/pilot`, `/#/paketler`, `/#/senaryolar`, `/#/guvenlik`, `/#/muhakeme`, `/#/hakkimizda`, `/#/projeler` | `/pilot` … `/projeler` |
| `/#/selman-vural` | `/hakkimizda` (eski davranış korundu) |
| tanımsız `/#/...` | `/404` |
| `/#takvim` | `/pilot#takvim` |
| `/#gizli-talimat` | `/guvenlik#gizli-talimat` |
| `/#iletisim`, `/#sss`, `/#nasil-calisir` … | yerinde kalır (ana sayfa bölümleri) |

Hepsi tarayıcıda tek tek denendi.

**Cloudflare Workers:** `auto-trailing-slash` `/pilot` adresinde `pilot.html`'i kendisi sunuyor, `/pilot.html` ve `/pilot/` adreslerini de `/pilot`'a yönlendiriyor. Bu yüzden `_redirects` eklemedim. `_routes.json` yalnızca Pages Functions'ta çalışıyor, burada işe yaramıyor.

**Apache:** `.htaccess`'e uzantısız adres kuralı ve `ErrorDocument 404 /404.html` eklendi.

**Yerel test:** `http-server` (`.claude/launch.json`) `/pilot` adresini ve 404'ü aynı şekilde sunuyor.

## 4. Doğrulananlar

- 8 adres 200, bilinmeyen adres 404 döndü. Her sayfada doğru başlık, canonical ve JSON-LD var.
- Bütün sayfalardaki iç bağlantılar tarandı: kırık sayfa ya da kırık çapa yok.
- Menüde her alt sayfanın kendi bağlantısında `aria-current="page"` var ve ait olduğu grup düğmesi vurgulu.
- İçerik karşılaştırması: 9 görünümün metni, menü, alt bilgi ve stil eski dosyayla **birebir aynı**. Fark yalnızca `href` değerlerinde.
- Bölüm 5'teki iddiaların hiçbirine dokunulmadı.
- Klavye: "Ana içeriğe geç" ilk Tab'da geliyor. Açılır menü Aşağı okla açılıyor, Esc ile kapanıyor, odak düğmeye dönüyor. Mobil menü açılıyor.
- TR/EN: 9 sayfanın hepsinde denendi; başlık, açıklama, h1, menü ve sayaç çevriliyor.
- CSP: tarayıcıda betik ihlali yok.
- Sayfa araçları çalışıyor: senaryo oynatıcı, karar sayfası sekmeleri, pilot sayacı, iletişim formu.
- Tek başına açılma: `senaryolar.html` boş bir klasöre tek başına kopyalanıp diskten açıldı. Tam göründü ve betikler çalıştı.

**Doğrulanamayanlar:**
- **Çapalı adreste kaydırma:** `/guvenlik#gizli-talimat` adresinde sayfanın bölüme yumuşak kaydırması gözle görülemedi. Önizleme paneli gizli olduğu için yumuşak kaydırma orada hiç ilerlemiyor; eski sitede de aynı. Kod doğru bölümü çağırıyor ve odak başlığa gidiyor.
- **Canlı Cloudflare:** gerçek ortamda test edilmedi.

## 5. Bilerek yaptığım değişiklikler (onayınıza)

1. **CSP'ye betik özetleri eklendi.** Eski CSP (`script-src 'self'`) satır içi betikleri engelliyor; tek başına çalışan sayfa bu haliyle mümkün değil. `'unsafe-inline'` yerine her betiğin `sha256` özetini ekledim. Harici kaynak eklenmedi. Özetler `build.py` her çalıştığında yeniden hesaplanıyor; sayfa `<meta>` etiketi, `_headers` ve `.htaccess` birlikte güncelleniyor.
2. **Alt sayfalarda "Tanışalım" / "Pilot için başvurun" formu o sayfada açıyor.** Eskiden ana sayfanın iletişim bölümüne gidip açıyordu. Bu sayede `data-pick` (ör. "8 haftalık pilot" konusunu işaretleme) korunuyor. Bağlantının adresi yine `/#iletisim`; JS kapalıysa oraya gidiyor. Form Formspree'ye aynen gidiyor.
3. **Dil sayfa değişince korunuyor.** EN seçiliyken site içi bağlantılar `?lang=en` taşıyor (`/pilot?lang=en`). Bu olmasa, adresle gelen bir ziyaretçi ilk tıklamada Türkçeye düşerdi.
4. **"Sayfa: …" ekran okuyucu duyurusu kaldırıldı.** Artık her sayfa gerçekten yeniden yüklendiği için ekran okuyucu yeni başlığı kendisi okuyor.
5. **Fiyatlı `Service` ana sayfadan pilot sayfasına taşındı.** Paketler'deki `Service`'te fiyat yok.
6. **Eski `js/` klasörü kökten kaldırıldı** (kopyası `_kaynak/eski/js/` altında). Kaynak hali artık `_kaynak/js/`.

## 6. Sorulacaklar

1. **Yeni meta açıklamalar.** Sayfa metinlerinden derledim, yeni iddia eklemedim; yine de bakmanız iyi olur. Eski açıklamalara eklediğim parçalar:
   - Ana sayfa: "Veri şirkette kalır."
   - Pilot: "Sonunda net bir cevap."
   - Güvenlik: "Güvenlik tek bir ayardan oluşmaz."
   - Karar: "Modeli eğitmiyoruz; bilgi belgenizde durur."
   - Projeler: "Ortak soru: veri nasıl korunur, kim neye erişir."

   Başlıklar ve açıklamalar `build.py` içindeki `PAGES` tablosunda; İngilizceleri de orada.
2. **Cloudflare 404 ayarı.** Projede `wrangler.toml` / `wrangler.jsonc` yok, ayarı göremedim. Bilinmeyen adreslerde `404.html`'in 404 koduyla gelmesi için ayarın `not_found_handling = "404-page"` olması gerekiyor. `single-page-application` ise her bilinmeyen adres ana sayfayı açar; bu ayarı kontrol eder misiniz?
3. ~~Yayına giden dosyalar~~ — çözüldü: `.assetsignore` artık `_kaynak`, `tonara-core`, `files.zip`, `logo-alternatives`, `*.md`, `.claude` ve `.htaccess`'i yayından hariç tutuyor.
4. **JSON-LD logosu** `logo-full.svg` dosyasını gösteriyor. Sayfalar bu dosyayı yüklemiyor, yalnızca arama motoru için duruyor. Google logo için PNG'yi daha güvenilir okuyor; 512×512 bir PNG eklemek ister misiniz?
5. **Sayfa boyutu.** Her sayfa yaklaşık 175–200 KB. Bunun ~76 KB'ı her sayfaya gömülen İngilizce sözlük. İstenen "tek başına çalışma" kuralının bedeli bu. Sıkıştırmayla aktarılan boyut çok daha küçük olur.
6. **`DEGISIKLIK_OZETI.md`** hâlâ "tek dosya, hash adresleri" diye anlatıyor. O dosyaya dokunmadım.

---

# İkinci tur (2026-10-31): senaryolar, fiyat, projeler, hakkımızda, örnek ekran

Her yetenek iddiası `tonara-core` kaynak koduna (`policy.py`, `procurement.py`, `api.py`, `config/policy.yaml`) ve `docs/LIMITLER.md`, `DECISIONS.md` belgelerine karşı kontrol edildi.

## Değişen dosyalar

| Dosya (kaynak) | Ne değişti | Neden |
|---|---|---|
| `sayfalar/senaryolar.html` | 5 senaryo 7 başlığa genişledi (durum, bugün ne kadar sürüyor, yapay zeka ne yapar, nerede durur, neye dokunmaz, ne değişir, sınırı); 6 yeni senaryo; üç grup (Satın alma 6, Şirket içi bilgi 3, Güvenlik 2); varsayım notu; sonda "Bunları nasıl ölçüyoruz" | Görev 1 |
| `sayfalar/paketler.html` | Tablonun altına "Fiyatı ne belirler" (4 madde); "Paket fiyatları neden sitede yok" cevabı netleşti. Fiyat yazılmadı, pilot ücreti duruyor | Görev 2 |
| `sayfalar/projeler.html` | Kayıt tablosu (proje, alan, durum, amaç); ARBITER kartı; Control Plane kanıtına kaynak; VARUX Control ve Analytics'e "paylaşılan ölçüm yok"; SENTINEL "Fikir aşaması / Henüz geliştirilmedi". ABYSS, ATLAS, ORBIT yok | Görev 3 |
| `sayfalar/hakkimizda.html` | "VARUX nedir" kutusu (4 cümle); "Kurucumuz daha önce VARUX çatısı altında AXIS… geliştirdi"; aşama cümlesi: "Henüz ücretli müşterimiz yok; ilk pilotu yapacağımız firmayı arıyoruz." | Görev 4 |
| `sayfalar/index.html` + `js/app.js` | Satın alma kartında Onayla / Reddet çalışıyor; asistan kartında 3 hazır soru (serbest metin yok) | Görev 6 |
| `js/app.js` | Senaryo oynatıcısı grupları ve 7 adımı destekliyor ("Tümünü göster" artık adım sayısına bakıyor) | Yeni yapı |
| `ortak/stil.css` | Gruplar, fiyat kutusu, kayıt tablosu, örnek ekran durumları | |
| `js/i18n-en.js` | 164 yeni İngilizce karşılık; çevrilmeyen yalnızca özel adlar (AXIS, Rust…) | TR/EN çalışmaya devam etsin |

## Örnek ekran nasıl çalışıyor
- **Onayla:** "Sipariş taslağı hazırlandı" (sipariş *verildi* denmiyor). Özet, kayıt satırı (tarih, "Demo kullanıcı", karar, gerekçe) ve kayıt özeti görünür.
  - Kayıt özeti, tarayıcıda hesaplanan gerçek bir SHA-256. Her yeni karar bir öncekinin özetiyle zincirleniyor.
  - Özet **imzalanmıyor**; ekranda "gerçek sistemde kayıt imzalanır ve bir önceki kayda zincirlenir" yazıyor.
- **Reddet:** 3 gerekçe gelir; seçince kayıt "Reddedildi · satın almacıya iade edildi" olur. Yeni öneri üretilmez.
- **Baştan al:** kart ilk haline döner; odak Onayla düğmesine gider.
- **Erişilebilirlik:** hepsi gerçek `<button>`. Durum değişince odak taşınır ve `aria-live` ile duyurulur. Hareket azaltma açıksa animasyon yok.
- **JS kapalıyken** düğmeler `disabled` görünür.
- **Sunucu:** hiçbir istek gitmez.
- **Görünürlük:** "Örnek ekran · rakamlar kurgusal" her durumda görünüyor. Geniş ekranda hazır sorular, üstüne binen satın alma kartının altında kalmasın diye sola sıkıştırıldı; tüm düğmelerin tıklanabildiği ölçüldü.

## Senaryolardaki süre aralıkları ve dayandıkları varsayım
Hepsi bizim tahminimiz, ölçülmüş veri değil. Sayfada da böyle yazıyor.

| Senaryo | Bugün | Varsayım | "Ne değişir"deki hedef |
|---|---|---|---|
| 1 Teklif | 2-4 saat / talep | 3 tedarikçiye e-posta, cevap takibi, tabloya elle geçirme | 1-2 saatlik hazırlığı sistemin üstlenmesi |
| 2 Gecikme | 1-3 saat / hafta | Açık sipariş listesini çıkarıp tek tek kontrol, hatırlatma yazma | 15-30 dakikalık kontrol |
| 3 Bölünmüş | 15-30 dk / şüpheli sipariş | Ay sonu geriye dönük inceleme | süre yok; kontrol sipariş anına geliyor |
| 4 Mükerrer | 1-3 saat | İade, iptal, fatura düzeltme yazışması | süre yok |
| 5 Anormal ucuz | 15-45 dk / teklif | Birim, kapsam, tedarikçi doğrulama | süre yok |
| 6 Yeni tedarikçi | birkaç gün - birkaç hafta | Tedarikçi onay süreci; sistem bunu **değiştirmez** | süre yok |
| 7 Vardiya şefi | 10-30 dk | Klasörde arama; ulaşılamazsa sabahı bekleme | aramanın birkaç dakikaya inmesi |
| 8 Yeni çalışan | 5-20 dk / soru | Soran + cevaplayanın zamanı | belgeden cevaplanan soru sayısı ölçülüyor |
| 9 Çelişki | 30 dk - 4 saat | Doğru değeri bulmak için yazışma | süre yok |
| 10, 11 Güvenlik | — | Bu riskin elle yürüyen süreçte karşılığı yok | — |

Yüzde, para kazancı ya da işten çıkarma imasına yer verilmedi. "Ne değişir" cümleleri "aynı kişi tekrarlı işten kurtulur" çerçevesinde yazıldı.

## Sorular
1. **Senaryo 6 ("Aynı malzemeyi geçen sefer kimden, kaça aldık?") yazılmadı.**
   - Üründe geçmiş siparişlere soru soran bir özellik yok. Asistan yalnızca belgelerde arıyor.
   - Kalem başına son alım fiyatı (`erp_last_prices`) yalnızca karşılaştırma ve fiyat sapması kontrolünde kullanılıyor; tedarikçi adı da gösterilmiyor.
   - Bu senaryo için önce özelliğin geliştirilmesi gerekiyor. İsterseniz eklenir.
2. **Anormal ucuz teklif** brief'teki "geçmiş ortalama" ile değil, iki kontrolle çalışıyor. Sayfada ürünün yaptığı yazıldı, eşik rakamları verilmedi ("ayarlanabilir").
   - Diğer tekliflerin ortancasından belirgin biçimde ucuz olan teklif işaretlenir ve öneri olarak seçilmez (eşik %40).
   - Son alım fiyatından sapan teklif (±%15) işaretlenir ve onay kademesini bir üste çıkarır.
3. **Mükerrer kontrol** taleplerde değil siparişlerde çalışıyor; tanımı dar (aynı tedarikçi, kalem, miktar, fiyat, 7 gün). Gerçekten tekrar gereken siparişi de durduruyor; bu "Sınırı" kısmına yazıldı.
4. **Yeni tedarikçi:** üründe "talebi satın almacıya yönlendirme" diye ayrı bir akış yok. Sipariş kodla durduruluyor ve gerekçe görünüyor; sayfa böyle anlatıyor.
5. **SENTINEL:** eski metin "bir yazılım geliştirdik / İlk proje" diyordu, brief "Fikir aşaması" diyor. Brief'e uydum ("Henüz geliştirilmedi"). Doğru mu?
6. **ARBITER:** elimde yalnızca brief'teki satır vardı; kart bu yüzden çok kısa (amaç + "henüz paylaşılan test sonucu yok"). Problem, teknoloji ya da kanıt eklemek isterseniz metni gönderin.
7. **Ölçüm bölümü:** ürün doğruluğu ve kullanımı kayıtlarından çıkarıyor. "Harcanan insan saati" ise üründe otomatik ölçülmüyor; pilotta ekipten birlikte ölçülecek bir iş. Sayfa bunu söz olarak veriyor; uygun mu?
8. **Asistan örnek cevapları kurgusal:** "ön ısıtma değişimden 30 dakika önce, Rev. 2 Madde 3.1" ve "belge bulunamadı" örneği. Hepsi "rakamlar kurgusal" etiketinin altında.
9. **AXIS kanıt bağlantısı** (`docs.varuxcyber.com`) istediğiniz gibi bırakıldı. O sitedeki iki bölüm, bağlantı paylaşılmadan önce düzeltilmeli.
10. **İngilizce karşılıklar** benim çevirim; bir göz atmanız iyi olur.
