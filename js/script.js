/* ============================================================
   Rustic Revival — Premium Portfolio
   script.js
   ============================================================ */

'use strict';

/* ── Artwork data ── */
const ARTWORK_COUNT = 30;
const ARTWORK_CATEGORIES = ['abstract','texture','portrait','nature','abstract','texture','abstract','nature','portrait','abstract','texture','nature','abstract','portrait','abstract','texture','abstract','nature','portrait','abstract','texture','abstract','nature','portrait','abstract','texture','abstract','nature','portrait','abstract','texture'];
const ARTWORK_TITLES = ['Textured Thread Art','Textured Thread Art','Tactile Wall Art','Tactile Wall Art','Tactile Wall Art','Jute Thread Art','Woolen Thread Art','Jute Thread Art','Jute Thread Art','Jute Canvas','Embossed Jute art','Embossed Jute art','Textured Thread Art','Jute Thread Art','Jute Thread Art','Textured Art','Textured Art','Layered Textured Art','Layered Textured Art','Textured Art','Textured Art','Textured Art','Textured Canvas','Canvas Painting','Canvas Painting','Canvas Painting','Ceramic Hanging Lamp','Ceramic Hanging Lamp','Ceramic Hanging Lamp','Natural Wooden Wall Lamp'];
const HERO_FEATURED_ARTWORKS = [1, 3, 4, 11];
// const ARTWORK_DESCS = ['Original hand-painted canvas. A meditation on stillness and space.','A large-format piece in warm gold and amber tones. Spectacular at scale.','Textural mixed-media artwork exploring layers of colour and form.','Nature-inspired composition. Deep greens and misty blues on linen canvas.','A deeply minimal work — negative space as the primary subject.','Bold gestural strokes in crimson and charcoal. Unapologetically dramatic.','Vertical canvas exploring movement, light, and upward energy.','Inspired by Indian monsoons. Fluid blues and greys in motion.','A luminous study of the human form through layers of warm light.','An open, meditative work. Make of it what your space needs.','Earth tones and raw pigment. Tactile, grounded, enduring.','Flowing horizontals in blue and silver. Serene and timeless.','Abstract movement study. The eye is never quite still looking at it.','Elegant figurative work in muted ivory and shadow.','Another from the Untitled series — space for your own reading.','Heavy texture in clay, sand, and gold leaf. Touch feels as important as sight.','A perfectly poised composition of warm and cool tones.','Deep forest canopy abstracted into vertical form. Dark and enveloping.','Reflective surfaces and layered transparencies. Deeply meditative.','A dark, quiet field of deep blue and black. Space to breathe.','Inspired by geological cross-sections. Scientific beauty as art.','Deep-field composition exploring spatial depth through tone and haze.','Botanical study in bloom — delicate and full of movement.','An intense portrait study. Direct, unflinching, beautifully executed.','First in the Abstract series. A genesis piece for any collection.','Textile-inspired painting with woven structures rendered in paint.','The second Abstract — a dialogue with the first, across any room.','Botanical explosion in rose, white, and sage. Life in full colour.','Reflective water study in cool greys and silver. Utterly calming.','Third in the series. The conversation between the three is the artwork.','Light and form in near darkness. A piece that rewards slow looking.'];

const ARTWORK_DESCS=[];

/* ── Utility: debounce ── */
function debounce(fn, ms = 100) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ────────────────────────────────────────────
   1. LENIS SMOOTH SCROLL
──────────────────────────────────────────── */
// let lenis;
// function initLenis() {
//   lenis = new Lenis({
//     duration: 1.2,
//     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//     orientation: 'vertical',
//     gestureOrientation: 'vertical',
//     smoothWheel: true,
//     wheelMultiplier: 0.9,
//     touchMultiplier: 1.5,
//   });

//   function raf(time) {
//     lenis.raf(time);
//     requestAnimationFrame(raf);
//   }
//   requestAnimationFrame(raf);

//   // Hook GSAP ScrollTrigger
//   lenis.on('scroll', ScrollTrigger.update);
//   gsap.ticker.add((time) => { lenis.raf(time * 1000); });
//   gsap.ticker.lagSmoothing(0);
// }

let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}


