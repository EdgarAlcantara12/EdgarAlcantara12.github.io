// ── CUSTOM CURSOR ──
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = -200, mouseY = -200;
let ringX  = -200, ringY  = -200;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateCursor() {
  ringX += (mouseX - ringX) * 0.11;
  ringY += (mouseY - ringY) * 0.11;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
})();

const hoverTargets = 'a, button, .skill-card, .project-card, .contact-card, .diagnostico-banner, .btn-icon';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => { cursorDot.classList.add('hovering'); cursorRing.classList.add('hovering'); });
  el.addEventListener('mouseleave', () => { cursorDot.classList.remove('hovering'); cursorRing.classList.remove('hovering'); });
});

// ── MAGNETIC BUTTONS ──
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.18;
    const y = (e.clientY - r.top  - r.height / 2) * 0.18;
    btn.style.transform = `translate(${x}px, ${y - 2}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ── HERO BLOB PARALLAX ──
const hero  = document.getElementById('hero');
const blob1 = document.getElementById('blob1');
const blob2 = document.getElementById('blob2');

if (hero && blob1 && blob2) {
  hero.addEventListener('mousemove', (e) => {
    const r  = hero.getBoundingClientRect();
    const xf = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const yf = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    blob1.style.translate = `${xf * -22}px ${yf * -22}px`;
    blob2.style.translate  = `${xf *  16}px ${yf *  16}px`;
  });
  hero.addEventListener('mouseleave', () => {
    blob1.style.translate = '0px 0px';
    blob2.style.translate  = '0px 0px';
  });
}

// ── NAVBAR SCROLL & ACTIVE SECTION ──
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── BACK TO TOP ──
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── TYPING EFFECT ──
const titles = ['Desarrollador Web', 'Full Stack Developer', 'UI / UX Enthusiast', 'Problem Solver'];
let titleIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = titles[titleIndex];
  typedEl.textContent = deleting ? current.slice(0, charIndex - 1) : current.slice(0, charIndex + 1);
  deleting ? charIndex-- : charIndex++;
  if (!deleting && charIndex === current.length) { deleting = true; setTimeout(type, 1800); return; }
  if (deleting && charIndex === 0) { deleting = false; titleIndex = (titleIndex + 1) % titles.length; }
  setTimeout(type, deleting ? 55 : 85);
}
type();

// ── SCROLL REVEAL ──
const allReveal = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale')].filter(el => !el.classList.contains('visible'));
    const delay = Math.min(siblings.indexOf(entry.target) * 80, 320);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(allReveal).forEach(el => revealObserver.observe(el));

// ── SKILL BARS ──
const fillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const fill = entry.target.querySelector('.skill-fill');
    if (fill) fill.style.width = fill.dataset.width + '%';
    fillObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-card').forEach(card => fillObserver.observe(card));

// ── COUNT-UP ──
function countUp(el) {
  const target = +el.dataset.target;
  let current = 0;
  const step = target / (1400 / 16);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target; clearInterval(timer); }
    else el.textContent = Math.floor(current);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-num').forEach(countUp);
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) statsObserver.observe(statsEl);

// ── CONTACT FORM ──
const form       = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { name, email, message } = form;
  if (!name.value.trim() || !message.value.trim()) { showStatus('Completa los campos requeridos.', 'error'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showStatus('Email inválido.', 'error'); return; }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando…';

  try {
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
    if (res.ok) { showStatus('¡Mensaje enviado! Te responderé pronto.', 'success'); form.reset(); }
    else { showStatus('Hubo un error. Intenta de nuevo.', 'error'); }
  } catch { showStatus('Sin conexión. Intenta de nuevo.', 'error'); }

  btn.disabled = false;
  btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar mensaje';
});

function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = 'form-status ' + type;
  setTimeout(() => { formStatus.className = 'form-status'; formStatus.textContent = ''; }, 5000);
}
