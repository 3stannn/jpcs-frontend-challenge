"use strict";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);


function setupActivityFilters() {
  const filterButtons = $$("[data-filter]");
  const activityCards = $$(".activity-item");
  const status = $("#filter-status");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((filterButton) => {
        const isSelected = filterButton === button;
        filterButton.classList.toggle("active", isSelected);
        filterButton.setAttribute("aria-pressed", String(isSelected));
      });

      activityCards.forEach((card) => {
        card.hidden =
          selectedFilter !== "all" && card.dataset.category !== selectedFilter;
      });

      const visibleCount = activityCards.filter((card) => !card.hidden).length;
      status.textContent = `${visibleCount} ${visibleCount === 1 ? "update" : "updates"} shown.`;
    });
  });
}


function setupNavigation() {
  const navigation = $("#navigation");
  const navLinks = $$(".navbar .nav-link");
  const sections = $$("main section[id]");
  const backToTop = $("#back-top");
  let scrollFramePending = false;

  function updateActiveLink() {
    let activeSection = sections[0].id;

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 150) {
        activeSection = section.id;
      }
    });

    const reachedPageEnd =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 5;

    if (reachedPageEnd) activeSection = sections.at(-1).id;

    navLinks.forEach((link) => {
      const isCurrent = link.hash === `#${activeSection}`;
      link.classList.toggle("active", isCurrent);

      if (isCurrent) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });

    backToTop.hidden = window.scrollY < 600;
    scrollFramePending = false;
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!navigation.classList.contains("show")) return;

      navigation.addEventListener(
        "hidden.bs.collapse",
        () => {
          const destination = $(link.hash);
          destination.setAttribute("tabindex", "-1");
          destination.focus({ preventScroll: true });
        },
        { once: true },
      );

      bootstrap.Collapse.getOrCreateInstance(navigation).hide();
    });
  });

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFramePending) return;
      scrollFramePending = true;
      requestAnimationFrame(updateActiveLink);
    },
    { passive: true },
  );

  window.addEventListener("resize", updateActiveLink);
  updateActiveLink();
}

function setupBackToTop() {
  const button = $("#back-top");
  const car = $("#back-top-car");
  const brand = $(".navbar-brand");

  car.addEventListener("animationend", () => {
    car.hidden = true;
    car.classList.remove("is-rising");
  });

  button.addEventListener("click", () => {
    if (!prefersReducedMotion.matches) {
      car.classList.remove("is-rising");
      car.hidden = false;
      void car.offsetWidth;
      car.classList.add("is-rising");
    }

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
    brand.focus({ preventScroll: true });
  });
}


function setupAudio() {
  const music = $("#hero-music");
  const toggle = $("#music-toggle");
  const label = $("#music-label");
  const icon = $("#music-icon");
  const status = $("#music-status");
  const clickSound = $("#click-sound");

  function updateMusicButton() {
    const isPlaying = !music.paused && !music.ended;
    toggle.setAttribute("aria-pressed", String(isPlaying));
    toggle.setAttribute(
      "aria-label",
      isPlaying ? "Pause opening titles music" : "Play opening titles music",
    );
    label.textContent = isPlaying ? "Pause music" : "Play music";
    icon.textContent = isPlaying ? "Ⅱ" : "▶";
  }

  toggle.addEventListener("click", async () => {
    if (!music.paused) {
      music.pause();
      return;
    }

    status.textContent = "";

    try {
      await music.play();
    } catch {
      status.textContent = "Music could not be played. Please try again.";
      updateMusicButton();
    }
  });

  ["play", "pause", "ended"].forEach((eventName) => {
    music.addEventListener(eventName, updateMusicButton);
  });

  music.addEventListener("error", () => {
    status.textContent = "Music is currently unavailable.";
    updateMusicButton();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("a, button")) return;
    clickSound.currentTime = 0;
    clickSound.play().catch(() => { });
  });
}


const albums = {
  "meet-greet": {
    title: "Meet & Greet Booth",
    description:
      "A lively campus booth where students met JPCS–TSU, joined activities, and discovered a community built around computing.",
    alt: "Meet and Greet Booth highlight",
  },
  "ccs-cares": {
    title: "Project CCS C.A.R.E.S",
    description:
      "Chapter members working together in a service initiative for the CCS community and its shared spaces.",
    alt: "Project CCS C.A.R.E.S highlight",
  },
  "office-care": {
    title: "General Cleaning and Office Maintenance",
    description:
      "JPCS–TSU members putting the office maintenance agreement into practice through hands-on care and organization.",
    alt: "CCS organization office maintenance highlight",
  },
  "general-assembly": {
    title: "JPCS–TSU General Assembly",
    description:
      "A chapter-wide gathering for updates, discussion, coordination, and connection among members.",
    alt: "JPCS–TSU General Assembly highlight",
  },
  "membership-drive": {
    title: "Ready, Set, Join JPCS",
    description:
      "Students getting to know the chapter, its people, and the opportunities that begin with membership.",
    alt: "JPCS–TSU membership drive highlight",
  },
};

function setupAlbums() {
  const modalElement = $("#album-modal");
  const modalTitle = $("#album-modal-title");
  const modalDescription = $("#album-modal-description");
  const modalGrid = $("#album-modal-grid");

  function openAlbum(slug) {
    const album = albums[slug];
    if (!album) return;

    modalTitle.textContent = album.title;
    modalDescription.textContent = album.description;
    modalGrid.replaceChildren();

    for (let index = 1; index <= 6; index += 1) {
      const image = document.createElement("img");
      const fileNumber = String(index).padStart(2, "0");

      image.src = `assets/images/events/${slug}/${fileNumber}.webp`;
      image.alt = `${album.alt} ${index} of 6`;
      image.width = 1600;
      image.height = 1200;
      image.loading = index === 1 ? "eager" : "lazy";
      modalGrid.append(image);
    }

    bootstrap.Modal.getOrCreateInstance(modalElement).show();
  }

  $$(".album-trigger").forEach((button) => {
    button.addEventListener("click", () => openAlbum(button.dataset.album));
  });

  $$("[data-open-album]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openAlbum(link.dataset.openAlbum);
    });
  });
}


function setupDates() {
  const currentDate = $("#current-date");
  const year = $("#year");

  function updateCurrentDate() {
    const now = new Date();

    currentDate.textContent = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
      .format(now)
      .toUpperCase();

    currentDate.dateTime = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
  }

  year.textContent = new Date().getFullYear();
  updateCurrentDate();
  setInterval(updateCurrentDate, 60_000);
}

setupActivityFilters();
setupNavigation();
setupBackToTop();
setupAudio();
setupAlbums();
setupDates();