/* ────────────────────────────────────────────
   2. PAGE LOADER
──────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  // Never leave the page locked if the loader markup is absent
  if (!loader) { document.documentElement.classList.remove('scroll-locked'); return; }

  window.addEventListener('load', () => {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.6,
      delay: 1.8,
      ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        document.documentElement.classList.remove('scroll-locked');
        initHeroAnimations();
      }
    });
  });
}

/* ────────────────────────────────────────────
   3. HERO CANVAS — Animated Particles
──────────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles = [], mouse = { x: -999, y: -999 };
  const PARTICLE_COUNT = 80;
  const GOLD = [184, 151, 90];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', debounce(resize, 200));

  // Particle class
  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * w;
      this.y = initial ? Math.random() * h : h + 20;
      this.size = Math.random() * 2 + 0.5;
      this.speed = Math.random() * 0.4 + 0.15;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx;
      this.y -= this.speed;
      this.life++;

      // Mouse repel
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x += (dx / dist) * 0.8;
        this.y += (dy / dist) * 0.8;
      }

      if (this.y < -10 || this.life > this.maxLife) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const fade = progress < 0.1 ? progress * 10 : progress > 0.8 ? (1 - progress) * 5 : 1;
      ctx.globalAlpha = this.opacity * fade;
      ctx.fillStyle = `rgb(${GOLD[0]},${GOLD[1]},${GOLD[2]})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Subtle gradient backdrop
  function drawGradient() {
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, w * 0.7);
    grad.addColorStop(0, 'rgba(40,32,20,0.6)');
    grad.addColorStop(1, 'rgba(10,10,10,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  // Floating organic blobs
  let blobT = 0;
  function drawBlobs() {
    blobT += 0.003;
    const blobs = [
      { x: w * 0.2 + Math.sin(blobT) * 40, y: h * 0.3 + Math.cos(blobT * 0.7) * 30, r: 160, a: 0.04 },
      { x: w * 0.8 + Math.cos(blobT * 0.8) * 50, y: h * 0.6 + Math.sin(blobT * 1.1) * 40, r: 200, a: 0.03 },
      { x: w * 0.5 + Math.sin(blobT * 1.3) * 60, y: h * 0.8 + Math.cos(blobT * 0.5) * 20, r: 140, a: 0.025 },
    ];
    blobs.forEach(b => {
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${b.a})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    drawGradient();
    drawBlobs();
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();

  // Mouse tracking
  const hero = document.getElementById('hero');
  hero?.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero?.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
}

/* ────────────────────────────────────────────
   3b. HERO ARTWORK SHOWCASE
──────────────────────────────────────────── */
function initHeroArtwork() {
  const img = document.getElementById('heroArtworkImg');
  const titleEl = document.getElementById('heroArtworkTitle');
  if (!img || !titleEl) return;

  let i = 0;
  const setSlide = idx => {
    const artIndex = HERO_FEATURED_ARTWORKS[idx];
    img.src = `assets/artworks/${artIndex}.jpeg`;
    img.alt = `${ARTWORK_TITLES[artIndex - 1]} — Original artwork by Rustic Revival`;
    titleEl.textContent = ARTWORK_TITLES[artIndex - 1];
  };
  setSlide(0);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  setInterval(() => {
    img.style.opacity = 0;
    setTimeout(() => {
      i = (i + 1) % HERO_FEATURED_ARTWORKS.length;
      setSlide(i);
      img.style.opacity = 1;
    }, 400);
  }, 4500);
}

/* ────────────────────────────────────────────
   4. HERO ENTRANCE ANIMATIONS
──────────────────────────────────────────── */
// function initHeroAnimations() {
//   const lines = document.querySelectorAll('.hero-headline .reveal-line');
//   const eyebrow = document.querySelector('.hero-eyebrow');
//   const sub = document.querySelector('.hero-sub');
//   const ctas = document.querySelector('.hero-ctas');

//   const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

//   tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.9, delay: 0.1 })
//     .to(lines, { opacity: 1, y: 0, duration: 1, stagger: 0.15 }, '-=0.5')
//     .to(sub, { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
//     .to(ctas, { opacity: 1, y: 0, duration: 0.9 }, '-=0.6');
// }

function initHeroAnimations() {
  const heroContent = document.querySelector('.hero-content');

  if (!heroContent) return;

  gsap.fromTo(
    heroContent,
    {
      opacity: 0,
      y: 30
    },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out'
    }
  );
}

