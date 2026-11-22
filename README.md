# FOSS MEC — React site

Vite + React. Smooth scroll with **Lenis**, motion with **GSAP + ScrollTrigger**, background with **Vanta.js (NET)**,
React Bits–style components (DecryptedText, SpotlightCard, ScrollVelocity, ASCII scramble) and ASCII art (Tux + banner).

## Technologies Used

- **React 18 + React DOM** — component-based UI, with `src/main.jsx` as the entry point.
- **Vite 5** — dev server and production build (`@vitejs/plugin-react`).
- **Lenis** — smooth / legato scrolling, driven by the GSAP ticker.
- **GSAP + ScrollTrigger** — intro timelines, parallax layers, scrubbed reveals, pinned horizontal gallery and counters.
- **Three.js + Vanta.js (NET)** — animated WebGL network background in the hero.
- **React Bits–style helpers** — `DecryptedText`, `SpotlightCard`, `ScrollVelocity` and `AsciiReveal`, implemented locally in `ReactBits.jsx`.
- **ASCII art** — Tux, banner, avatars and section rules in `AsciiArt.jsx`.
- **Self-hosted fonts** — Anton, DM Mono and Space Mono are bundled and preloaded for stable first paint.

## Setup Instructions

Requires Node.js and npm.

```
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Structure
```
src/
  main.jsx
  App.jsx                 theme (dark default + toggle), Lenis ↔ GSAP wiring, global CSS
  components/
    Navbar.jsx            sticky bar, theme toggle, scroll progress
    Hero.jsx              Vanta + ink trail + giant type + ASCII Tux, About, marquee
    Events.jsx            pinned horizontal gallery, year filter
    About.jsx             About Us: stacking cards + milestones timeline
    Team.jsx              year tabs, parallax columns
    Gallery.jsx           drifting photo rows + lightbox
    Footer.jsx            ASCII banner, uncover parallax
    ReactBits.jsx         shared React Bits–style helpers
    AsciiArt.jsx          ASCII art data
```
Styling is co-located in `<style>` blocks inside the components — the running app does not import a separate CSS file.

## Data
Scraped from foss.mec.ac.in (its Sanity CMS) and embedded as fallback. Events.jsx / Team.jsx also query the CMS
at runtime and merge/replace with fresher data when reachable.

## Theme
Dark by default with a dark/light toggle in the top bar. Palette: near-black · acid lime · violet. Tokens are at the top of `src/App.jsx`; the Vanta/ink colours are in `Hero.jsx`.

## Design inspiration
The layout and motion were inspired by the attached reference media — oversized condensed display type layered behind ASCII art, a floating network background, fine-grain texture, and legato parallax transitions between sections. Content and branding come from [FOSS MEC](https://foss.mec.ac.in/).
