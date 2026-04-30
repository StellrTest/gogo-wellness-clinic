/* GoGo Wellness Clinic — main.js */

// Nav scroll effect
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const burger = document.getElementById('navBurger');
const menu   = document.getElementById('mobileMenu');
const menuLinks = menu.querySelectorAll('.mobile-menu__link, .mobile-menu .btn');

burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!open));
  menu.classList.toggle('open', !open);
  menu.setAttribute('aria-hidden', String(open));
  document.body.style.overflow = open ? '' : 'hidden';
});

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

// FAQ accordion
document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const answer   = btn.nextElementSibling;

    // Close all others
    document.querySelectorAll('.faq__q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.hidden = true;
    });

    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
    }
  });
});

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

const revealEls = [
  '.service-card',
  '.testimonial-card',
  '.about__text',
  '.about__images',
  '.contact__info',
  '.contact__form',
  '.stats__item',
  '.faq__item',
];
revealEls.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    if (i < 3) el.classList.add(`reveal-delay-${i + 1}`);
    revealObserver.observe(el);
  });
});

// Form validation + submit
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
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

  if (!name.value.trim()) { showError(name, 'Please enter your name.'); valid = false; }
  if (!email.value.trim()) { showError(email, 'Please enter your email.'); valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showError(email, 'Please enter a valid email address.');
    valid = false;
  }

  if (!valid) {
    form.querySelector('.error')?.focus();
    return;
  }

  // Loading state
  const btnText    = submitBtn.querySelector('.btn__text');
  const btnLoading = submitBtn.querySelector('.btn__loading');
  submitBtn.disabled = true;
  btnText.hidden    = true;
  btnLoading.hidden = false;

  // Simulate async (replace with real fetch to backend)
  await new Promise(r => setTimeout(r, 1500));

  submitBtn.hidden   = true;
  formSuccess.hidden = false;
  form.reset();
});

// Smooth scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72) - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
