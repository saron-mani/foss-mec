# FOSS MEC — React site

Vite + React. Smooth scroll with **Lenis**, motion with **GSAP + ScrollTrigger**, background with **Vanta.js (NET)**,
React Bits–style components (DecryptedText, SpotlightCard, ScrollVelocity, ASCII scramble) and ASCII art (Tux + banner).

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
All CSS lives inside the components (no .css files).

## Data
Scraped from foss.mec.ac.in (its Sanity CMS) and embedded as fallback. Events.jsx / Team.jsx also query the CMS
at runtime and merge/replace with fresher data when reachable.
