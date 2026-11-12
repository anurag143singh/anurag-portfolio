const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const projectData = {
  lpg: {
    kicker: 'EMBEDDED SYSTEMS · IOT · TEAM NEXORA',
    title: 'IoT LPG Safety & Emergency Response',
    html: `<p>An ESP32-based educational prototype for monitoring gas, temperature and flame conditions, with local alerts and remote visibility through Blynk. LinkedIn describes the work as part of Team NEXORA during the Euphoria GenX internship.</p><h3>What is documented</h3><ul><li>MQ-6, DHT11 and IR flame sensing, alongside OLED status, buzzer, LEDs, relay, fan and an MG90S servo for model shut-off.</li><li>The public GitHub repository documents local response logic and Blynk telemetry. It is a fork of riteshjana123/LPG-Security-System; upstream work must be credited and Anurag’s specific changes confirmed before claiming sole authorship.</li><li>LinkedIn names Prachi Sinha as a teammate and Kaustav Mahatab Chatterjee as mentor.</li></ul><h3>Scope</h3><p>LinkedIn project media shows the prototype assembled and demonstrated. It is an educational prototype, not certified gas-safety equipment and not intended for live LPG installations.</p>`,
    links: [['Open GitHub repository', 'https://github.com/anurag143singh/LPG-Security-System'], ['Open LinkedIn profile', 'https://www.linkedin.com/in/anurag-singh-31b87b2a1']]
  },
  sentinel: {
    kicker: 'SOFTWARE · WINDOWS DESKTOP',
    title: 'PC Sentinel VX',
    html: `<p>A Windows desktop project documented as a PC health monitoring and optimization application. Its public repository describes CPU, RAM, disk, network, battery and temperature views, a health status and Lite, Balanced and Performance modes.</p><h3>Published project information</h3><ul><li>The repository lists v1.0.2 with installer and portable ZIP downloads for Windows 10/11.</li><li>The README describes optional voice commands, local profile storage and a local-first approach. These are repository statements; this portfolio has not independently tested the application.</li><li>The public repository snapshot reviewed for this portfolio showed a README but no source files, so the implementation cannot be assessed from those contents.</li></ul><h3>Media</h3><p>Selected dashboard and development images are from LinkedIn posts. The video preview opens the original LinkedIn profile.</p>`,
    links: [['Open GitHub repository', 'https://github.com/anurag143singh/Anurag-PC-sentinel-V'], ['View v1.0.2 release', 'https://github.com/anurag143singh/Anurag-PC-sentinel-V/releases/tag/v1.0.2'], ['Open LinkedIn profile', 'https://www.linkedin.com/in/anurag-singh-31b87b2a1']]
  },
  laser: {
    kicker: 'EMBEDDED SYSTEMS · LINKEDIN PROJECT',
    title: 'Laser Security System',
    html: `<p>A LinkedIn post describes an Arduino Nano system with a laser module, LDR sensor and GSM module. When the beam is interrupted, the Arduino detects the change and activates a buzzer alert.</p><h3>People & learning</h3><p>The post names Kushan Prasad, Ritesh Jana and Prachi Sinha as teammates, and describes hands-on learning in Arduino programming, sensor interfacing, circuit design and troubleshooting.</p><h3>What still needs to be added</h3><p>TODO: source code, exact GSM behavior, Anurag’s personal contribution, circuit diagram, test results and a project demonstration link.</p>`,
    links: [['Open LinkedIn profile', 'https://www.linkedin.com/in/anurag-singh-31b87b2a1']]
  }
};

