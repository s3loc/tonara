# tonara

[tonara.tech](https://tonara.tech) sitesi. Cloudflare Workers'ta statik dosya olarak yayında.

## Sayfalar

Her sayfa ayrı bir dosya ve tek başına çalışıyor: stil, betikler ve logo dosyanın içine gömülü. Harici CSS, JS ya da font yok.

| Dosya | Adres |
|---|---|
| `index.html` | `/` |
| `pilot.html` | `/pilot` |
| `paketler.html` | `/paketler` |
| `senaryolar.html` | `/senaryolar` |
| `guvenlik.html` | `/guvenlik` |
| `muhakeme.html` | `/muhakeme` |
| `hakkimizda.html` | `/hakkimizda` |
| `projeler.html` | `/projeler` |
| `404.html` | bilinmeyen adresler |

Eski tek sayfa adresleri (`/#/pilot` vb.) ana sayfadaki betik tarafından yeni adreslere yönlendirilir.

## Düzenleme

Kökteki HTML dosyaları **üretilir**, elle düzenlenmez. Değişikliği `_kaynak/` altında yapıp betiği çalıştırın:

```bash
python _kaynak/build.py
```

| Kaynak | İçerik |
|---|---|
| `_kaynak/ortak/stil.css` | tüm sayfaların stili ve tema token'ları |
| `_kaynak/ortak/ust.html`, `alt.html` | menü, alt bilgi |
| `_kaynak/ortak/iletisim-modal.html` | iletişim formu (Formspree) |
| `_kaynak/sayfalar/*.html` | her sayfanın içeriği |
| `_kaynak/js/config.js` | ayarlar (marka, e-posta, form adresi …) |
| `_kaynak/js/i18n-en.js` | İngilizce sözlük |
| `_kaynak/js/app.js` | menü, dil, form, animasyonlar |
| `_kaynak/build.py` | başlıklar, açıklamalar, JSON-LD, sitemap |

Betik her çalıştığında satır içi betiklerin `sha256` özetlerini yeniden hesaplar; sayfaların CSP'si, `_headers` ve `.htaccess` birlikte güncellenir. Betikleri elle değiştirip build çalıştırmazsanız tarayıcı onları engeller.

Ayrıntılı geçiş raporu: [`_kaynak/RAPOR.md`](_kaynak/RAPOR.md).

## Yayın

- Cloudflare `HTML handling: auto-trailing-slash` ile `/pilot` adresinde `pilot.html` sunulur.
- Bilinmeyen adreslerin `404.html` ile 404 dönmesi için `not_found_handling` ayarı `404-page` olmalı.
- `.assetsignore`: `_kaynak/`, `logo-alternatives/`, `*.md` gibi site dışı dosyalar yayına girmez.
- `_headers`: güvenlik başlıkları (CSP, HSTS …). `.htaccess` aynı ayarların Apache karşılığı.
