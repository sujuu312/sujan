/* =============================================
   NEXORA BUSINESS WEBSITE – JAVASCRIPT
   ============================================= */

'use strict';

// ------- NAVBAR: scroll behavior -------
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ------- SMOOTH SCROLL for anchor links -------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// ------- SCROLL REVEAL (IntersectionObserver) -------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ------- TESTIMONIAL SLIDER -------
const track  = document.getElementById('testimonial-track');
const dots   = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('slider-prev');
const nextBtn = document.getElementById('slider-next');
const totalSlides = dots.length;
let currentSlide = 0;
let autoPlayTimer = null;

function goToSlide(index) {
  currentSlide = (index + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function startAutoPlay() {
  stopAutoPlay();
  autoPlayTimer = setInterval(() => { goToSlide(currentSlide + 1); }, 5000);
}
function stopAutoPlay() {
  if (autoPlayTimer) clearInterval(autoPlayTimer);
}

prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoPlay(); });
nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoPlay(); });

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index));
    startAutoPlay();
  });
});

// Pause on hover
track.addEventListener('mouseenter', stopAutoPlay);
track.addEventListener('mouseleave', startAutoPlay);

// Touch/swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    startAutoPlay();
  }
});

// Init
goToSlide(0);
startAutoPlay();

// ------- CONTACT FORM -------
const contactForm  = document.getElementById('contact-form');
const formSuccess  = document.getElementById('form-success');
const submitBtn    = document.getElementById('submit-btn');

contactForm.addEventListener('submit', function (e) {
  // Basic validation
  const inputs = contactForm.querySelectorAll('[required]');
  let valid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      input.style.borderColor = '#ef4444';
      input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
    }
  });
  if (!valid) {
    e.preventDefault();
    return;
  }

  // Form will submit to Formspree
  // Success handling can be done via Formspree redirect or custom page
});

// ------- ANIMATED STAT COUNTERS (on first scroll into view) -------
function animateCounter(el, target, suffix) {
  const duration = 1800;
  const step     = 16;
  const steps    = duration / step;
  let current   = 0;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.innerHTML = Math.floor(current) + suffix;
  }, step);
}

const statsSection = document.querySelector('.hero-stats');
let countersStarted = false;

const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    document.querySelectorAll('.stat').forEach(stat => {
      const numEl  = stat.querySelector('.stat-number');
      if (!numEl) return;
      const plusEl = stat.querySelector('.stat-plus');
      const suffix = plusEl ? plusEl.dataset.suffix || '' : '';
      // Read target from data attribute or parse current text
      const raw = numEl.textContent.replace(/[^0-9]/g, '');
      const target = parseInt(raw, 10);
      if (isNaN(target)) return;
      animateCounter(numEl, target, plusEl ? plusEl.outerHTML : '');
    });
  }
}, { threshold: 0.5 });

if (statsSection) statsObserver.observe(statsSection);

// ------- SUBTLE PARALLAX on hero bg -------
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
}

// ------- ACTIVE NAV LINK highlight on scroll -------
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id ? '#eef2ff' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
