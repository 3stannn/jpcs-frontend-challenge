'use strict';

document.querySelectorAll('[data-filter]').forEach(button =>
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });

    let count = 0;

    document.querySelectorAll('.activity-item').forEach(card => {
      card.hidden =
        button.dataset.filter !== 'all' &&
        card.dataset.category !== button.dataset.filter;

      if (!card.hidden) count++;
    });

    document.querySelector('#filter-status').textContent =
      `${count} ${count === 1 ? 'activity' : 'activities'} shown.`;
  })
);

const navigation = document.querySelector('#navigation');
const links = [...document.querySelectorAll('.navbar .nav-link')];

links.forEach(link =>
  link.addEventListener('click', () => {
    if (navigation.classList.contains('show')) {
      navigation.addEventListener(
        'hidden.bs.collapse',
        () => {
          const section = document.querySelector(link.hash);
          section.setAttribute('tabindex', '-1');
          section.focus({ preventScroll: true });
        },
        { once: true }
      );

      bootstrap.Collapse.getOrCreateInstance(navigation).hide();
    }
  })
);

const sections = [...document.querySelectorAll('main section[id]')];
const backTop = document.querySelector('#back-top');
let pending = false;

function updateNavigation() {
  let active = sections[0].id;

  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 150) active = section.id;
  }

  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 5
  ) {
    active = sections.at(-1).id;
  }

  links.forEach(link => {
    const selected = link.hash === `#${active}`;
    link.classList.toggle('active', selected);

    if (selected) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  backTop.hidden = window.scrollY < 600;
  pending = false;
}

window.addEventListener(
  'scroll',
  () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(updateNavigation);
    }
  },
  { passive: true }
);

window.addEventListener('resize', updateNavigation);

const backTopCar = document.querySelector('#back-top-car');

backTopCar.addEventListener('animationend', () => {
  backTopCar.hidden = true;
  backTopCar.classList.remove('is-rising');
});

backTop.addEventListener('click', () => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    backTopCar.classList.remove('is-rising');
    backTopCar.hidden = false;
    // Restart the effect when the button is clicked again.
    void backTopCar.offsetWidth;
    backTopCar.classList.add('is-rising');
  }
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth'
  });

  document.querySelector('.navbar-brand').focus({ preventScroll: true });
});

document.querySelector('#year').textContent = new Date().getFullYear();
updateNavigation();

const music = document.querySelector('#hero-music');
const musicToggle = document.querySelector('#music-toggle');
const musicLabel = document.querySelector('#music-label');
const musicIcon = document.querySelector('#music-icon');
const musicStatus = document.querySelector('#music-status');

function updateMusicControl() {
  const playing = !music.paused && !music.ended;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing
    ? 'Pause opening titles music'
    : 'Play opening titles music');
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

['play', 'pause', 'ended'].forEach(event => {
  music.addEventListener(event, updateMusicControl);
});

music.addEventListener('error', () => {
  musicStatus.textContent = 'Music is currently unavailable.';
  updateMusicControl();
});

const clickSound = document.querySelector('#click-sound');

window.addEventListener('click', () => {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {
    // Keep navigation responsive if the browser cannot play the sound.
  });
});