const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('anurag-portfolio-theme');
if (savedTheme === 'light' || savedTheme === 'dark') document.body.dataset.theme = savedTheme;
function updateThemeLabel() {
  const dark = document.body.dataset.theme === 'dark' || (!document.body.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  themeToggle?.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
}
updateThemeLabel();
themeToggle?.addEventListener('click', () => {
  const dark = document.body.dataset.theme === 'dark' || (!document.body.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  document.body.dataset.theme = dark ? 'light' : 'dark';
  localStorage.setItem('anurag-portfolio-theme', document.body.dataset.theme);
  updateThemeLabel();
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('is-open', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('img[src^="assets/"]').forEach(image => {
  const file = image.getAttribute('src').split('/').pop();
  const frame = image.closest('.image-frame') || image.parentElement;
  if (!frame) return;
  frame.classList.add('has-placeholder');
  frame.style.setProperty('--placeholder', `url("assets/thumbs/${file}.jpg")`);
  const reveal = () => frame.classList.add('is-loaded');
  if (image.complete && image.naturalWidth) reveal();
  else image.addEventListener('load', reveal, { once: true });
});

const projectModal = document.querySelector('#project-dialog');
const modalTitle = document.querySelector('#project-modal-title');
const modalKicker = document.querySelector('#project-modal-kicker');
const modalContent = document.querySelector('#project-modal-content');
document.querySelectorAll('[data-project]').forEach(card => card.querySelector('.project-open')?.addEventListener('click', () => {
  const project = projectData[card.dataset.project];
  if (!project) return;
  modalKicker.textContent = project.kicker;
  modalTitle.textContent = project.title;
  modalContent.innerHTML = project.html;
  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  project.links.forEach(([label, href]) => {
    const link = document.createElement('a');
    link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = `${label} ↗`;
    actions.append(link);
  });
  modalContent.append(actions);
  projectModal.showModal();
}));

document.querySelectorAll('.dialog-close').forEach(button => button.addEventListener('click', () => button.closest('dialog')?.close()));
[projectModal, document.querySelector('#media-lightbox')].forEach(dialog => dialog?.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
}));

const lightbox = document.querySelector('#media-lightbox');
document.querySelectorAll('[data-image]').forEach(card => card.addEventListener('click', () => {
  const source = card.querySelector('img');
  document.querySelector('#lightbox-image').src = card.dataset.image;
  document.querySelector('#lightbox-image').alt = source?.alt || 'Portfolio image';
  document.querySelector('#lightbox-caption').textContent = card.dataset.caption || '';
  lightbox.showModal();
}));

const lensMessages = {
  all: 'Showing the complete engineering portfolio.',
  core: 'Showing core electronics, embedded and hardware work.',
  software: 'Showing IT, software and automation work.'
};
const lensMessage = document.querySelector('.lens-message');
document.querySelectorAll('.lens-card').forEach(button => button.addEventListener('click', () => {
  const view = button.dataset.view;
  document.querySelectorAll('.lens-card').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-category]').forEach(item => {
    item.hidden = view !== 'all' && item.dataset.category !== 'all' && item.dataset.category !== view;
  });
  lensMessage.textContent = lensMessages[view];
  updateTimeline();
}));

const progress = document.querySelector('.page-progress span');
const trace = document.querySelector('.page-trace path');
const timeline = document.querySelector('.timeline');
function updateTimeline() {
  if (!timeline) return;
  const rect = timeline.getBoundingClientRect();
  const amount = Math.max(0, Math.min(rect.height, innerHeight * .66 - rect.top));
  timeline.style.setProperty('--timeline-fill', `${rect.height ? amount / rect.height * 100 : 0}%`);
}
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const amount = max > 0 ? scrollY / max : 0;
  progress.style.transform = `scaleX(${amount})`;
  if (trace) trace.style.strokeDashoffset = String(1 - amount);
  updateTimeline();
}
addEventListener('scroll', updateScroll, { passive: true });
addEventListener('resize', updateScroll);
updateScroll();

const revealItems = document.querySelectorAll('[data-reveal]');
revealItems.forEach((item, index) => item.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`));
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('revealed'));

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.getAttribute('href') === `#${entry.target.id}` ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
  }), { rootMargin: '-30% 0px -62% 0px' });
  sections.forEach(section => spy.observe(section));
}

if (!reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const glow = document.querySelector('.cursor-glow');
  addEventListener('pointermove', event => { if (glow) { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; } });
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.setProperty('--tilt-x', `${-y * 4}deg`);
      card.style.setProperty('--tilt-y', `${x * 4}deg`);
    });
    card.addEventListener('pointerleave', () => { card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg'); });
  });
  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      const x = Math.max(-7, Math.min(7, (event.clientX - rect.left - rect.width / 2) * .12));
      const y = Math.max(-7, Math.min(7, (event.clientY - rect.top - rect.height / 2) * .12));
      button.style.setProperty('--mag-x', `${x}px`);
      button.style.setProperty('--mag-y', `${y}px`);
    });
    button.addEventListener('pointerleave', () => { button.style.setProperty('--mag-x', '0px'); button.style.setProperty('--mag-y', '0px'); });
  });
}

