/* GoGo Wellness Clinic — main.js */

// ─── Nav scroll effect ────────────────────────────────────────────────────
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ─── Mobile menu ──────────────────────────────────────────────────────────
const burger    = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
const menuLinks  = mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu .btn');

burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!open));
  mobileMenu.classList.toggle('open', !open);
  mobileMenu.setAttribute('aria-hidden', String(open));
  document.body.style.overflow = open ? '' : 'hidden';
});

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

// ─── FAQ accordion — smooth height animation ──────────────────────────────
// Pull all answer panels out of `hidden` state on init; drive visibility
// via height + opacity so we can transition smoothly.
const EASE   = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DUR_IN  = 380; // ms expand
const DUR_OUT = 280; // ms collapse — shorter feels snappier

function initFaq() {
  document.querySelectorAll('.faq__a').forEach(el => {
    // Remove native hidden so display:none doesn't block transitions
    el.removeAttribute('hidden');
    el.style.overflow   = 'hidden';
    el.style.height     = '0px';
    el.style.opacity    = '0';
    el.style.marginTop  = '0px';
    el.style.transition = `height ${DUR_IN}ms ${EASE}, opacity ${DUR_IN}ms ease, margin-top ${DUR_IN}ms ${EASE}`;
  });
}

function expandPanel(el) {
  // Measure natural height, then animate to it
  el.style.transition = `height ${DUR_IN}ms ${EASE}, opacity ${DUR_IN}ms ease, margin-top ${DUR_IN}ms ${EASE}`;
  const target = el.scrollHeight;
  requestAnimationFrame(() => {
    el.style.height    = target + 'px';
    el.style.opacity   = '1';
    el.style.marginTop = '0.25rem';
  });
  // After expand, let height become auto so it adapts to content changes
  el.addEventListener('transitionend', function onEnd(e) {
    if (e.propertyName !== 'height') return;
    el.style.height = 'auto';
    el.removeEventListener('transitionend', onEnd);
  });
}

function collapsePanel(el) {
  // Lock to current px height first so transition has a start point
  el.style.height = el.getBoundingClientRect().height + 'px';
  el.style.transition = `height ${DUR_OUT}ms ${EASE}, opacity ${DUR_OUT * 0.8}ms ease, margin-top ${DUR_OUT}ms ${EASE}`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.height    = '0px';
      el.style.opacity   = '0';
      el.style.marginTop = '0px';
    });
  });
}

initFaq();

document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';

    // Collapse every open panel
    document.querySelectorAll('.faq__q[aria-expanded="true"]').forEach(openBtn => {
      openBtn.setAttribute('aria-expanded', 'false');
      collapsePanel(openBtn.nextElementSibling);
    });

    // If this one was closed, open it
    if (!isExpanded) {
      btn.setAttribute('aria-expanded', 'true');
      expandPanel(btn.nextElementSibling);
    }
  });
});

// ─── Button press feedback (scale) ────────────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousedown', () => {
    btn.style.transform = 'scale(0.96) translateY(0)';
  });
  ['mouseup', 'mouseleave'].forEach(evt =>
    btn.addEventListener(evt, () => {
      btn.style.transform = '';
    })
  );
  // Touch equivalents
  btn.addEventListener('touchstart', () => {
    btn.style.transform = 'scale(0.96)';
  }, { passive: true });
  btn.addEventListener('touchend', () => {
    btn.style.transform = '';
  });
});

// ─── Scroll reveal ────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

const revealSelectors = [
  '.service-card',
  '.testimonial-card',
  '.about__text',
  '.about__images',
  '.contact__info',
  '.contact__form',
  '.stats__item',
  '.faq__item',
];
revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    if (i < 3) el.classList.add(`reveal-delay-${i + 1}`);
    revealObserver.observe(el);
  });
});

// ─── Form validation + submit ──────────────────────────────────────────────
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function showError(input, msg) {
  input.classList.add('error');
  const errEl = input.parentElement.querySelector('.form-error');
  if (errEl) errEl.textContent = msg;
}
function clearError(input) {
  input.classList.remove('error');
  const errEl = input.parentElement.querySelector('.form-error');
  if (errEl) errEl.textContent = '';
}

form.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('blur', () => {
    if (el.required && !el.value.trim()) {
      showError(el, 'This field is required.');
    } else if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
      showError(el, 'Please enter a valid email address.');
    } else {
      clearError(el);
    }
  });
  el.addEventListener('input', () => clearError(el));
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;

  const name  = form.querySelector('#name');
  const email = form.querySelector('#email');

  if (!name.value.trim())  { showError(name,  'Please enter your name.');  valid = false; }
  if (!email.value.trim()) { showError(email, 'Please enter your email.'); valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showError(email, 'Please enter a valid email address.');
    valid = false;
  }

  if (!valid) { form.querySelector('.error')?.focus(); return; }

  const btnText    = submitBtn.querySelector('.btn__text');
  const btnLoading = submitBtn.querySelector('.btn__loading');
  submitBtn.disabled = true;
  btnText.hidden    = true;
  btnLoading.hidden = false;

  await new Promise(r => setTimeout(r, 1500));

  submitBtn.hidden   = true;
  formSuccess.hidden = false;
  form.reset();
});

// ─── Smooth scroll with nav offset ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target || id === '#') return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
