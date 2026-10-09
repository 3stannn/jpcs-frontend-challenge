'use strict';

const filters = [...document.querySelectorAll('[data-filter]')];
const activities = [...document.querySelectorAll('.activity-item')];
const filterStatus = document.querySelector('#filter-status');

filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });

    activities.forEach(card => {
      card.hidden = button.dataset.filter !== 'all' &&
        card.dataset.category !== button.dataset.filter;
    });

    const count = activities.filter(card => !card.hidden).length;
    filterStatus.textContent = `${count} ${count === 1 ? 'update' : 'updates'} shown.`;
  });
});

const navigation = document.querySelector('#navigation');
const links = [...document.querySelectorAll('.navbar .nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const backTop = document.querySelector('#back-top');
const brand = document.querySelector('.navbar-brand');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let scrollPending = false;

links.forEach(link => {
  link.addEventListener('click', () => {
    if (!navigation.classList.contains('show')) return;

    navigation.addEventListener('hidden.bs.collapse', () => {
      const section = document.querySelector(link.hash);
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
    }, { once: true });
    bootstrap.Collapse.getOrCreateInstance(navigation).hide();
  });
});

function updateNavigation() {
  let active = sections[0].id;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 150) active = section.id;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) {
    active = sections.at(-1).id;
  }

  links.forEach(link => {
    const selected = link.hash === `#${active}`;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  backTop.hidden = window.scrollY < 600;
  scrollPending = false;
}

window.addEventListener('scroll', () => {
  if (scrollPending) return;
  scrollPending = true;
  requestAnimationFrame(updateNavigation);
}, { passive: true });
window.addEventListener('resize', updateNavigation);

const backTopCar = document.querySelector('#back-top-car');
backTopCar.addEventListener('animationend', () => {
  backTopCar.hidden = true;
  backTopCar.classList.remove('is-rising');
});
backTop.addEventListener('click', () => {
  if (!reducedMotion.matches) {
    backTopCar.classList.remove('is-rising');
    backTopCar.hidden = false;
    void backTopCar.offsetWidth;
    backTopCar.classList.add('is-rising');
  }
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  brand.focus({ preventScroll: true });
});

const music = document.querySelector('#hero-music');
const musicToggle = document.querySelector('#music-toggle');
const musicLabel = document.querySelector('#music-label');
const musicIcon = document.querySelector('#music-icon');
const musicStatus = document.querySelector('#music-status');

function updateMusicControl() {
  const playing = !music.paused && !music.ended;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing
    ? 'Pause opening titles music' : 'Play opening titles music');
  musicLabel.textContent = playing ? 'Pause music' : 'Play music';
  musicIcon.textContent = playing ? 'Ⅱ' : '▶';
}

musicToggle.addEventListener('click', async () => {
  if (!music.paused) {
    music.pause();
    return;
  }
  musicStatus.textContent = '';
  try {
    await music.play();
  } catch {
    musicStatus.textContent = 'Music could not be played. Please try again.';
    updateMusicControl();
  }
});
['play', 'pause', 'ended'].forEach(event => music.addEventListener(event, updateMusicControl));
music.addEventListener('error', () => {
  musicStatus.textContent = 'Music is currently unavailable.';
  updateMusicControl();
});

const clickSound = document.querySelector('#click-sound');
window.addEventListener('click', () => {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => { });
});

document.querySelector('#year').textContent = new Date().getFullYear();
updateNavigation();