/* ────────────────────────────────────────────
   5. NAVIGATION
──────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  // Scroll class
  let navScrolled = false;
  function onNavScroll() {
    const y = window.scrollY;
    if (!navScrolled && y > 40) {
      navScrolled = true;
      nav.classList.add('scrolled');
    } else if (navScrolled && y < 24) {
      navScrolled = false;
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  // Mobile toggle
  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (lenis) open ? lenis.stop() : lenis.start();
  });

  // Close on link click
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      if (lenis) lenis.start();
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));
}

/* ────────────────────────────────────────────
   6. CUSTOM CURSOR
──────────────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.05 });
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverEls = document.querySelectorAll('a, button, [data-magnetic], .gallery-item, .filter-btn, .service-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });
}

/* ────────────────────────────────────────────
   7. MAGNETIC BUTTONS
──────────────────────────────────────────── */
function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      gsap.to(btn, { x: dx * 0.25, y: dy * 0.25, duration: 0.4, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
    });
  });
}

/* ────────────────────────────────────────────
   8. SCROLL ANIMATIONS (GSAP ScrollTrigger)
──────────────────────────────────────────── */
function initScrollAnimations() {
  // gsap.registerPlugin(ScrollTrigger);

  // Generic fade-up for sections
  gsap.utils.toArray('.service-card, .why-card, .process-step').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        delay: (i % 4) * 0.08,
      }
    );
  });

  // About section
  // ScrollTrigger.create({
  //   trigger: '.about',
  //   start: 'top 75%',
  //   onEnter: () => {
  //     gsap.fromTo('.about-visual', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' });
  //     gsap.fromTo('.about-content > *', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2 });
  //   }
  // });

   ScrollTrigger.create({
  trigger: '.about',
  start: 'top 75%',
  onEnter: () => {
    const aboutContent = document.querySelectorAll('.about-content > *');

    if (aboutContent.length) {
      gsap.fromTo(
        aboutContent,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        }
      );
    }
  }
});

  // Custom art section
  ScrollTrigger.create({
    trigger: '.custom-art',
    start: 'top 75%',
    onEnter: () => {
      gsap.fromTo('.custom-art-content > *', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
      gsap.fromTo('.custom-art-visual', { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
    }
  });

  // CTA section headline
  ScrollTrigger.create({
    trigger: '.cta-section',
    start: 'top 80%',
    onEnter: () => {
      gsap.fromTo('.cta-content > *', { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' });
    }
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.fromTo(header,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: header, start: 'top 82%' }
      }
    );
  });

//Commented as these two section is commented in index.html
   
  // Process line fill
  // ScrollTrigger.create({
  //   trigger: '.process-track',
  //   start: 'top 70%',
  //   onEnter: () => {
  //     const fill = document.getElementById('processLineFill');
  //     if (fill) { fill.style.width = '100%'; }
  //     document.querySelectorAll('.process-step').forEach((s, i) => {
  //       setTimeout(() => s.classList.add('active'), i * 280);
  //     });
  //   }
  // });

  // // Stats counters
  // ScrollTrigger.create({
  //   trigger: '.about-stats',
  //   start: 'top 80%',
  //   onEnter: animateCounters,
  // });
}

/* ────────────────────────────────────────────
   9. ANIMATED COUNTERS
──────────────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  });
}

/* ────────────────────────────────────────────
   10. ARTWORK GALLERY — Dynamic Generation
──────────────────────────────────────────── */
const ITEMS_PER_PAGE = 12;
let currentFilter = 'all';
let currentPage = 1;
let filteredIndices = [];
let currentLightboxIndex = 0;
let galleryRevealObserver = null;

function computeFilteredIndices(filter) {
  const all = Array.from({ length: ARTWORK_COUNT }, (_, i) => i);
  return filter === 'all' ? all : all.filter(i => ARTWORK_CATEGORIES[i] === filter);
}

function initGallery() {
  const masonry = document.getElementById('galleryMasonry');
  if (!masonry) return;

  masonry.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (item) openLightbox(parseInt(item.dataset.index, 10));
  });
  masonry.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    e.preventDefault();
    openLightbox(parseInt(item.dataset.index, 10));
  });

  document.getElementById('galleryPagination')?.addEventListener('click', e => {
    const btn = e.target.closest('button[data-page]');
    if (!btn || btn.disabled) return;
    goToPage(parseInt(btn.dataset.page, 10));
  });

  currentFilter = 'all';
  currentPage = 1;
  filteredIndices = computeFilteredIndices(currentFilter);

  renderGalleryPage();
  renderPaginationControls();
}

