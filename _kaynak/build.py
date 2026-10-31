"""
Tonara sitesi — sayfa üretici.

Kaynak parçalar (_kaynak/) → kök klasörde her biri tek başına çalışan 9 HTML sayfası.
Her sayfaya aynı stil, aynı betikler ve aynı logo sembolü gömülür; harici CSS/JS/font yoktur.

Kullanım (proje kökünden):   python _kaynak/build.py

Düzenleme:
  ortak/stil.css            tüm sayfaların <style> bloğu (tema token'ları burada, tek yerde)
  ortak/ust.html            atla bağlantısı, logo sembolü, üst menü
  ortak/alt.html            alt bilgi ve "başa dön" düğmesi
  ortak/iletisim-modal.html iletişim formu (her sayfada; ana sayfada iletişim bölümünün içinde)
  sayfalar/*.html           her sayfanın <main> içeriği
  js/config.js, js/i18n-en.js, js/app.js   her sayfaya gömülen betikler
  Aşağıdaki PAGES            başlık, açıklama, sayfa yolu, yapısal veri

Betikler satır içi olduğu için CSP'ye her birinin sha256 özeti yazılır. Özetler her üretimde
yeniden hesaplanır; sayfaların <meta> CSP'si, _headers ve .htaccess birlikte güncellenir.
"""
import base64, datetime, hashlib, html, json, pathlib, re, textwrap

SRC = pathlib.Path(__file__).resolve().parent
OUT = SRC.parent
SITE = 'https://tonara.tech'
LASTMOD = datetime.date.today().isoformat()

# name: (dosya, yol, başlık, açıklama, EN başlık, EN açıklama)
PAGES = {
    'home': ('index', '/',
             'Tonara | İşinizi bilen yapay zeka, kendi sunucunuzda',
             'Üretim firmalarının kendi sunucusuna yapay zeka kuruyoruz: satın alma otomasyonu ve şirket asistanı. Cevap belgenizden, kaynağıyla gelir. Veri şirkette kalır.',
             'Tonara | AI that knows your business, on your own server',
             'We install AI on manufacturers\' own servers: purchasing automation and a company assistant. Answers come from your documents, with sources. Data stays in-house.'),
    'pilot': ('pilot', '/pilot',
              '8 haftalık yapay zeka pilotu: plan, kapsam, ücret | Tonara',
              'Yapay zekayı 8 hafta boyunca tek departmanda, gerçek bir işte deneyin. Hafta hafta plan, kapsam ve ücret: 60.000 TL + KDV, tek sefer. Sonunda net bir cevap.',
              '8-week AI pilot: plan, scope, fee | Tonara',
              'Try AI for 8 weeks on real work in a single department. Week-by-week plan, scope and fee: TRY 60,000 + VAT, one-time. At the end you get a clear answer.'),
    'paketler': ('paketler', '/paketler',
                 'Paketler: Başlangıç, Profesyonel, Kurumsal | Tonara',
                 'Başlangıç, Profesyonel ve Kurumsal paketler yan yana: modül, kullanıcı, bağlanan sistem, tahmini kurulum ve destek süresi. Hepsi kendi sunucunuzda çalışır.',
                 'Packages: Starter, Professional, Enterprise | Tonara',
                 'Starter, Professional and Enterprise side by side: module, users, connected systems, estimated setup time and support response. All run on your own server.'),
    'senaryolar': ('senaryolar', '/senaryolar',
                   'Senaryolar: yapay zeka günlük işte ne yapar | Tonara',
                   'Günlük işte neye benzer: beş kurgusal örnek. Her örnekte durum ne, yapay zeka ne yapar, nerede durur, kim onaylar ve neye dokunmaz sorularını cevaplıyoruz.',
                   'Scenarios: what AI does in daily work | Tonara',
                   'What it looks like in daily work: five fictional examples. Each answers the same questions: the situation, what the AI does, where it stops, who approves.'),
    'guvenlik': ('guvenlik', '/guvenlik',
                 'Güvenliği nasıl sağlıyoruz: katmanlar ve sınırlar | Tonara',
                 'Yedi güvenlik katmanı, yapay zekaya özgü riskler, belgeye gizlenmiş talimatla ilgili ölçümlerimiz ve henüz yapmadıklarımız. Güvenlik tek bir ayardan oluşmaz.',
                 'How we keep it secure: layers and limits | Tonara',
                 'Seven security layers, AI-specific risks, what we measured about instructions hidden in documents, and what we have not done yet. Security is not one setting.'),
    'muhakeme': ('muhakeme', '/muhakeme',
                 'Sistem nasıl karar verir: öneri, kural, onay | Tonara',
                 'Bir soru ve bir sipariş önerisi sistemde hangi adımlardan geçer: model öneri üretir, kod karar verir, insan onaylar. Modeli eğitmiyoruz; bilgi belgenizde durur.',
                 'How the system decides: suggestion, rule, approval | Tonara',
                 'The steps a question and a purchase suggestion go through: the model suggests, code decides, a person approves. We do not train the model; knowledge stays in your documents.'),
    'hakkimizda': ('hakkimizda', '/hakkimizda',
                   'Hakkımızda: verisini fabrikada tutan yapay zeka | Tonara',
                   'Kimiz, nereden geliyoruz, sizinle nasıl çalışıyoruz, şu an hangi aşamadayız: Tonara, üretim firmalarının kendi sunucusuna yapay zeka kuran yeni bir girişim.',
                   'About us: AI that keeps factory data in the factory | Tonara',
                   'Who we are, where we come from, how we work and where we stand today: Tonara is a new venture installing AI on manufacturers\' own servers.'),
    'projeler': ('projeler', '/projeler',
                 'Projeler: AXIS, VARUX ve SENTINEL | Tonara',
                 'AXIS, AXIS Control Plane, VARUX Control, VARUX Analytics ve SENTINEL: problem, yapılan iş, teknoloji ve kanıt. Ortak soru: veri nasıl korunur, kim neye erişir.',
                 'Projects: AXIS, VARUX and SENTINEL | Tonara',
                 'AXIS, AXIS Control Plane, VARUX Control, VARUX Analytics and SENTINEL: problem, work done, technology and evidence. Shared question: how is data protected?'),
    'ad': ('404', None,
           'Sayfa bulunamadı | Tonara',
           'Aradığınız sayfa bulunamadı.',
           'Page not found | Tonara',
           'The page you\'re looking for couldn\'t be found.'),
}

