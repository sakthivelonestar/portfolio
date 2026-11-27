(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Theme toggle (shares the "theme" key with SakthiOS) ---------- */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- Mobile menu ---------- */
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuToggle');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.querySelector('i').className = open ? 'fas fa-xmark' : 'fas fa-bars';
  }

  if (nav && menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Active nav link while scrolling ---------- */
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)')) : [];
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && byId[entry.target.id]) {
          links.forEach(function (a) { a.classList.remove('active'); });
          byId[entry.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll progress bar + back-to-top button ---------- */
  var progress = document.getElementById('scrollProgress');
  var toTop = document.getElementById('toTop');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (progress) progress.style.setProperty('--p', p.toFixed(4));
    if (toTop) toTop.classList.toggle('show', window.scrollY > 700);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Technology strip: duplicate items for a seamless loop ---------- */
  var track = document.querySelector('.marquee-track');
  if (track) {
    Array.prototype.slice.call(track.children).forEach(function (li) {
      var copy = li.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    });
  }

  /* ---------- Mouse-follow glow on cards ---------- */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.card, .why-grid li');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- Count-up stats ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    var start = null;
    var duration = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (t < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduce && counters.length) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterObs.observe(el); });
  }

  /* ---------- Reveal on scroll (staggered within each group) ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    root.classList.add('js-reveal');
    document.querySelectorAll('.reveal').forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains('reveal');
      });
      var i = siblings.indexOf(el);
      if (i > 0) el.style.setProperty('--d', ((i % 6) * 0.08).toFixed(2) + 's');
    });
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Contact form (EmailJS) ---------- */
  var EMAILJS_PUBLIC_KEY = '4IsaU0jLyk7NQXfc8';
  var EMAILJS_SERVICE = 'service_3nbe2df';
  var EMAILJS_TEMPLATE = 'template_zwjthza';

  /* One handler for both forms: check the fields, send with EmailJS, show the result. */
  function wireForm(form, status, text, send) {
    if (!form || !status) return;

    function setStatus(msg, kind) {
      status.textContent = msg;
      status.className = 'form-status' + (kind ? ' ' + kind : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstBad = null;
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.willValidate) return;
        var bad = !el.checkValidity();
        el.classList.toggle('invalid', bad);
        if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) {
        setStatus(text.invalid, 'err');
        firstBad.focus();
        return;
      }

      if (!window.emailjs) {
        setStatus('The form could not load. Please email me at sakthivelidn@gmail.com.', 'err');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn.querySelector('.btn-label');
      var original = label.textContent;
      btn.disabled = true;
      label.textContent = 'Sending…';
      setStatus('');

      send(form)
        .then(function () {
          setStatus(text.ok, 'ok');
          form.reset();
        })
        .catch(function (err) {
          console.error('EmailJS error:', err);
          setStatus('Sorry, something went wrong. Please try again or email sakthivelidn@gmail.com.', 'err');
        })
        .then(function () {
          btn.disabled = false;
          label.textContent = original;
        });
    });

    form.addEventListener('input', function (e) {
      if (e.target.classList.contains('invalid') && e.target.checkValidity()) e.target.classList.remove('invalid');
    });
  }

  wireForm(document.getElementById('contactForm'), document.getElementById('formStatus'), {
    invalid: 'Please fill in your name, a valid email, what you need and a short message.',
    ok: 'Thanks! Your enquiry was sent. I\'ll get back to you soon.'
  }, function (form) {
    return window.emailjs.sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, form, EMAILJS_PUBLIC_KEY);
  });

  /* Course registration uses the same email template: the phone, batch and note travel in the message. */
  wireForm(document.getElementById('courseForm'), document.getElementById('courseStatus'), {
    invalid: 'Please fill in your name, a phone number, a valid email and a batch.',
    ok: 'Thanks! Your registration was sent. I\'ll contact you with the batch details.'
  }, function (form) {
    var val = function (name) { return form.querySelector('[name="' + name + '"]').value.trim(); };
    return window.emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
      name: val('name'),
      email: val('email'),
      subject: 'Course registration: Full Stack 90-day course',
      budget: 'Not applicable',
      message: 'Phone: ' + val('phone') + '\nBatch: ' + val('batch') + '\nNote: ' + (val('note') || '-')
    }, EMAILJS_PUBLIC_KEY);
  });
})();