// Hero work slideshow: pauses on hover/focus and provides direct controls.
const heroSlides = [...document.querySelectorAll('.hero-slide')];
const slideDots = [...document.querySelectorAll('.slide-dots button')];
const slidePause = document.querySelector('.slide-pause');
let activeSlide = 0;
let slideTimer;
function showSlide(next) {
  if (!heroSlides.length) return;
  activeSlide = (next + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, index) => slide.classList.toggle('is-active', index === activeSlide));
  slideDots.forEach((dot, index) => {
    if (index === activeSlide) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
}
function startSlideshow() {
  clearInterval(slideTimer);
  if (!reduceMotion && slidePause?.dataset.paused !== 'true') slideTimer = setInterval(() => showSlide(activeSlide + 1), 5200);
}
document.querySelector('.slide-prev')?.addEventListener('click', () => { showSlide(activeSlide - 1); startSlideshow(); });
document.querySelector('.slide-next')?.addEventListener('click', () => { showSlide(activeSlide + 1); startSlideshow(); });
slideDots.forEach((dot, index) => dot.addEventListener('click', () => { showSlide(index); startSlideshow(); }));
slidePause?.addEventListener('click', () => {
  const paused = slidePause.dataset.paused !== 'true';
  slidePause.dataset.paused = String(paused);
  slidePause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
  slidePause.textContent = paused ? '▶' : 'Ⅱ';
  startSlideshow();
});
document.querySelector('.hero-art')?.addEventListener('pointerenter', () => clearInterval(slideTimer));
document.querySelector('.hero-art')?.addEventListener('pointerleave', startSlideshow);
document.querySelector('.hero-art')?.addEventListener('focusin', () => clearInterval(slideTimer));
document.querySelector('.hero-art')?.addEventListener('focusout', startSlideshow);
startSlideshow();

// Achievement updates are saved locally and exported as achievements.json for static hosting.
const achievementForm = document.querySelector('#achievement-form');
const achievementList = document.querySelector('#achievement-list');
const updateStatus = document.querySelector('#update-status');
const updateStorageKey = 'anurag-portfolio-achievements-v1';
let achievementUpdates = [];
function safeUpdates(items) {
  return Array.isArray(items) ? items.filter(item => item && typeof item.title === 'string' && typeof item.description === 'string').slice(0, 60) : [];
}
function drawUpdates() {
  document.querySelectorAll('[data-user-achievement="true"]').forEach(card => card.remove());
  achievementUpdates.forEach(item => {
    const card = document.createElement('article');
    card.dataset.userAchievement = 'true';
    card.dataset.reveal = '';
    if (item.image) {
      const image = document.createElement('img');
      image.src = item.image; image.alt = item.title; image.loading = 'lazy';
      card.append(image);
    }
    const stamp = document.createElement('span'); stamp.textContent = item.date || 'NEW'; card.append(stamp);
    const category = document.createElement('p'); category.textContent = item.category || 'ACHIEVEMENT'; card.append(category);
    const title = document.createElement('h3'); title.textContent = item.title; card.append(title);
    const story = document.createElement('p'); story.className = 'user-achievement-story'; story.textContent = item.description; card.append(story);
    achievementList.append(card);
    if (!reduceMotion) requestAnimationFrame(() => card.classList.add('revealed'));
  });
}
function persistUpdates() {
  localStorage.setItem(updateStorageKey, JSON.stringify(achievementUpdates));
  drawUpdates();
}
try { achievementUpdates = safeUpdates(JSON.parse(localStorage.getItem(updateStorageKey) || '[]')); } catch { achievementUpdates = []; }
fetch('achievements.json').then(response => response.ok ? response.json() : []).then(items => {
  const published = safeUpdates(items);
  if (published.length) {
    const known = new Set(achievementUpdates.map(item => `${item.title}|${item.date}`));
    achievementUpdates = [...published.filter(item => !known.has(`${item.title}|${item.date}`)), ...achievementUpdates];
    persistUpdates();
  } else drawUpdates();
}).catch(drawUpdates);
achievementForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(achievementForm);
  const file = form.get('image');
  let image = '';
  if (file instanceof File && file.size) {
    if (file.size > 1500000) { updateStatus.textContent = 'Please choose an image smaller than 1.5 MB.'; return; }
    image = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
  }
  achievementUpdates.unshift({title: String(form.get('title')).trim(), category: String(form.get('category')).trim(), date: String(form.get('date')).trim(), description: String(form.get('description')).trim(), image});
  persistUpdates(); achievementForm.reset();
  updateStatus.textContent = 'Added to this browser’s preview. Download achievements.json to keep it with the site and publish it.';
});
document.querySelector('#export-updates')?.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(achievementUpdates, null, 2)], {type:'application/json'});
  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'achievements.json'; link.click(); URL.revokeObjectURL(link.href);
  updateStatus.textContent = 'Downloaded achievements.json. Replace the file in your site folder, then upload the updated site to GitHub Pages.';
});
document.querySelector('#import-updates')?.addEventListener('change', async event => {
  const file = event.target.files?.[0]; if (!file) return;
  try { achievementUpdates = safeUpdates(JSON.parse(await file.text())); persistUpdates(); updateStatus.textContent = `Loaded ${achievementUpdates.length} saved update(s) into the preview.`; }
  catch { updateStatus.textContent = 'That file is not a valid achievements.json update file.'; }
  event.target.value = '';
});