ORG_ID = SITE + '/#organization'


def read(p):
    return (SRC / p).read_text(encoding='utf-8')


def url(path):
    return SITE + path


def text(fragment):
    """HTML parçasından düz metin (etiketsiz, tek boşluklu)."""
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', fragment))).strip().replace(' .', '.').replace(' ,', ',')


def faq(body):
    items = []
    for d in re.findall(r'<details>(.*?)</details>', body, re.S):
        q = re.search(r'<summary>(.*?)</summary>', d, re.S)
        items.append({'@type': 'Question', 'name': text(q.group(1)),
                      'acceptedAnswer': {'@type': 'Answer', 'text': text(d[q.end():])}})
    return {'@type': 'FAQPage', 'mainEntity': items} if items else None


def breadcrumb(name, body):
    crumb = re.search(r'<nav class="crumb[^"]*"[^>]*>.*?<ol>(.*?)</ol>', body, re.S).group(1)
    # Sayfada görünen yolun aynısı: bağlantılı adımlar kendi adresiyle, son adım bu sayfanın adresiyle
    items = []
    for i, li in enumerate(re.findall(r'<li[^>]*>(.*?)</li>', crumb, re.S)):
        href = re.search(r'href="([^"]+)"', li)
        items.append({'@type': 'ListItem', 'position': i + 1, 'name': text(li),
                      'item': url(href.group(1)) if href else url(PAGES[name][1])})
    assert items[0]['name'] == 'Ana sayfa' and 'href' not in crumb.rsplit('<li', 1)[1], items
    return {'@type': 'BreadcrumbList', 'itemListElement': items}


def jsonld(name, body):
    g = []
    if name == 'home':
        g.append({'@type': 'Organization', '@id': ORG_ID, 'name': 'Tonara', 'url': url('/'),
                  'logo': url('/logo-full.svg'),
                  'description': 'Üretim yapan firmaların kendi sunucusuna yapay zeka kurar: satın alma otomasyonu ve şirket içi asistan.',
                  'address': {'@type': 'PostalAddress', 'addressCountry': 'TR'},
                  'areaServed': {'@type': 'Country', 'name': 'Türkiye'},
                  'knowsLanguage': ['tr', 'en']})
        g.append({'@type': 'WebSite', '@id': SITE + '/#website', 'url': url('/'), 'name': 'Tonara',
                  'inLanguage': ['tr', 'en'], 'publisher': {'@id': ORG_ID}})
    elif name != 'ad':
        g.append(breadcrumb(name, body))
    if name == 'pilot':
        # Pilot ücreti sayfada yazılı olduğu için yapısal veride de var
        g.append({'@type': 'Service', 'name': '8 haftalık yapay zeka pilotu',
                  'serviceType': 'Şirket içi (on-premise) yapay zeka kurulumu',
                  'provider': {'@type': 'Organization', '@id': ORG_ID, 'name': 'Tonara', 'url': url('/')},
                  'areaServed': {'@type': 'Country', 'name': 'Türkiye'}, 'url': url('/pilot'),
                  'offers': {'@type': 'Offer', 'price': '60000', 'priceCurrency': 'TRY',
                             'description': 'KDV hariç, tek sefer. Aylık ücret yok.'}})
    if name == 'paketler':
        # Paket fiyatı sitede bilerek yok; yapısal veride de yok
        g.append({'@type': 'Service', 'name': 'Tonara paketleri: Başlangıç, Profesyonel, Kurumsal',
                  'serviceType': 'Şirket içi (on-premise) yapay zeka kurulumu ve desteği',
                  'provider': {'@type': 'Organization', '@id': ORG_ID, 'name': 'Tonara', 'url': url('/')},
                  'areaServed': {'@type': 'Country', 'name': 'Türkiye'}, 'url': url('/paketler')})
    if name in ('home', 'pilot', 'paketler'):
        f = faq(body)
        assert f, name + ': SSS bulunamadı'
        g.append(f)
    if not g:
        return ''
    data = json.dumps({'@context': 'https://schema.org', '@graph': g}, ensure_ascii=False, indent=1)
    return '<script type="application/ld+json">\n' + data.replace('</', '<\\/') + '\n</script>\n'


