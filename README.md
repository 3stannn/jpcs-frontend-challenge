# JPCS–TSU Chapter Website

A static website for the Junior Philippine Computer Society – Tarlac State University Chapter. It presents the chapter’s purpose, community activities, announcements, and selected event photos.

## Run locally

The site has no build step. Serve the project directory with any static HTTP server, then open the printed local URL.

```powershell
python -m http.server 4173
```

Opening `index.html` directly also works for basic viewing, although a local server more closely matches deployment behavior.

## Project structure

```text
assets/
  audio/          Interface and background audio
  fonts/          Local display and body typefaces
  images/         Site artwork, post images, and event albums
css/style.css     Layout, components, responsive rules, and theme overrides
js/main.js        Filters, navigation, audio controls, albums, and dates
index.html        Page content and Bootstrap modals
```

## Event albums

Each album lives in `assets/images/events/<album-slug>/`. Album images use two-digit filenames (`01.webp` through `06.webp`). The matching album title and description are defined in `js/main.js`.

When adding an album:

1. Add six optimized WebP images to a new album directory.
2. Add the album metadata to the `albums` object in `js/main.js`.
3. Add `data-album="<album-slug>"` to the button that opens it.

## Styling notes

- Bootstrap provides the grid, navigation collapse, and modal behavior.
- `css/style.css` owns the visual treatment and responsive adjustments.
- The original JPCS wordmark uses Orbitron; page headings use Formula 1 Display Wide.
- Respect `prefers-reduced-motion` when adding animation.
