// ── CUSTOM CURSOR (smooth + fluid) ──
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = -200, mouseY = -200;
let dotX   = -200, dotY   = -200;
let ringX  = -200, ringY  = -200;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function animateCursor() {
  // Dot follows instantly
  dotX  += (mouseX - dotX)  * 0.55;
  dotY  += (mouseY - dotY)  * 0.55;
  // Ring lags behind smoothly
  ringX += (mouseX - ringX) * 0.10;
  ringY += (mouseY - ringY) * 0.10;

  cursorDot.style.left  = dotX  + 'px';
  cursorDot.style.top   = dotY  + 'px';
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
    const x = (e.clientX - r.left - r.width  / 2) * 0.2;
    const y = (e.clientY - r.top  - r.height / 2) * 0.2;
    btn.style.transform = `translate(${x}px, ${y - 2}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ── PARTICLE CANVAS ──
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COUNT       = window.innerWidth < 768 ? 45 : 80;
const CONNECT     = 130;
const REPEL_R     = 110;
const REPEL_STR   = 0.55;
const C           = [56, 189, 248]; // sky-400 (#38bdf8)

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x  = Math.random() * canvas.width;
    this.y  = init ? Math.random() * canvas.height : -4;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r  = Math.random() * 1.4 + 0.4;
    this.a  = Math.random() * 0.35 + 0.15;
  }
  update() {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dist < REPEL_R) {
      const f = (REPEL_R - dist) / REPEL_R;
      this.vx += (dx / dist) * f * REPEL_STR;
      this.vy += (dy / dist) * f * REPEL_STR;
    }
    this.vx *= 0.975;
    this.vy *= 0.975;
    this.x  += this.vx;
    this.y  += this.vy;
    if (this.x < -10) this.x = canvas.width  + 10;
    if (this.x > canvas.width  + 10) this.x = -10;
    if (this.y < -10) this.y = canvas.height + 10;
    if (this.y > canvas.height + 10) this.y = -10;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${C[0]},${C[1]},${C[2]},${this.a})`;
    ctx.fill();
  }
}

const particles = Array.from({ length: COUNT }, () => new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < CONNECT) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${C[0]},${C[1]},${C[2]},${(1 - d / CONNECT) * 0.13})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    }
  }
}

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
})();

// ── HERO BLOB PARALLAX ──
const hero  = document.getElementById('hero');
const blob1 = document.getElementById('blob1');
const blob2 = document.getElementById('blob2');

if (hero && blob1 && blob2) {
  hero.addEventListener('mousemove', (e) => {
    const r  = hero.getBoundingClientRect();
    const xf = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const yf = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    blob1.style.translate = `${xf * -24}px ${yf * -24}px`;
    blob2.style.translate = `${xf *  18}px ${yf *  18}px`;
  });
  hero.addEventListener('mouseleave', () => {
    blob1.style.translate = '0px 0px';
    blob2.style.translate = '0px 0px';
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
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 120) current = sec.id; });
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
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale')].filter(el => !el.classList.contains('visible'));
    const delay = Math.min(siblings.indexOf(entry.target) * 80, 320);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => revealObserver.observe(el));

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
