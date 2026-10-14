/* ============================================================================
   AZLOOM · JS compartido
   Nav · header scroll · i18n (ES/EN) · reveal · smooth scroll · modales · form.
   Sin dependencias. Motion sobrio, respeta prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Header: estado al hacer scroll --------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.dataset.scrolled = String(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Menú móvil --------------------------------------------------------- */
  var navToggle = document.querySelector('.site-nav__toggle');
  var navPanel = document.querySelector('.site-nav__panel');
  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      var open = navPanel.dataset.open !== 'true';
      navPanel.dataset.open = String(open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navPanel.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navPanel.dataset.open = 'false';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- i18n (ES / EN) ---------------------------------------------------- *
   * Cada idioma tiene su propia URL real (/… en español, /en/… en inglés).
   * El idioma de la página lo fija <html lang>; el selector es un enlace a la
   * URL equivalente. Aquí solo aplicamos el diccionario del idioma propio
   * (necesario para el contenido de los modales legales, que va vacío en HTML). */
  var I18N = window.AZLOOM_I18N || {};
  var lang = document.documentElement.lang === 'en' ? 'en' : 'es';

  function applyLang(next) {
    lang = next;
    var dict = I18N[lang] || {};
    document.documentElement.lang = lang;
    if (dict['meta.title']) document.title = dict['meta.title'];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      // formato: "placeholder:key" o "aria-label:key;placeholder:key2"
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length === 2 && dict[parts[1]] != null) {
          el.setAttribute(parts[0].trim(), dict[parts[1].trim()]);
        }
      });
    });

  }

  if (Object.keys(I18N).length) applyLang(lang);

  /* --- Reveal tipográfico por línea (titulares, textos clave) ------------ *
   * Divide el texto real en líneas visuales (según el layout ya renderizado)
   * y las envuelve en una máscara para revelarlas una a una al entrar en
   * viewport. Se ejecuta después de applyLang para no perder el idioma.
   * El H1 del hero queda excluido a propósito (tiene su propio wipe). */
  var SPLIT_SELECTOR = '.page-hero h1, .section-head h2, .project__title, .capability__name, .faq-entry h2, .faq-entry h3';
  var splitTargets = Array.prototype.slice.call(document.querySelectorAll(SPLIT_SELECTOR));

  function splitIntoLines(el) {
    var words = (el.textContent || '').trim().split(/\s+/).filter(Boolean);
    if (!words.length) return;
    var frag = document.createDocumentFragment();
    var wordEls = [];
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'sl-word';
      span.textContent = w;
      frag.appendChild(span);
      wordEls.push(span);
      if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
    });
    el.textContent = '';
    el.appendChild(frag);

    var lines = [];
    var lastTop = null;
    wordEls.forEach(function (w) {
      var top = w.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 2) {
        lines.push([]);
        lastTop = top;
      }
      lines[lines.length - 1].push(w.textContent);
    });

    el.textContent = '';
    lines.forEach(function (lineWords, i) {
      var mask = document.createElement('span');
      mask.className = 'sl-line';
      var inner = document.createElement('span');
      inner.className = 'sl-line__inner';
      inner.style.transitionDelay = (i * 90) + 'ms';
      inner.textContent = lineWords.join(' ');
      mask.appendChild(inner);
      el.appendChild(mask);
      if (i < lines.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.classList.add('sl-ready');
  }

  if (splitTargets.length && !reduceMotion) {
    splitTargets.forEach(splitIntoLines);
    if ('IntersectionObserver' in window) {
      var splitIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-split-visible');
            splitIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
      splitTargets.forEach(function (el) { splitIo.observe(el); });
    } else {
      splitTargets.forEach(function (el) { el.classList.add('is-split-visible'); });
    }
  }

  /* --- Reveal al entrar en viewport ------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* --- Parallax con profundidad en proyectos ---------------------------- *
   * La imagen y el bloque de texto de cada .project se mueven a velocidades
   * distintas durante el scroll, para dar sensación de profundidad real. */
  var parallaxCards = Array.prototype.slice.call(document.querySelectorAll('.project'));
  if (parallaxCards.length && !reduceMotion) {
    var parallaxTicking = false;
    var updateParallax = function () {
      var vh = window.innerHeight;
      parallaxCards.forEach(function (card) {
        var media = card.querySelector('.project__media');
        var img = media ? media.querySelector('img') : null;
        var body = card.querySelector('.project__body');
        if (!img) return;
        var rect = card.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - vh / 2) / vh; /* aprox. -0.5..0.5 al cruzar el viewport */
        var py = Math.max(-42, Math.min(42, offset * 60));
        img.style.setProperty('--py', py.toFixed(1) + 'px');
        if (body) {
          var pyt = Math.max(-16, Math.min(16, offset * -22));
          body.style.setProperty('--pyt', pyt.toFixed(1) + 'px');
        }
      });
      parallaxTicking = false;
    };
    var onParallaxScroll = function () {
      if (!parallaxTicking) {
        window.requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    };
    updateParallax();
    window.addEventListener('scroll', onParallaxScroll, { passive: true });
    window.addEventListener('resize', onParallaxScroll);
  }

  /* --- Indicador "scroll down" del hero ---------------------------------- */
  var scrollCue = document.querySelector('.scroll-cue');
  if (scrollCue) {
    var toggleScrollCue = function () {
      scrollCue.dataset.hidden = window.scrollY > 60 ? 'true' : 'false';
    };
    toggleScrollCue();
    window.addEventListener('scroll', toggleScrollCue, { passive: true });
  }

  /* --- Cursor AZLOOM: punto luminoso minimalista (solo desktop con mouse) */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    var orb = document.createElement('div');
    orb.className = 'cursor-orb';
    orb.setAttribute('aria-hidden', 'true');
    document.body.appendChild(orb);
    document.documentElement.classList.add('has-custom-cursor');

    var targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
    var curX = targetX, curY = targetY;
    var orbVisible = false;

    var INTERACTIVE = 'a, button, .btn, input, textarea, select, [role="button"], .site-nav__toggle, [data-modal], [data-consent]';

    document.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!orbVisible) {
        orbVisible = true;
        orb.classList.add('cursor-orb--visible');
      }
    }, { passive: true });

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(INTERACTIVE)) orb.classList.add('cursor-orb--active');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(INTERACTIVE)) orb.classList.remove('cursor-orb--active');
    });
    document.addEventListener('mousedown', function () { orb.classList.add('cursor-orb--down'); });
    document.addEventListener('mouseup', function () { orb.classList.remove('cursor-orb--down'); });

    (function loop() {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      orb.style.transform = 'translate3d(' + curX.toFixed(1) + 'px,' + curY.toFixed(1) + 'px,0) translate(-50%,-50%)';
      window.requestAnimationFrame(loop);
    })();
  }

  /* --- Smooth scroll a anclas ----------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target;
      try { target = document.querySelector(id); } catch (err) { return; }
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* --- Modales legales (patrón W3C APG dialog modal) ----------------- *
   * Foco inicial en el diálogo · focus trap mientras está abierto ·
   * Escape para cerrar · restauración de foco al activador ·
   * fondo marcado como inert. */
  var modalReturnFocus = null;
  var FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function setBackgroundInert(on) {
    ['.site-header', 'main', '.site-footer'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }

  function openModal(id) {
    var m = document.getElementById('modal-' + id);
    if (!m) return;
    modalReturnFocus = document.activeElement;
    m.dataset.open = 'true';
    document.body.dataset.modalOpen = 'true';
    setBackgroundInert(true);
    var closeBtn = m.querySelector('.legal-modal__close');
    if (closeBtn) closeBtn.focus();
  }
  function closeModal(m) {
    m.dataset.open = 'false';
    document.body.dataset.modalOpen = 'false';
    setBackgroundInert(false);
    if (modalReturnFocus && typeof modalReturnFocus.focus === 'function') {
      modalReturnFocus.focus();
    }
    modalReturnFocus = null;
  }
  function trapFocus(m, e) {
    var f = m.querySelectorAll(FOCUSABLE);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!m.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  }

  document.querySelectorAll('[data-modal]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(trigger.getAttribute('data-modal'));
    });
  });
  document.querySelectorAll('.legal-modal').forEach(function (m) {
    m.addEventListener('click', function (e) {
      if (e.target === m || e.target.closest('.legal-modal__close')) closeModal(m);
    });
  });
  document.addEventListener('keydown', function (e) {
    var open = document.querySelector('.legal-modal[data-open="true"]');
    if (!open) return;
    if (e.key === 'Escape') { closeModal(open); return; }
    if (e.key === 'Tab') { trapFocus(open, e); }
  });

  /* --- Formulario de contacto --------------------------------------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var dict = I18N[lang] || {};
      var labelSend = dict['form.submit'] || 'Enviar mensaje';
      var labelSending = lang === 'en' ? 'Sending…' : 'Enviando…';
      var labelError = lang === 'en' ? 'Error — try again' : 'Error — inténtelo de nuevo';

      btn.textContent = labelSending;
      btn.disabled = true;

      var endpoint = 'https://formsubmit.co/ajax/' + atob('aGVsbG9AYXpsb29tLnRlY2g=');
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (res) {
        if (!res.ok) throw new Error();
        form.hidden = true;
        var ok = document.getElementById('form-success');
        if (ok) { ok.dataset.visible = 'true'; ok.focus(); }
      }).catch(function () {
        btn.textContent = labelError;
        btn.disabled = false;
        setTimeout(function () { btn.textContent = labelSend; }, 3500);
      });
    });
  }

  /* --- Banner de consentimiento de cookies (Google Consent Mode) ----- */
  var CONSENT_KEY = 'azloom_consent';

  function updateAnalyticsConsent(status) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: status });
    }
  }

  (function initConsentBanner() {
    var stored;
    try { stored = localStorage.getItem(CONSENT_KEY); } catch (e) {}
    if (stored === 'granted' || stored === 'denied') return;

    var dict = I18N[lang] || {};
    var text = dict['cookie.text'] || 'Usamos cookies técnicas necesarias para el sitio y, con su consentimiento, cookies analíticas (Google Analytics) para entender cómo se usa.';
    var linkLabel = dict['legal.cookies'] || 'Política de cookies';
    var acceptLabel = dict['cookie.accept'] || 'Aceptar';
    var rejectLabel = dict['cookie.reject'] || 'Rechazar';

    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', lang === 'en' ? 'Cookie notice' : 'Aviso de cookies');
    banner.innerHTML =
      '<div class="cookie-banner__inner container">' +
        '<p>' + text + ' <a href="#" data-modal="cookies">' + linkLabel + '</a>.</p>' +
        '<div class="cookie-banner__actions">' +
          '<button type="button" class="btn btn--secondary" data-consent="reject">' + rejectLabel + '</button>' +
          '<button type="button" class="btn btn--primary" data-consent="accept">' + acceptLabel + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    var cookieLink = banner.querySelector('[data-modal="cookies"]');
    if (cookieLink) {
      cookieLink.addEventListener('click', function (e) {
        e.preventDefault();
        openModal('cookies');
      });
    }

    banner.querySelector('[data-consent="accept"]').addEventListener('click', function () {
      try { localStorage.setItem(CONSENT_KEY, 'granted'); } catch (e) {}
      updateAnalyticsConsent('granted');
      banner.remove();
    });
    banner.querySelector('[data-consent="reject"]').addEventListener('click', function () {
      try { localStorage.setItem(CONSENT_KEY, 'denied'); } catch (e) {}
      updateAnalyticsConsent('denied');
      banner.remove();
    });
  })();

  /* --- Hero: fondo animado (esferas + malla) con vida + scroll -------------
     Dibuja la secuencia de fotogramas en un canvas: la forma respira de forma
     continua (viva en reposo) y se transforma a medida que se scrollea
     (ping-pong, nunca se queda pegada). Con movimiento reducido no corre:
     queda el hero de texto con su fallback. --------------------------------- */
  (function () {
    if (reduceMotion) return;
    var hero = document.querySelector('.hero');
    var canvas = document.getElementById('heroCanvas');
    if (!hero || !canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var N = 61;
    var frames = [];
    var pad = function (n) { return (n < 10 ? '00' : n < 100 ? '0' : '') + n; };
    for (var i = 1; i <= N; i++) {
      var im = new Image();
      im.src = '/assets/hero/pods/p' + pad(i) + '.jpg';
      frames.push(im);
    }

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var current = -1;

    function draw(idx, force) {
      idx = Math.max(0, Math.min(N - 1, Math.round(idx)));
      var img = frames[idx];
      if (!img || !img.complete || !img.naturalWidth) {
        for (var d = 1; d < N; d++) {
          var a = frames[Math.max(0, idx - d)];
          var b = frames[Math.min(N - 1, idx + d)];
          if (a && a.complete && a.naturalWidth) { img = a; break; }
          if (b && b.complete && b.naturalWidth) { img = b; break; }
        }
        if (!img || !img.naturalWidth) return;
      }
      if (idx === current && !force) return;
      current = idx;
      var cw = canvas.width, ch = canvas.height;
      var iw = img.naturalWidth, ih = img.naturalHeight;
      var s = Math.max(cw / iw, ch / ih);
      var dw = iw * s, dh = ih * s;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    function resize() {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(current < 0 ? 0 : current, true);
    }

    function progress() {
      var r = hero.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      if (total <= 0) return 1;
      return Math.min(1, Math.max(0, (-r.top) / total));
    }

    function loop(now) {
      var t = now / 1000;
      var p = progress();
      var v = p * (N - 1) * 1.8 + Math.sin(t * 2.1) * 4.5;
      var span = N - 1;
      var m = ((v % (2 * span)) + 2 * span) % (2 * span);
      var idx = m <= span ? m : (2 * span - m);
      draw(idx);
      requestAnimationFrame(loop);
    }

    var started = false;
    function start() {
      if (started) return;
      started = true;
      hero.setAttribute('data-hero-ready', '');
      resize();
      requestAnimationFrame(loop);
    }

    var ready = 0;
    frames.forEach(function (im) {
      if (im.complete && im.naturalWidth) {
        ready++;
      } else {
        im.addEventListener('load', function () {
          ready++;
          if (ready >= 8) start();
        });
      }
    });
    if (ready >= 8) start();

    window.addEventListener('resize', resize, { passive: true });
  })();
})();
