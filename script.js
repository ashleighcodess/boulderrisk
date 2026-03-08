/* Boulder Risk Associates — Premium Interactions */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile Nav Toggle --- */
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* --- Header scroll effect --- */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* --- Scroll reveal with stagger --- */
  const faders = document.querySelectorAll('.fade-up');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (faders.length && !prefersReduced) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger siblings if inside a .stagger parent
          const parent = entry.target.parentElement;
          if (parent && parent.classList.contains('stagger')) {
            const siblings = Array.from(parent.querySelectorAll('.fade-up'));
            siblings.forEach((sib, i) => {
              setTimeout(() => sib.classList.add('visible'), i * 120);
            });
            siblings.forEach(s => observer.unobserve(s));
          } else {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    faders.forEach(el => observer.observe(el));
  } else {
    faders.forEach(el => el.classList.add('visible'));
  }

  /* --- Floating particles (hero) --- */
  const particlesContainer = document.querySelector('.particles');
  if (particlesContainer && !prefersReduced) {
    const count = 14;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = 3 + Math.random() * 5;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = (10 + Math.random() * 80) + '%';
      p.style.top = (30 + Math.random() * 60) + '%';
      p.style.setProperty('--dur', (6 + Math.random() * 6) + 's');
      p.style.setProperty('--delay', (Math.random() * 5) + 's');
      p.style.setProperty('--drift', (80 + Math.random() * 100) + 'px');
      p.style.setProperty('--o', (0.06 + Math.random() * 0.1).toFixed(2));
      particlesContainer.appendChild(p);
    }
  }

  /* --- Smooth counter for value numbers --- */
  const valueNums = document.querySelectorAll('.value-num');
  if (valueNums.length && !prefersReduced) {
    const numObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.textContent);
          if (!isNaN(target)) {
            let current = 0;
            const step = Math.max(1, Math.floor(target / 20));
            const interval = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(interval);
              }
              el.textContent = String(current).padStart(2, '0');
            }, 40);
          }
          numObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    valueNums.forEach(el => numObserver.observe(el));
  }

  /* --- Checklist item entrance stagger --- */
  const checklistItems = document.querySelectorAll('.checklist li');
  if (checklistItems.length && !prefersReduced) {
    const listObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('li');
          items.forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-12px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateX(0)';
            }, i * 80);
          });
          listObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.checklist').forEach(list => {
      listObserver.observe(list);
    });
  }

  /* --- Start logo sway after reveal animation --- */
  const heroLogo = document.querySelector('.hero-logo-mark');
  const heroShadow = document.querySelector('.hero-logo-shadow');
  if (heroLogo && !prefersReduced) {
    heroLogo.addEventListener('animationend', () => {
      heroLogo.classList.add('revealed');
      if (heroShadow) heroShadow.classList.add('revealed');
    }, { once: true });
  }

  /* --- Parallax on hero brand mark --- */
  const heroBrand = document.querySelector('.hero-brand');
  if (heroBrand && !prefersReduced) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < window.innerHeight) {
        const offset = scroll * 0.15;
        heroBrand.style.transform = `translateY(${offset}px)`;
      }
    }, { passive: true });
  }

  /* --- About page stat counters --- */
  const statNums = document.querySelectorAll('.about-stat-num[data-target]');
  if (statNums.length && !prefersReduced) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          const duration = 1200;
          const start = performance.now();
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          statObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => statObserver.observe(el));
  }

  /* --- Contact form feedback --- */
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent';
      btn.style.background = '#1a6b3c';
      btn.style.color = '#fff';
      btn.style.transform = 'scale(1.02)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.transform = '';
        form.reset();
      }, 3000);
    });
  }
});
