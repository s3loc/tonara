(function () {
  'use strict';

  var root = document.documentElement;
  var PAGE = root.getAttribute('data-page') || 'home';   // her sayfanın <html data-page="..."> değeri
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function each(list, fn) { for (var i = 0; i < list.length; i++) fn(list[i], i); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return (ctx || document).querySelectorAll(sel); }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  var EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

  /* ------------------------------------------------------------------
     DİL (TR / EN) — sayfa Türkçe yazılır. İngilizce seçilince her metin
     parçası sayfaya gömülü İngilizce sözlükten (_kaynak/js/i18n-en.js) karşılığıyla değiştirilir, Türkçe
     seçilince aslına döner. Yalnızca textContent / setAttribute kullanılır
     (innerHTML yok), sözlükten HTML enjekte edilemez.
     ------------------------------------------------------------------ */
  var I18N = (function () {
    var dict = window.TONARA_EN || {};
    var lang = window.TONARA_LANG === 'en' ? 'en' : 'tr';
    var ATTRS = ['aria-label', 'placeholder', 'title', 'alt', 'data-l'];
    var texts = [], attrs = [], seen = new WeakSet(), listeners = [];
    function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
    function lookup(s) { var k = norm(s); return k && has(dict, k) ? dict[k] : null; }
    function T(s) {
      if (lang !== 'en') return s;
      var v = lookup(s);
      return v === null ? s : v;
    }
    function swap(orig) {
      if (lang !== 'en') return orig;
      var v = lookup(orig);
      if (v === null) return orig;
      return orig.match(/^\s*/)[0] + v + orig.match(/\s*$/)[0];
    }
    function skip(el) { return !!(el && el.closest && el.closest('script, style, [data-i18n-skip]')); }
    // Çeviri kaydı: o anki (Türkçe) metni asıl kabul eder. Sonradan eklenen öğeler için tekrar çağrılabilir.
    function scan(scope) {
      scope = scope || document.body;
      var w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
      for (var n = w.nextNode(); n; n = w.nextNode()) {
        if (seen.has(n) || !norm(n.nodeValue) || skip(n.parentNode)) continue;
        seen.add(n);
        texts.push({ n: n, tr: n.nodeValue });
      }
      each(scope.querySelectorAll('[' + ATTRS.join('],[') + ']'), function (el) {
        if (seen.has(el) || skip(el)) return;
        seen.add(el);
        each(ATTRS, function (a) { if (el.hasAttribute(a)) attrs.push({ el: el, a: a, tr: el.getAttribute(a) }); });
      });
    }
    function apply() {
      each(texts, function (o) { var v = swap(o.tr); if (o.n.nodeValue !== v) o.n.nodeValue = v; });
      each(attrs, function (o) { var v = swap(o.tr); if (o.el.getAttribute(o.a) !== v) o.el.setAttribute(o.a, v); });
      root.lang = lang;
      each(listeners, function (fn) { fn(lang); });
    }
    function set(next, remember) {
      lang = next === 'en' ? 'en' : 'tr';
      if (remember) { try { localStorage.setItem('tonara-lang', lang); } catch (e) {} }
      apply();
    }
    return { T: T, scan: scan, apply: apply, set: set, onChange: function (fn) { listeners.push(fn); }, lang: function () { return lang; } };
  })();
  var T = I18N.T;

  /* ------------------------------------------------------------------
     AYARLARDAN DOLAN YERLER: marka, e-posta, yıl, demo videosu
     ------------------------------------------------------------------ */
  var brand = (BRAND || '').trim() || 'Tonara';
  each($$('[data-brand-slot]'), function (el) { el.textContent = brand; });

  var email = (EMAIL || '').trim();
  var emailValid = EMAIL_RE.test(email);
  if (emailValid) {
    each($$('[data-email-slot]'), function (el) { el.textContent = email; });
    each($$('[data-email-link]'), function (el) { el.setAttribute('href', 'mailto:' + email); });
    each($$('[data-email-row]'), function (el) { el.hidden = false; });
  }

  var yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var demoVideo = (DEMO_VIDEO || '').trim();
  var demo = $('[data-demo]');
  // Yalnızca aynı sitedeki göreli bir dosya adı kabul edilir (javascript:, data: vb. değil)
  if (demo && demoVideo && /^[\w./-]+$/.test(demoVideo) && demoVideo.indexOf('//') === -1) {
    var vid = document.createElement('video');
    vid.controls = true;
    vid.setAttribute('playsinline', '');
    vid.preload = 'metadata';
    vid.src = demoVideo;
    vid.style.width = '100%';
    vid.style.borderRadius = '12px';
    vid.setAttribute('aria-describedby', 'demo-cap');
    vid.textContent = 'Tarayıcınız video oynatmayı desteklemiyor.';
    $('[data-video-slot]', demo).appendChild(vid);
    demo.hidden = false;
  }


  /* ------------------------------------------------------------------
     HERO ÖRNEK EKRANI — bir kez oynar. Hareket azaltmada her şey baştan görünür.
     ------------------------------------------------------------------ */
  var stage = $('[data-stage]');
  var typed = stage && $('[data-typed]', stage);
  if (stage && typed && !reduceMotion) {
    var typedSrc = typed.textContent;                         // Türkçe asıl; dil o an neyse ona çevrilir
    var ghost = document.createElement('span');
    var live = document.createElement('span');
    var typeTimer = null;
    ghost.className = 'ghost'; ghost.textContent = typedSrc;  // yer tutar, düzen kaymaz
    live.className = 'live';
    typed.textContent = '';
    typed.appendChild(ghost); typed.appendChild(live);
    typed.setAttribute('data-i18n-skip', '');
    stage.classList.add('anim');
    var steps = $$('[data-step]', stage);
    var at = [150, 550, 1900, 2150];
    each(steps, function (el, i) { setTimeout(function () { el.classList.add('on'); }, at[i] || 2000); });
    setTimeout(function () {
      var full = T(typedSrc), n = 0;
      ghost.textContent = full;
      typeTimer = setInterval(function () {
        n += 2;
        live.textContent = full.slice(0, n);
        if (n >= full.length) { clearInterval(typeTimer); typeTimer = null; }
      }, 16);
    }, 900);
    // Dil değişince yazma animasyonu bitmiş haliyle yeni dile geçer
    I18N.onChange(function () {
      if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
      ghost.textContent = T(typedSrc);
      if (live.textContent) live.textContent = T(typedSrc);
    });
  }

  /* ------------------------------------------------------------------
     SENARYO OYNATICI — senaryo seçilir, adımlar tek tek açılır.
     JS kapalıyken tüm senaryolar ve adımlar düz liste olarak görünür.
     ------------------------------------------------------------------ */
  var player = $('[data-player]');
  if (player) {
    var scItems = $$('.sc-item', player);
    var scCur = 0, scStep = 0;
    var scPick = document.createElement('div');
    scPick.className = 'sc-pick';
    scPick.setAttribute('role', 'group');
    scPick.setAttribute('aria-label', 'Senaryo seçin');
    var scCtl = document.createElement('div');
    scCtl.className = 'sc-ctl';
    scCtl.innerHTML = '<button class="btn btn-primary btn-sm" type="button" data-sc-next>Sonraki adım</button>' +
      '<button class="btn btn-ghost btn-sm" type="button" data-sc-all>Tümünü göster</button>' +
      '<button class="btn btn-ghost btn-sm" type="button" data-sc-reset>Baştan</button>' +
      '<span class="sc-count" aria-live="polite" data-i18n-skip></span>';
    var scNext = $('[data-sc-next]', scCtl);
    var scCount = $('.sc-count', scCtl);

    var scRender = function () {
      each(scItems, function (it, a) {
        it.classList.toggle('on', a === scCur);
        scPick.children[a].setAttribute('aria-pressed', a === scCur ? 'true' : 'false');
      });
      var lis = $$('.sc-steps li', scItems[scCur]);
      each(lis, function (li, b) {
        li.classList.toggle('off', b > scStep);
        li.classList.toggle('now', b === scStep);
      });
      scNext.disabled = scStep >= lis.length - 1;
      scCount.textContent = T('Adım') + ' ' + (scStep + 1) + ' / ' + lis.length + ': ' + $('.sc-k', lis[scStep]).textContent;
      scItems[scCur].appendChild(scCtl);
    };

    each(scItems, function (it, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      var num = document.createElement('b');
      num.setAttribute('aria-hidden', 'true');
      num.textContent = String(i + 1);
      btn.appendChild(num);
      btn.appendChild(document.createTextNode($('h3', it).textContent.replace(/^\s*\d+/, '')));
      btn.addEventListener('click', function () { scCur = i; scStep = 0; scRender(); });
      scPick.appendChild(btn);
    });
    player.insertBefore(scPick, player.firstChild);
    player.classList.add('is-player');
    scNext.addEventListener('click', function () {
      scStep++; scRender();
      if (scNext.disabled) $('[data-sc-reset]', scCtl).focus();
    });
    $('[data-sc-all]', scCtl).addEventListener('click', function () { scStep = 3; scRender(); });
    $('[data-sc-reset]', scCtl).addEventListener('click', function () { scStep = 0; scRender(); scNext.focus(); });
    scRender();
    I18N.onChange(scRender);
  }

  /* ------------------------------------------------------------------
     SEKMELER (karar sayfası) — ok tuşları, Home/End. JS kapalıyken iki yol alt alta.
     ------------------------------------------------------------------ */
  each($$('[data-tabs]'), function (box) {
    var list = $('[role="tablist"]', box);
    var tabs = $$('[role="tab"]', list);
    function select(i, focus) {
      each(tabs, function (t, k) {
        var on = k === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tabs[i].focus();
    }
    each(tabs, function (t, i) {
      t.addEventListener('click', function () { select(i, false); });
      t.addEventListener('keydown', function (e) {
        var n = tabs.length, to = null;
        if (e.key === 'ArrowRight') to = (i + 1) % n;
        else if (e.key === 'ArrowLeft') to = (i - 1 + n) % n;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = n - 1;
        if (to !== null) { e.preventDefault(); select(to, true); }
      });
    });
    each($$('.html-nojs-label', box), function (el) { el.remove(); });
    list.hidden = false;
    select(0, false);
  });

  /* ------------------------------------------------------------------
     AÇILIR MENÜLER — düğmeyle açılır; Esc, dışarı tıklama ve odak dışarı çıkınca kapanır
     ------------------------------------------------------------------ */
  var dds = $$('.dd');
  function closeDropdowns(focusBtn) {
    each(dds, function (dd) {
      if (!dd.classList.contains('open')) return;
      dd.classList.remove('open');
      var b = $('.dd-btn', dd);
      b.setAttribute('aria-expanded', 'false');
      if (focusBtn) b.focus();
    });
  }
  function anyDropdownOpen() { return !!$('.dd.open'); }

  each(dds, function (dd) {
    var btn = $('.dd-btn', dd);
    btn.addEventListener('click', function () {
      var willOpen = !dd.classList.contains('open');
      closeDropdowns(false);
      dd.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!dd.classList.contains('open')) btn.click();
        var first = $('.dd-panel a', dd);
        if (first) first.focus();
      }
    });
    // Tab ile menünün dışına çıkılınca kapan
    dd.addEventListener('focusout', function () {
      setTimeout(function () {
        var a = document.activeElement;
        if (dd.classList.contains('open') && a && a !== document.body && !dd.contains(a)) {
          dd.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        }
      }, 0);
    });
  });
  document.addEventListener('click', function (e) {
    if (anyDropdownOpen() && !(e.target.closest && e.target.closest('.dd'))) closeDropdowns(false);
  });

  /* ------------------------------------------------------------------
     MOBİL MENÜ
     ------------------------------------------------------------------ */
  var menuBtn = $('.menu-btn');
  var menu = document.getElementById('menu');
  function closeMenu() {
    closeDropdowns(false);
    menu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) closeDropdowns(false);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (modal && modal.open) return;   // modalı tarayıcı kendisi kapatır
    if (anyDropdownOpen()) { closeDropdowns(true); return; }
    if (menu.classList.contains('open')) { closeMenu(); menuBtn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
  });

  /* ------------------------------------------------------------------
     İLETİŞİM — "İletişime Geçin" düğmesi formu modal pencerede açar.
     Gönderim Formspree'ye gider. Spam önlemleri:
       1. Bal küpü (_gotcha): doluysa gönderilmez, Formspree de reddeder.
       2. Süre: modal açıldıktan sonra 3 saniyeden kısa sürede gönderilemez.
       3. Sıklık: aynı tarayıcıdan 60 saniyede bir gönderim.
       4. İçerik: uzunluk sınırı, çok sayıda bağlantı içeren mesaj reddedilir.
       5. reCAPTCHA v2: config.js'de RECAPTCHA_SITE_KEY doluysa zorunlu olur.
     Formspree ayrıca kendi sunucu tarafı spam filtresini uygular.
     ------------------------------------------------------------------ */
  var modal = document.getElementById('contact-modal');
  var form = document.getElementById('contact-form');
  var endpoint = (typeof FORM_ENDPOINT === 'string' && /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(FORM_ENDPOINT)) ? FORM_ENDPOINT : '';
  var siteKey = (typeof RECAPTCHA_SITE_KEY === 'string' ? RECAPTCHA_SITE_KEY : '').trim();
  var openedAt = 0, lastOpener = null, captchaId = null, captchaLoading = false;
  var MIN_FILL_MS = 3000, RATE_MS = 60000, RATE_KEY = 'tonara-form-last';

  function lockScroll(on) { root.classList.toggle('modal-open', on); }

  function loadCaptcha() {
    if (!siteKey || captchaId !== null || captchaLoading) return;
    var slot = $('[data-recaptcha]', form);
    captchaLoading = true;
    window.tonaraCaptchaReady = function () {
      captchaId = window.grecaptcha.render(slot, { sitekey: siteKey });
    };
    var s = document.createElement('script');
    s.src = 'https://www.google.com/recaptcha/api.js?onload=tonaraCaptchaReady&render=explicit&hl=' + I18N.lang();
    s.async = true; s.defer = true;
    s.onerror = function () { captchaLoading = false; };
    document.head.appendChild(s);
  }

  function openModal(opener) {
    if (!modal) return;
    lastOpener = opener || document.activeElement;
    if (!modal.open) {
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
    }
    lockScroll(true);
    openedAt = Date.now();
    loadCaptcha();
    var ok = $('[data-form-success]', modal);
    var target = ok && !ok.hidden ? ok : form.elements.kisi;
    setTimeout(function () { target.focus(); }, 30);
  }
  function closeModal() {
    if (!modal || !modal.open) return;
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
    onModalClosed();
  }
  // Hem düğmeyle kapatınca hem Esc ile (tarayıcının "close" olayı) çalışır; iki kez çağrılması zararsızdır.
  function onModalClosed() {
    if (!root.classList.contains('modal-open')) return;
    lockScroll(false);
    // Başarı ekranından sonra modal yeniden açılırsa boş form gelsin
    var ok = $('[data-form-success]', modal);
    if (ok && !ok.hidden) { ok.hidden = true; form.hidden = false; }
    if (lastOpener && document.contains(lastOpener) && lastOpener.focus) lastOpener.focus({ preventScroll: true });
  }

  if (modal && form) {
    modal.addEventListener('close', onModalClosed);
    // Arka plana (backdrop) tıklayınca kapan
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    each($$('[data-contact-close]', modal), function (b) { b.addEventListener('click', closeModal); });
    each($$('[data-contact-open]'), function (b) { b.addEventListener('click', function () { openModal(b); }); });

    var status = $('.form-status', form);
    var submitBtn = $('button[type="submit"]', form);
    var success = $('[data-form-success]', modal);
    var required = [form.elements.kisi, form.elements.email, form.elements.sirket];
    function showStatus(msg) { status.textContent = msg; status.className = 'form-status full is-error'; status.hidden = false; }
    function clearStatus() { status.hidden = true; status.textContent = ''; }
    each(required, function (f) {
      f.addEventListener('input', function () { f.removeAttribute('aria-invalid'); clearStatus(); });
    });
    function setBusy(on) {
      submitBtn.disabled = on;
      submitBtn.setAttribute('aria-busy', on ? 'true' : 'false');
      submitBtn.firstChild.nodeValue = on ? T('Gönderiliyor…') + ' ' : T('Gönder') + ' ';
    }
    function clean(v, max) { return String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      clearStatus();

      // 1. Bal küpü: bot doldurduysa başarılı gibi davran, hiçbir şey gönderme
      if (f._gotcha.value) { form.hidden = true; success.hidden = false; success.focus(); return; }

      var missing = [];
      each(required, function (el) {
        el.removeAttribute('aria-invalid');
        if (!el.value.trim()) { el.setAttribute('aria-invalid', 'true'); missing.push(el); }
      });
      if (missing.length) { showStatus(T('Lütfen adınızı, e-posta adresinizi ve şirket adını yazın.')); missing[0].focus(); return; }
      if (!EMAIL_RE.test(f.email.value.trim())) { f.email.setAttribute('aria-invalid', 'true'); showStatus(T('Lütfen geçerli bir e-posta adresi yazın.')); f.email.focus(); return; }
      if (f.tel.value && !/^[0-9+()\s.-]{7,30}$/.test(f.tel.value.trim())) { f.tel.setAttribute('aria-invalid', 'true'); showStatus(T('Telefon numarası yalnızca rakam, boşluk ve + ( ) - içerebilir.')); f.tel.focus(); return; }
      var links = (f.not.value.match(/https?:\/\/|www\./gi) || []).length;
      if (links > 2) { showStatus(T('Mesajda en fazla iki bağlantı olabilir.')); f.not.focus(); return; }
      // 2. Süre
      if (Date.now() - openedAt < MIN_FILL_MS) { showStatus(T('Biraz hızlı oldu. Lütfen birkaç saniye sonra tekrar gönderin.')); return; }
      // 3. Sıklık
      var last = 0;
      try { last = parseInt(localStorage.getItem(RATE_KEY), 10) || 0; } catch (err) {}
      if (Date.now() - last < RATE_MS) { showStatus(T('Az önce bir mesaj gönderdiniz. Lütfen bir dakika sonra tekrar deneyin.')); return; }
      // 5. reCAPTCHA
      var token = '';
      if (siteKey) {
        token = captchaId !== null && window.grecaptcha ? window.grecaptcha.getResponse(captchaId) : '';
        if (!token) { showStatus(T('Lütfen "Ben robot değilim" kutusunu işaretleyin.')); return; }
      }
      if (!endpoint) { showStatus(T('Form şu an gönderilemiyor. Lütfen daha sonra tekrar deneyin.')); return; }

      var data = new FormData();
      data.append('kisi', clean(f.kisi.value, 100));
      data.append('email', clean(f.email.value, 160));
      data.append('sirket', clean(f.sirket.value, 120));
      data.append('tel', clean(f.tel.value, 30));
      data.append('alan', clean(f.alan.value, 120));
      data.append('modul', clean(f.modul.value, 60));
      data.append('not', clean(f.not.value, 2000));
      data.append('dil', I18N.lang());
      data.append('_subject', 'Görüşme talebi - ' + clean(f.sirket.value, 80));
      data.append('_gotcha', '');
      if (token) data.append('g-recaptcha-response', token);

      setBusy(true);
      var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' }, credentials: 'omit', referrerPolicy: 'strict-origin-when-cross-origin', signal: ctrl ? ctrl.signal : undefined })
        .then(function (res) {
          clearTimeout(timer);
          if (res.ok) {
            try { localStorage.setItem(RATE_KEY, String(Date.now())); } catch (err) {}
            form.reset();
            form.hidden = true;
            success.hidden = false;
            success.focus();
            return;
          }
          return res.json().catch(function () { return {}; }).then(function (body) {
            var codes = (body && body.errors ? body.errors : []).map(function (x) { return x.code || ''; }).join(' ');
            if (/RECAPTCHA/i.test(codes)) showStatus(T('Güvenlik doğrulaması tamamlanamadı. Lütfen tekrar deneyin.'));
            else if (/EMAIL/i.test(codes)) showStatus(T('Lütfen geçerli bir e-posta adresi yazın.'));
            else showStatus(T('Mesaj gönderilemedi. Lütfen biraz sonra tekrar deneyin.'));
            if (captchaId !== null && window.grecaptcha) window.grecaptcha.reset(captchaId);
          });
        })
        .catch(function () {
          clearTimeout(timer);
          showStatus(T('Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.'));
        })
        .then(function () { setBusy(false); });
    });
  }

  /* Sayfadaki "Tanışalım" / "Pilot için başvurun" bağlantıları formu açar. Ana sayfada iletişim
     bölümüne de kayar; alt sayfalarda form o sayfada açılır (JS kapalıysa bağlantı /#iletisim'e gider).
     data-pick taşıyanlar formda ilgili konuyu (ör. "8 haftalık pilot") işaretler. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || !form || a.hash !== '#iletisim' || a.pathname !== (PAGE === 'home' ? location.pathname : '/')) return;
    var pick = a.getAttribute('data-pick');
    if (pick) {
      each(form.elements.modul.options, function (o) { if (o.value === pick) form.elements.modul.value = pick; });
    }
    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      if (PAGE !== 'home') e.preventDefault();
      setTimeout(function () { openModal(a); }, 0);
    }
  });

  /* ------------------------------------------------------------------
     SAYFA — her sayfa ayrı dosya. Menüdeki aria-current HTML'de yazılı;
     burada yalnızca grup düğmesinin vurgusu, sayfa içi çapalar ve başlık/açıklamanın çevirisi var.
     ------------------------------------------------------------------ */
  var metaDesc = $('meta[name="description"]');
  var baseTitle = document.title;
  var baseDesc = metaDesc ? metaDesc.getAttribute('content') : '';
  var pageH1 = $('main h1');
  var spyLinks = {};
  if (PAGE === 'home') {
    each($$('.menu a[href*="#"]:not(.menu-cta)'), function (a) {
      if (a.pathname === location.pathname && a.hash.length > 1) spyLinks[a.hash.slice(1)] = a;
    });
  }

  function syncGroups() {
    each(dds, function (dd) {
      $('.dd-btn', dd).classList.toggle('has-current', !!$('[aria-current="page"], a.active', dd));
    });
  }
  function clearSpy() { for (var k in spyLinks) if (has(spyLinks, k)) spyLinks[k].classList.remove('active'); }
  function setMeta() {
    document.title = T(baseTitle);
    if (metaDesc) metaDesc.setAttribute('content', T(baseDesc));
  }

  // Sayfa içi çapa (#takvim, #iletisim …): bölüme kayar; klavye kullanıcısı için odak bölüm başlığına gider
  function toAnchor(first) {
    var id = '';
    try { id = location.hash.length > 1 ? decodeURIComponent(location.hash.slice(1)) : ''; } catch (e) { id = ''; }  // bozuk %-kodlu adres sayfayı kırmasın
    var target = id ? document.getElementById(id) : null;
    closeDropdowns(false);
    if (!target) return;
    setTimeout(function () {
      if (target.id === 'top') window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      if (first || (modal && modal.open)) return;
      var h = target.id === 'top' ? pageH1 : target.matches('h1,h2,h3') ? target : $('h2, h3', target);
      if (h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }, first ? 40 : 0);
  }

  /* ------------------------------------------------------------------
     SCROLL: ilerleme çubuğu, başa dön düğmesi, header gölgesi, zaman çizelgesi
     ------------------------------------------------------------------ */
  var header = $('.site-header');
  var toTop = $('.to-top');
  var timeline = $('[data-timeline]');
  var ticking = false;
  function update() {
    ticking = false;
    var y = window.pageYOffset || root.scrollTop;
    var max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--p', (max > 0 ? Math.min(1, Math.max(0, y / max)) : 0).toFixed(4));
    header.classList.toggle('scrolled', y > 8);
    toTop.classList.toggle('show', y > window.innerHeight * 0.6);
    if (timeline && !reduceMotion) {
      var rc = timeline.getBoundingClientRect();
      var mid = window.innerHeight * 0.6;
      timeline.style.setProperty('--tl', Math.min(1, Math.max(0, (mid - rc.top) / rc.height)).toFixed(4));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    if (pageH1) pageH1.focus({ preventScroll: true });
  });

  /* ------------------------------------------------------------------
     SAYI SAYMA (60.000 TL) — hareket azaltmada çalışmaz
     ------------------------------------------------------------------ */
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, I18N.lang() === 'en' ? ',' : '.'); }
  var counters = $$('[data-count]');
  each(counters, function (el) { el.setAttribute('data-i18n-skip', ''); });
  function showCounts() { each(counters, function (el) { el.textContent = fmt(parseInt(el.getAttribute('data-count'), 10)); }); }
  function countUp(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    if (reduceMotion || isNaN(end)) return;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var k = Math.min(1, (ts - start) / 1300);
      el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------
     SCROLL İLE BELİRME + ANA SAYFADA AKTİF MENÜ
     ------------------------------------------------------------------ */
  var revealItems = $$('.reveal');
  each(revealItems, function (el) {
    var idx = 0, sib = el.parentNode.children;
    for (var j = 0; j < sib.length && sib[j] !== el; j++) if (sib[j].classList.contains('reveal')) idx++;
    el.style.setProperty('--d', Math.min(idx, 4) * 90 + 'ms');
  });

  window.addEventListener('hashchange', function () { toAnchor(false); });

  if (!('IntersectionObserver' in window) || reduceMotion) {
    each(revealItems, function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      each(entries, function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        revealObserver.unobserve(en.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    each(revealItems, function (el) { revealObserver.observe(el); });

    var countObserver = new IntersectionObserver(function (entries) {
      each(entries, function (en) {
        if (!en.isIntersecting) return;
        countUp(en.target);
        countObserver.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    each(counters, function (el) { countObserver.observe(el); });
  }

  if ('IntersectionObserver' in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      each(entries, function (en) {
        if (!en.isIntersecting) return;
        clearSpy();
        var link = spyLinks[en.target.id];
        if (link) link.classList.add('active');
      });
      syncGroups();
    }, { rootMargin: '-45% 0px -50% 0px' });
    if (PAGE === 'home') each($$('main section[id]'), function (s) { spyObserver.observe(s); });
  }

  /* ------------------------------------------------------------------
     DİL SEÇİCİ — seçim bu tarayıcıda saklanır ve adrese ?lang= olarak yazılır
     (paylaşılan bağlantı aynı dilde açılır). Tüm arayüz kurulduktan sonra
     Türkçe metinler kaydedilir, sonra algılanan dil uygulanır.
     ------------------------------------------------------------------ */
  var langBtns = $$('[data-lang]');
  // Site içi bağlantılar seçili dili taşır: İngilizcede /pilot → /pilot?lang=en
  var siteLinks = [];
  each($$('a[href^="/"]:not([href^="//"])'), function (a) { siteLinks.push({ a: a, href: a.getAttribute('href') }); });
  function langLinks(lang) {
    each(siteLinks, function (o) {
      var i = o.href.indexOf('#'), path = i < 0 ? o.href : o.href.slice(0, i), hash = i < 0 ? '' : o.href.slice(i);
      o.a.setAttribute('href', lang === 'en' ? path + '?lang=en' + hash : o.href);
    });
  }
  I18N.onChange(function (lang) {
    each(langBtns, function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    setMeta();
    langLinks(lang);
    showCounts();
    if (form) form.elements.dil.value = lang;
  });
  each(langBtns, function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang');
      if (lang === I18N.lang()) return;
      I18N.set(lang, true);
      if (history.replaceState) {
        var q = location.search.replace(/([?&])lang=[^&]*&?/i, '$1').replace(/[?&]$/, '');
        if (lang === 'en') q += (q ? '&' : '?') + 'lang=en';
        history.replaceState(null, '', location.pathname + q + location.hash);
      }
    });
  });

  syncGroups();
  toAnchor(true);
  I18N.scan();
  I18N.apply();
  root.classList.remove('i18n-wait');

  /* ------------------------------------------------------------------
     İÇERİK KORUMASI — metin seçimi, kopyalama, sağ tık ve sürüklemeyi
     form alanları dışında kısıtlar. Bu yalnızca caydırıcıdır: kaynak kod,
     geliştirici araçları, ekran görüntüsü ya da JS kapatılarak aşılabilir.
     ------------------------------------------------------------------ */
  function editable(t) { return !!(t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]')); }
  each(['copy', 'cut', 'contextmenu', 'dragstart', 'selectstart'], function (type) {
    document.addEventListener(type, function (e) { if (!editable(e.target)) e.preventDefault(); });
  });
})();
