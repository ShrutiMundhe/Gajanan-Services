/* ============================================================
   Gajanan Cleaning Services — script.js
   Navbar · Scroll Reveal · Counters · FAQs
   ============================================================ */

/* ── Navbar: hamburger + scroll effect ── */
(function initNavbar() {
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.querySelector('.nav-hamburger') || document.getElementById('nav-hamburger');
  const menu      = document.querySelector('.nav-menu') || document.getElementById('nav-menu');

  if (hamburger && menu) {
    hamburger.addEventListener('click', function() {
      const isOpen = menu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('.nav-link, a').forEach(link => {
      if (link.closest('.nav-dropdown-wrapper') && link.classList.contains('nav-link')) {
        return;
      }
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navbar) return;
      if (!navbar.contains(e.target) && menu.classList.contains('open')) {
        menu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Active nav link based on current page
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── Scroll Reveal ── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* ── Animated Counters ── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    const duration = 2000;
    const start = performance.now();
    const suffix = el.dataset.suffix || '';

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();

/* ── FAQ Accordion ── */
(function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── Floating Buttons ── */
(function initFloatBtns() {
  const topBtn = document.getElementById('float-top');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      topBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ============================================================
   Gajanan Cleaning Services — slider.js
   Testimonial auto-slider with swipe support
   ============================================================ */
(function initSlider() {
  const track  = document.querySelector('.testimonial-track');
  const dotsWrap = document.querySelector('.slider-dots');
  const prevBtn  = document.getElementById('slider-prev');
  const nextBtn  = document.getElementById('slider-next');
  if (!track) return;

  const slides = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoTimer;
  const total = slides.length;

  // Build dots
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap && dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  function startAuto() { autoTimer = setInterval(next, 4500); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }
  startAuto();

  // Touch / swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetAuto(); }
  }, { passive: true });
})();


/* ============================================================
   Gajanan Cleaning Services — contact.js
   No form submission — only WhatsApp / call links behaviour
   ============================================================ */
(function initContact() {
  // WhatsApp link builder
  document.querySelectorAll('[data-wa]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const phone = '919657013038';
      const msg   = encodeURIComponent('Hello, I would like to enquire about your cleaning services.');
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank', 'noopener');
    });
  });
})();


/* ============================================================
   Gajanan Cleaning Services — gallery.js
   Lightbox gallery
   ============================================================ */
(function initGallery() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg  = lightbox.querySelector('.lightbox-img');
  const lbClose = lightbox.querySelector('.lightbox-close');
  const lbPrev  = lightbox.querySelector('.lightbox-prev');
  const lbNext  = lightbox.querySelector('.lightbox-next');

  let items = [];
  let current = 0;

  function open(index) {
    current = index;
    lbImg.src = items[current].src;
    lbImg.alt = items[current].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showNext() { open((current + 1) % items.length); }
  function showPrev() { open((current - 1 + items.length) % items.length); }

  // Collect gallery items
  document.querySelectorAll('.gallery-item img').forEach((img, i) => {
    items.push({ src: img.src, alt: img.alt });
    img.closest('.gallery-item').addEventListener('click', () => open(i));
  });

  if (lbClose) lbClose.addEventListener('click', close);
  if (lbNext)  lbNext.addEventListener('click', showNext);
  if (lbPrev)  lbPrev.addEventListener('click', showPrev);

  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
  });
})();

/* ── Mobile Dropdown Toggler ── */
(function initMobileDropdown() {
  const dropdownWrapper = document.querySelector('.nav-dropdown-wrapper');
  if (dropdownWrapper) {
    const trigger = dropdownWrapper.querySelector('.nav-link');
    if (trigger) {
      trigger.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdownWrapper.classList.toggle('open');
        }
      });
    }
  }
})();