def sha(js):
    return "'sha256-" + base64.b64encode(hashlib.sha256(js.encode('utf-8')).digest()).decode() + "'"


CSP_TAIL_META = ("style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.gstatic.com/recaptcha/; font-src 'self'; "
                 "connect-src 'self' https://formspree.io; frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; "
                 "media-src 'self'; object-src 'none'; base-uri 'self'; form-action https://formspree.io")
CSP_HEADER_EXTRA = "; frame-ancestors 'none'; upgrade-insecure-requests"


def csp(hashes):
    return ("default-src 'self'; script-src 'self' " + ' '.join(hashes) +
            " https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; " + CSP_TAIL_META)


def main():
    style = read('ortak/stil.css')
    top = read('ortak/ust.html')
    foot = read('ortak/alt.html')
    modal = read('ortak/iletisim-modal.html').rstrip('\n')
    moved = json.loads(read('ortak/tasinan-capalar.json'))

    # Betikler: her sayfada birebir aynı (CSP özeti tek)
    js_config = read('js/config.js').replace('{}/*@TASINAN_CAPALAR@*/', json.dumps(moved, ensure_ascii=False))
    assert '@TASINAN' not in js_config
    meta_en = {}
    for p in PAGES.values():
        meta_en[p[2]] = p[4]
        meta_en[p[3]] = p[5]
    dict_src = read('js/i18n-en.js').rstrip().rstrip(';').rstrip()
    assert dict_src.endswith('}')
    js_dict = (dict_src[:-1].rstrip() + ',\n\n  /* --- Sayfa başlıkları ve açıklamaları (build.py PAGES) --- */\n' +
               ',\n'.join('  ' + json.dumps(k, ensure_ascii=False) + ': ' + json.dumps(v, ensure_ascii=False) for k, v in meta_en.items()) +
               '\n};\n')
    js_app = read('js/app.js')
    scripts = ['\n' + js_config.strip() + '\n', '\n' + js_dict.strip() + '\n', '\n' + js_app.strip() + '\n']
    for s in scripts:
        assert '</script' not in s.lower()
    hashes = [sha(s) for s in scripts]
    policy = csp(hashes)

    for name, (fname, path, title, desc, *_rest) in PAGES.items():
        assert len(title) <= 60, (name, len(title))
        if name != 'ad':
            assert 150 <= len(desc) <= 160, (name, len(desc))
        body = read('sayfalar/' + fname + '.html').rstrip('\n')
        if name == 'home':
            body = body.replace('      <!--@MODAL-->', modal)
            assert modal in body
        else:
            body += '\n\n' + textwrap.dedent(modal)

        header = top.replace('{{LOGO_HREF}}', '#top' if name == 'home' else '/')
        header = re.sub(r' data-nav="([a-z]+)"', lambda m: ' aria-current="page"' if m.group(1) == name else '', header)

        canonical = url(path) if path else None
        head = ['<!doctype html>', '<html lang="tr" data-page="%s">' % name, '<head>',
                '<meta charset="utf-8">',
                '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
                '<!-- Güvenlik: sayfa yalnızca kendi içindeki betikleri (sha256 özetiyle), Formspree\'yi ve (açılırsa) Google reCAPTCHA\'yı kullanabilir.',
                '     frame-ancestors gibi bazı kurallar <meta> ile çalışmaz; onlar _headers / .htaccess dosyalarında.',
                '     Bu dosya _kaynak/build.py ile üretilir; düzenlemeyi _kaynak/ altında yapıp betiği yeniden çalıştırın. -->',
                '<meta http-equiv="Content-Security-Policy" content="%s">' % policy,
                '<meta name="referrer" content="strict-origin-when-cross-origin">',
                '<meta name="format-detection" content="telephone=no">',
                '<meta name="color-scheme" content="light">',
                '',
                '<script>' + scripts[0] + '</script>',
                '',
                '<title>%s</title>' % html.escape(title, quote=False),
                '<meta name="description" content="%s">' % html.escape(desc),
                '<meta name="robots" content="%s">' % ('index, follow, max-image-preview:large' if canonical else 'noindex, follow'),
                '<meta name="author" content="Tonara">',
                '<meta name="theme-color" content="#FAF8F5">']
        if canonical:
            head += ['',
                     '<link rel="canonical" href="%s">' % canonical,
                     '<link rel="alternate" hreflang="tr" href="%s">' % canonical,
                     '<link rel="alternate" hreflang="en" href="%s?lang=en">' % canonical,
                     '<link rel="alternate" hreflang="x-default" href="%s">' % canonical,
                     '',
                     '<meta property="og:type" content="website">',
                     '<meta property="og:locale" content="tr_TR">',
                     '<meta property="og:locale:alternate" content="en_US">',
                     '<meta property="og:site_name" content="Tonara">',
                     '<meta property="og:title" content="%s">' % html.escape(title),
                     '<meta property="og:description" content="%s">' % html.escape(desc),
                     '<meta property="og:url" content="%s">' % canonical,
                     '<meta property="og:image" content="%s/og-image.png">' % SITE,
                     '<meta property="og:image:width" content="1200">',
                     '<meta property="og:image:height" content="630">',
                     '<meta property="og:image:alt" content="Tonara: İşinizi bilen yapay zeka, kendi sunucunuzda">',
                     '<meta name="twitter:card" content="summary_large_image">',
                     '<meta name="twitter:title" content="%s">' % html.escape(title),
                     '<meta name="twitter:description" content="%s">' % html.escape(desc),
                     '<meta name="twitter:image" content="%s/og-image.png">' % SITE]
        head += ['',
                 '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
                 '<link rel="manifest" href="/site.webmanifest">',
                 '']
        ld = jsonld(name, body)
        page = ('\n'.join(head) + '\n' + ld + '\n<style>\n' + style + '</style>\n</head>\n\n<body>\n' +
                header + '\n<main id="icerik">\n\n' +
                '<div class="view is-active" data-view="%s">\n' % name + body + '\n</div>\n\n</main>\n\n' +
                foot + '\n' +
                '<script>' + scripts[1] + '</script>\n' +
                '<script>' + scripts[2] + '</script>\n' +
                '</body>\n</html>\n')
        assert not re.search(r'<(script|link)[^>]+(src|href)="(?!/favicon|/site\.web|https://tonara\.tech)[^"#][^"]*\.(js|css)', page)
        (OUT / (fname + '.html')).write_text(page, encoding='utf-8', newline='\n')

    # Sunucu başlıkları: aynı politika + yalnızca HTTP başlığında çalışan kurallar
    header_policy = policy + CSP_HEADER_EXTRA
    hdr = (OUT / '_headers').read_text(encoding='utf-8')
    hdr = re.sub(r'(  Content-Security-Policy: ).*', lambda m: m.group(1) + header_policy, hdr)
    (OUT / '_headers').write_text(hdr, encoding='utf-8', newline='\n')
    ht = (OUT / '.htaccess').read_text(encoding='utf-8')
    ht = re.sub(r'(Header always set Content-Security-Policy ")[^"]*(")', lambda m: m.group(1) + header_policy + m.group(2), ht)
    (OUT / '.htaccess').write_text(ht, encoding='utf-8', newline='\n')

    # sitemap.xml
    rows = []
    for name, (fname, path, *_r) in PAGES.items():
        if not path:
            continue
        u = url(path)
        rows.append('  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n'
                    '    <xhtml:link rel="alternate" hreflang="tr" href="%s"/>\n'
                    '    <xhtml:link rel="alternate" hreflang="en" href="%s?lang=en"/>\n'
                    '    <xhtml:link rel="alternate" hreflang="x-default" href="%s"/>\n  </url>' % (u, LASTMOD, u, u, u))
    (OUT / 'sitemap.xml').write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
        'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + '\n'.join(rows) + '\n</urlset>\n', encoding='utf-8', newline='\n')
    print('Üretildi:', ', '.join(p[0] + '.html' for p in PAGES.values()))
    print('CSP betik özetleri:', ' '.join(hashes))


if __name__ == '__main__':
    main()
