// Navbar scroll & mobile toggle
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
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

// Back to top
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Typing effect
const titles = ['Desarrollador Web', 'Full Stack Developer', 'UI / UX Enthusiast', 'Problem Solver'];
let titleIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = titles[titleIndex];
  typedEl.textContent = deleting ? current.slice(0, charIndex - 1) : current.slice(0, charIndex + 1);
  deleting ? charIndex-- : charIndex++;
  if (!deleting && charIndex === current.length) { deleting = true; setTimeout(type, 1800); return; }
  if (deleting && charIndex === 0) { deleting = false; titleIndex = (titleIndex + 1) % titles.length; }
  setTimeout(type, deleting ? 60 : 90);
}
type();

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
    const delay = Math.min(siblings.indexOf(entry.target) * 80, 320);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Skill bars
const fillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const fill = entry.target.querySelector('.skill-fill');
    if (fill) fill.style.width = fill.dataset.width + '%';
    fillObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-card').forEach(card => fillObserver.observe(card));

// Count-up
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

// Contact form
const form = document.getElementById('contactForm');
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
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      showStatus('¡Mensaje enviado! Te responderé pronto.', 'success');
      form.reset();
    } else {
      showStatus('Hubo un error. Intenta de nuevo.', 'error');
    }
  } catch {
    showStatus('Sin conexión. Intenta de nuevo.', 'error');
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar mensaje';
});

function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = 'form-status ' + type;
  setTimeout(() => { formStatus.className = 'form-status'; formStatus.textContent = ''; }, 5000);
}
