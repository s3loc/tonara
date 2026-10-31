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
