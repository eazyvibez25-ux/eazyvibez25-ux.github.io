(function () {
  /* ---------- Phone menu ---------- */
  var nav = document.querySelector('.nav');
  var menuBtn = document.getElementById('menu-btn');
  function setMenu(open) {
    if (!nav || !menuBtn) return;
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  }
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Underline the menu item for the section in view ---------- */
  var links = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var ticking = false;
  function markCurrent() {
    ticking = false;
    if (!sections.length) return;
    var line = window.innerHeight * 0.35;
    var current = sections[0];
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1];
    var key = current.getAttribute('data-nav') || current.id;
    Object.keys(links).forEach(function (k) { links[k].setAttribute('aria-current', k === key ? 'true' : 'false'); });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; window.requestAnimationFrame(markCurrent); } }, { passive: true });
  window.addEventListener('resize', markCurrent);
  markCurrent();

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById('copy-email');
  var status = document.getElementById('copy-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = copyBtn.getAttribute('data-email');
      function done() { if (status) status.textContent = 'Email address copied.'; }
      function fallback() {
        var el = document.getElementById('email-text');
        if (el && window.getSelection) {
          var range = document.createRange(); range.selectNodeContents(el);
          var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        }
        if (status) status.textContent = 'Address selected. Use your device’s Copy to copy it.';
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
    });
  }

  /* ---------- Screenshot viewer ---------- */
  var dialog = document.getElementById('lightbox');
  if (dialog && typeof dialog.showModal === 'function') {
    var img = dialog.querySelector('img');
    var cap = dialog.querySelector('.lb-caption');
    document.querySelectorAll('.zoom, .thumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var thumb = btn.querySelector('img');
        img.src = thumb.getAttribute('src');
        img.alt = thumb.getAttribute('alt');
        if (cap) cap.textContent = btn.getAttribute('data-caption') || thumb.getAttribute('alt');
        dialog.showModal();
      });
    });
    dialog.querySelector('.lb-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  } else {
    document.querySelectorAll('.zoom, .thumb').forEach(function (btn) { btn.style.cursor = 'default'; });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