function renderGalleryPage() {
  const masonry = document.getElementById('galleryMasonry');
  if (!masonry) return;
  masonry.innerHTML = '';

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageIndices = filteredIndices.slice(start, start + ITEMS_PER_PAGE);

  if (pageIndices.length === 0) {
    masonry.innerHTML = '<p class="gallery-empty">No artworks match this filter yet.</p>';
    return;
  }

  const frag = document.createDocumentFragment();
  pageIndices.forEach(idx => {
    const num = idx + 1;
    const cat = ARTWORK_CATEGORIES[idx];
    const title = ARTWORK_TITLES[idx];

    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-index', idx);
    item.setAttribute('data-category', cat);
    item.setAttribute('role', 'listitem');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Artwork: ${title}`);

    item.innerHTML = `
      <img
        src="assets/artworks/${num}.jpeg"
        alt="${title} — Original artwork by Rustic Revival"
        loading="lazy"
        decoding="async"
      />
      <div class="gallery-item-overlay">
        <span class="gallery-item-label">${title}</span>
      </div>
      <span class="gallery-item-num">${String(num).padStart(2,'0')}</span>
    `;

    frag.appendChild(item);
  });
  masonry.appendChild(frag);

  const newItems = masonry.querySelectorAll('.gallery-item');

  // Vanilla Tilt on gallery items (subtle)
  VanillaTilt.init(newItems, {
    max: 6,
    speed: 400,
    glare: true,
    'max-glare': 0.08,
    scale: 1.02,
  });

  // Gallery item reveal on scroll
  if (galleryRevealObserver) galleryRevealObserver.disconnect();
  galleryRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.fromTo(entry.target,
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
        );
        galleryRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  newItems.forEach(item => galleryRevealObserver.observe(item));
}

function computePageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1].filter(p => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('…');
    result.push(p);
  });
  return result;
}

function renderPaginationControls() {
  const nav = document.getElementById('galleryPagination');
  if (!nav) return;
  nav.innerHTML = '';

  const totalPages = Math.ceil(filteredIndices.length / ITEMS_PER_PAGE);
  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn page-btn-arrow';
  prevBtn.dataset.page = String(currentPage - 1);
  prevBtn.setAttribute('aria-label', 'Previous page');
  prevBtn.innerHTML = '&lsaquo;';
  if (currentPage === 1) prevBtn.disabled = true;
  nav.appendChild(prevBtn);

  computePageList(currentPage, totalPages).forEach(p => {
    if (p === '…') {
      const span = document.createElement('span');
      span.className = 'page-ellipsis';
      span.textContent = '…';
      span.setAttribute('aria-hidden', 'true');
      nav.appendChild(span);
    } else {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (p === currentPage ? ' active' : '');
      btn.dataset.page = String(p);
      btn.textContent = String(p);
      btn.setAttribute('aria-label', `Page ${p}`);
      if (p === currentPage) btn.setAttribute('aria-current', 'page');
      nav.appendChild(btn);
    }
  });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn page-btn-arrow';
  nextBtn.dataset.page = String(currentPage + 1);
  nextBtn.setAttribute('aria-label', 'Next page');
  nextBtn.innerHTML = '&rsaquo;';
  if (currentPage === totalPages) nextBtn.disabled = true;
  nav.appendChild(nextBtn);
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredIndices.length / ITEMS_PER_PAGE);
  if (page < 1 || page > totalPages || page === currentPage) return;
  currentPage = page;
  renderGalleryPage();
  renderPaginationControls();
  scrollToGalleryTop();
}

function scrollToGalleryTop() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
  if (lenis) {
    lenis.scrollTo(gallery, { offset: -offset, duration: 1.2 });
  } else {
    gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ── Gallery Filters ── */
function initGalleryFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      currentFilter = btn.dataset.filter;
      filteredIndices = computeFilteredIndices(currentFilter);
      currentPage = 1;

      renderGalleryPage();
      renderPaginationControls();
    });
  });
}

/* ────────────────────────────────────────────
   11. LIGHTBOX
──────────────────────────────────────────── */
function openLightbox(index) {
  const lightbox = document.getElementById('lightbox');
  const backdrop = document.getElementById('lightboxBackdrop');
  if (!lightbox || !backdrop) return;

  currentLightboxIndex = index;
  updateLightboxContent(index);

  lightbox.removeAttribute('hidden');
  lightbox.classList.add('active');
  backdrop.classList.add('active');
  document.documentElement.classList.add('scroll-locked');
  if (lenis) lenis.stop();

  // Focus close button
  setTimeout(() => document.getElementById('lightboxClose')?.focus(), 100);

  // Animate in
  gsap.fromTo('.lightbox-inner', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' });
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const backdrop = document.getElementById('lightboxBackdrop');
  if (!lightbox || !backdrop) return;

  gsap.to('.lightbox-inner', {
    opacity: 0, scale: 0.96, duration: 0.3, ease: 'power2.in',
    onComplete: () => {
      lightbox.setAttribute('hidden', '');
      lightbox.classList.remove('active');
      backdrop.classList.remove('active');
      document.documentElement.classList.remove('scroll-locked');
      if (lenis) lenis.start();
    }
  });
}

function updateLightboxContent(index) {
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  const title = document.getElementById('lightboxTitle');
  const desc = document.getElementById('lightboxDesc');
  if (!img) return;

  const artIndex = index; // 0-based
  const num = artIndex + 1;

  // Fade transition
  gsap.to(img, { opacity: 0, duration: 0.2, onComplete: () => {
    img.src = `assets/artworks/${num}.jpeg`;
    img.alt = `${ARTWORK_TITLES[artIndex]} — Artwork done by Rustic Revival`;
    img.onload = () => gsap.to(img, { opacity: 1, duration: 0.3 });
  }});

  const posInFiltered = filteredIndices.indexOf(artIndex) + 1;
  if (counter) counter.textContent = `${posInFiltered} / ${filteredIndices.length}`;
  if (title) title.textContent = ARTWORK_TITLES[artIndex] || `Artwork ${num}`;
  if (desc) desc.textContent = ARTWORK_DESCS[artIndex] || 'Artwork done by Rustic Revival.';
}

function prevArtwork() {
  const pos = filteredIndices.indexOf(currentLightboxIndex);
  if (pos === -1) return;
  const newPos = pos > 0 ? pos - 1 : filteredIndices.length - 1;
  currentLightboxIndex = filteredIndices[newPos];
  updateLightboxContent(currentLightboxIndex);
}

function nextArtwork() {
  const pos = filteredIndices.indexOf(currentLightboxIndex);
  if (pos === -1) return;
  const newPos = pos < filteredIndices.length - 1 ? pos + 1 : 0;
  currentLightboxIndex = filteredIndices[newPos];
  updateLightboxContent(currentLightboxIndex);
}

function initLightbox() {
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const backdrop = document.getElementById('lightboxBackdrop');

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', prevArtwork);
  nextBtn?.addEventListener('click', nextArtwork);
  backdrop?.addEventListener('click', closeLightbox);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevArtwork();
    if (e.key === 'ArrowRight') nextArtwork();
  });

  // Touch/swipe support
  let touchStartX = 0;
  const lightbox = document.getElementById('lightbox');
  lightbox?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? nextArtwork() : prevArtwork();
  });
}

/* ────────────────────────────────────────────
   12. TESTIMONIALS SWIPER
──────────────────────────────────────────── */
function initSwiper() {
  new Swiper('.testimonials-swiper', {
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
    speed: 700,
    spaceBetween: 24,
    grabCursor: true,
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      0:    { slidesPerView: 1 },
      640:  { slidesPerView: 1 },
      900:  { slidesPerView: 2 },
      1200: { slidesPerView: 3 },
    },
    a11y: { prevSlideMessage: 'Previous testimonial', nextSlideMessage: 'Next testimonial' },
  });
}

/* ────────────────────────────────────────────
   13. PARALLAX — Hero & Sections
──────────────────────────────────────────── */
// function initParallax() {
//   // Hero content subtle parallax
//   ScrollTrigger.create({
//     trigger: '.hero',
//     start: 'top top',
//     end: 'bottom top',
//     onUpdate: self => {
//       const p = self.progress;
//       gsap.set('.hero-content', { y: p * 80 });
//       gsap.set('.hero-canvas', { y: p * 40 });
//     }
//   });
// About image parallax
//   ScrollTrigger.create({
//     trigger: '.about',
//     start: 'top bottom',
//     end: 'bottom top',
//     onUpdate: self => {
//       gsap.set('.about-image-frame', { y: (self.progress - 0.5) * -40 });
//     }
//   });
// }

function initParallax() {
  // Hero parallax
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');

  if (hero && heroContent) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        gsap.set(heroContent, {
          y: self.progress * 80
        });
      }
    });
  }
}

  

/* ────────────────────────────────────────────
   14. INTERSECTION OBSERVER — Generic Fade
──────────────────────────────────────────── */
function initFadeObserver() {
  const elements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

/* ────────────────────────────────────────────
   15. FOOTER YEAR
──────────────────────────────────────────── */
function initFooter() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ────────────────────────────────────────────
   16. HOVER EFFECTS — Nav Gold Underline
──────────────────────────────────────────── */
function initHoverEffects() {
  // Project images tilt
  VanillaTilt.init(document.querySelectorAll('.project-img-wrap'), {
    max: 4,
    speed: 500,
    glare: true,
    'max-glare': 0.05,
  });

  // Service cards (already handled by CSS + Vanilla Tilt init in gallery)
  VanillaTilt.init(document.querySelectorAll('.service-card'), {
    max: 6,
    speed: 400,
    glare: false,
  });
}

/* ────────────────────────────────────────────
   17. FLOATING WHATSAPP BUTTON — Scroll Show
──────────────────────────────────────────── */
function initFloatWA() {
  const btn = document.querySelector('.float-wa');
  if (!btn) return;

  let visible = false;
  const onScroll = debounce(() => {
    const shouldShow = window.scrollY > 400;
    if (shouldShow !== visible) {
      visible = shouldShow;
      gsap.to(btn, {
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.7,
        duration: 0.4,
        ease: 'back.out(1.4)',
        pointerEvents: visible ? 'all' : 'none',
      });
    }
  }, 30);

  gsap.set(btn, { opacity: 0, scale: 0.7, pointerEvents: 'none' });
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ────────────────────────────────────────────
   18. SMOOTH ANCHOR LINKS
──────────────────────────────────────────── */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
      if (lenis) {
        lenis.scrollTo(target, { offset: -offset, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ────────────────────────────────────────────
   19. PROJECT ITEMS STAGGER
──────────────────────────────────────────── */
function initProjectAnimations() {
  document.querySelectorAll('.project-item').forEach((item) => {
    // Photo always slides in left → right, text always slides in right → left,
    // regardless of .project-item--reverse column order.
    gsap.fromTo(item.querySelector('.project-visual'),
      { opacity: 0, x: -80 },
      {
        opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 60%' }
      }
    );
    gsap.fromTo(item.querySelector('.project-content'),
      { opacity: 0, x: 80 },
      {
        opacity: 1, x: 0, duration: 1.1, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: item, start: 'top 60%' }
      }
    );
  });
}

/* ────────────────────────────────────────────
   20. IMAGE PLACEHOLDERS — Colored Gradients
     (used when real images don't exist yet)
──────────────────────────────────────────── */
function initPlaceholders() {
  // Add error handling for artwork images
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('error', () => {
      const idx = parseInt(img.closest('.gallery-item')?.dataset.index ?? 0);
      const hues = [30, 45, 200, 160, 280, 0, 60, 190];
      const hue = hues[idx % hues.length];
      img.style.display = 'none';

      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width:100%; padding-top:130%;
        background: linear-gradient(135deg,
          hsl(${hue},25%,78%) 0%,
          hsl(${hue + 20},20%,60%) 100%);
      `;
      img.parentElement.insertBefore(placeholder, img);
    });
  });
}

/* ────────────────────────────────────────────
   INIT — Run Everything
──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger); 
  // Prevent flash
  document.documentElement.classList.add('scroll-locked');

  initLenis();
  initLoader();
  initHeroCanvas();
  initHeroArtwork();
  initNav();
  initCursor();
  initMagnetic();
  initGallery();
  initGalleryFilters();
  initLightbox();
  initSwiper();
  initFadeObserver();
  initFooter();
  initHoverEffects();
  initFloatWA();
  initSmoothAnchors();
  initPlaceholders();

  // GSAP-dependent init after brief defer
  requestAnimationFrame(() => {
    initScrollAnimations();
    initParallax();
    initProjectAnimations();
  });
});
