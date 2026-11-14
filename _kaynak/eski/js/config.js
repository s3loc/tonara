/* =====================================================================
   AYARLAR — siteyi yayına alırken yalnızca burayı doldurun.
   Bu dosya <head> içinde, sayfa çizilmeden önce çalışır.
   ===================================================================== */
var BRAND              = 'Tonara';  // Marka adı (sayfa içindeki yerler buradan dolar)
var EMAIL              = '';        // Örn. 'merhaba@alanadi.com.tr'  — boşsa "Doğrudan e-posta" satırı görünmez
var SITE_URL           = 'https://tonara.tech';  // Canonical/hreflang etiketleri index.html <head> içinde bu adresle yazılı
var DEMO_VIDEO         = '';        // Örn. 'demo.mp4'                — boşsa "Nasıl görünür" bölümü görünmez
var FORM_ENDPOINT      = 'https://formspree.io/f/mqppyagr';  // İletişim formunun gideceği adres
var RECAPTCHA_SITE_KEY = '';        // Google reCAPTCHA v2 (onay kutusu) site anahtarı — boşsa reCAPTCHA yüklenmez.
                                    // Doldurursanız aynı anahtarın gizli eşini Formspree panelinde de tanımlayın.
/* ===================================================================== */

document.documentElement.classList.add('js');

/* Dil: ?lang= > kullanıcının seçtiği (bu tarayıcıda saklı) > tarayıcı dili. Türkçe değilse İngilizce. */
(function () {
  var root = document.documentElement;
  function pick(v) { v = String(v || '').toLowerCase(); return v.indexOf('tr') === 0 ? 'tr' : v.indexOf('en') === 0 ? 'en' : ''; }
  var lang = '';
  var m = /[?&]lang=([a-z-]+)/i.exec(location.search);
  if (m) lang = pick(m[1]);
  if (!lang) { try { lang = pick(localStorage.getItem('tonara-lang')); } catch (e) {} }
  if (!lang) {
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || navigator.userLanguage || ''];
    for (var i = 0; i < list.length && !lang; i++) lang = pick(list[i]);
    if (!lang) lang = 'en';
  }
  window.TONARA_LANG = lang;
  root.lang = lang;
  if (lang === 'en') {
    // Türkçe metin bir an görünüp İngilizceye dönmesin; çeviri bitince (ya da en geç 2,5 sn sonra) açılır
    root.classList.add('i18n-wait');
    setTimeout(function () { root.classList.remove('i18n-wait'); }, 2500);
  }
})();

/* İngilizce sürüm (?lang=en) kendi adresini canonical gösterir; Türkçe sürüm kök adresi */
document.addEventListener('DOMContentLoaded', function () {
  var link = document.querySelector('link[rel="canonical"]');
  var base = (SITE_URL || '').trim().replace(/\/+$/, '');
  if (link && base && /[?&]lang=en/i.test(location.search)) link.setAttribute('href', base + '/?lang=en');
});
