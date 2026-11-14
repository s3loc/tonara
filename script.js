(function () {
  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var seen = false;
  try { seen = sessionStorage.getItem('tonara-intro') === '1'; } catch (e) {}

  // Giriş ekranı: oturumda yalnızca ilk açılışta gösterilir. Sınıflar <head> içinde,
  // sayfa çizilmeden önce eklenir; betik yüklenemezse içerik olduğu gibi görünür.
  var intro = !seen && !reduce;
  var started = Date.now();
  root.classList.add('js');
  if (intro) root.classList.add('intro');

  function ready() {
    if (root.classList.contains('is-ready')) return;
    root.classList.add('is-ready');
    if (intro) {
      try { sessionStorage.setItem('tonara-intro', '1'); } catch (e) {}
      setTimeout(function () { root.classList.remove('intro'); }, 1500);
    }
  }
  if (intro) {
    window.addEventListener('load', function () {
      setTimeout(ready, Math.max(0, 1800 - (Date.now() - started)));
    });
    setTimeout(ready, 5000); // yavaş bağlantıda ekranda takılı kalmasın
  }

  function init() {
    if (!intro) {
      requestAnimationFrame(function () { requestAnimationFrame(ready); });
      setTimeout(ready, 500);
    }

    // Menü
    var button = document.querySelector('.menu-button');
    var nav = document.querySelector('.site-nav');
    function setMenu(open) {
      nav.setAttribute('data-open', String(open));
      button.setAttribute('aria-expanded', String(open));
    }
    if (button && nav) {
      button.addEventListener('click', function () { setMenu(nav.getAttribute('data-open') !== 'true'); });
      document.addEventListener('keydown', function (event) { if (event.key === 'Escape') setMenu(false); });
      document.addEventListener('click', function (event) {
        if (!nav.contains(event.target) && !button.contains(event.target)) setMenu(false);
      });
    }

    // Kaydırınca üst menü gölgesi
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 12); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();

    // Dil değiştirici
    if (nav) {
      var english = root.lang.indexOf('en') === 0;
      var file = location.pathname.split('/').pop() || 'index.html';
      var toEnglish = { 'index.html': 'index.html', 'hizmetler.html': 'services.html', 'fiyatlar.html': 'pricing.html', 'yaklasim.html': 'approach.html', 'hakkinda.html': 'about.html', 'iletisim.html': 'contact.html' };
      var toTurkish = { 'index.html': 'index.html', 'services.html': 'hizmetler.html', 'pricing.html': 'fiyatlar.html', 'approach.html': 'yaklasim.html', 'about.html': 'hakkinda.html', 'contact.html': 'iletisim.html' };
      var language = document.createElement('a');
      language.className = 'lang-switch';
      language.href = english ? '../' + (toTurkish[file] || 'index.html') : 'en/' + (toEnglish[file] || 'index.html');
      language.lang = english ? 'tr' : 'en';
      language.hreflang = english ? 'tr' : 'en';
      language.textContent = english ? 'TR' : 'EN';
      language.setAttribute('aria-label', english ? 'Türkçe sürüm' : 'English version');
      nav.insertBefore(language, nav.querySelector('.nav-cta') || null);
    }

    // Kayan bant: kesintisiz döngü için içeriği iki kez yaz
    var track = document.querySelector('.marquee-track');
    if (track && !reduce) {
      Array.prototype.slice.call(track.children).forEach(function (item) {
        track.appendChild(item.cloneNode(true));
      });
    }

    // Kaydırınca belirme
    if (reduce || !('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll('.stat, .section-head, .service-card, .step, .cta-panel, .service-title, .detail-block, .service-note, .inline-cta, .pricing-feature, .price-list, .price-note, .faq details, .principle, .process-row, .founder-mark, .prose > *, .contact-info, .form');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        observer.unobserve(el);
        el.classList.add('in');
        // Geçiş bitince sınıfları kaldır ki kartların kendi hover geçişleri çalışsın
        setTimeout(function () { el.classList.remove('reveal', 'in'); el.style.removeProperty('--d'); }, 1300);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    Array.prototype.forEach.call(targets, function (el) {
      var order = 0, sibling = el;
      while ((sibling = sibling.previousElementSibling)) order++;
      el.style.setProperty('--d', Math.min(order, 5) * 0.07 + 's');
      el.classList.add('reveal');
      observer.observe(el);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
