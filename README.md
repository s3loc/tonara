# Tonara

[tonara.tech](https://tonara.tech) için statik web sitesi.

## Yapı

- `public/`: Cloudflare Pages tarafından yayımlanan güncel site
- Kökteki HTML, CSS ve JavaScript dosyaları: doğrudan statik yayınla uyumlu kopya
- `public/en/`: İngilizce sayfalar
- `public/_redirects`: temiz adresler ve eski adreslerin yönlendirmeleri
- `public/_headers`: güvenlik ve önbellek başlıkları

## Cloudflare Pages

- Framework preset: `None`
- Build command: boş
- Build output directory: `public`

Yerel önizleme için `public` klasörünü herhangi bir statik dosya sunucusuyla açın.
