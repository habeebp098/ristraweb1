const nav = document.querySelector('.primary-nav');
const toggle = document.querySelector('.nav-toggle');
if (nav && toggle) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  nav.querySelectorAll('#nav-links a').forEach(link => link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

const carousel = document.querySelector('.hero-slides');
if (carousel) {
const slides = [...carousel.querySelectorAll('.hero-slide')];
const indicators = [...document.querySelectorAll('.slide-indicator')];
const counter = document.querySelector('.slide-count');
const playButton = document.querySelector('.slide-play');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeSlide = 0;
let timer;
let rotating = !reducedMotion.matches;
const rotationDelay = 8500;

function paintSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    const active = i === activeSlide;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  indicators.forEach((indicator, i) => {
    const active = i === activeSlide;
    indicator.classList.toggle('is-active', active);
    indicator.setAttribute('aria-current', String(active));
  });
  counter.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
}

function stopTimer() {
  window.clearInterval(timer);
  timer = undefined;
}
function startTimer() {
  stopTimer();
  if (rotating && !reducedMotion.matches) {
    timer = window.setInterval(() => paintSlide(activeSlide + 1), rotationDelay);
  }
  playButton.textContent = rotating ? 'Ⅱ' : '▶';
  playButton.setAttribute('aria-label', rotating ? 'Pause image rotation' : 'Play image rotation');
}

document.querySelectorAll('[data-slide-step]').forEach(button => button.addEventListener('click', () => {
  paintSlide(activeSlide + Number(button.dataset.slideStep));
  startTimer();
}));
indicators.forEach(button => button.addEventListener('click', () => {
  paintSlide(Number(button.dataset.slideTo));
  startTimer();
}));
playButton.addEventListener('click', () => {
  rotating = !rotating;
  startTimer();
});
reducedMotion.addEventListener?.('change', event => {
  if (event.matches) rotating = false;
  startTimer();
});
startTimer();
}
