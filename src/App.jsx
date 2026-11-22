import { useEffect, useLayoutEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Events from "./components/Events.jsx";
import About from "./components/About.jsx";
import Team from "./components/Team.jsx";
import Gallery from "./components/Gallery.jsx";
import Footer from "./components/Footer.jsx";
import { ReactBitsStyles } from "./components/ReactBits.jsx";

gsap.registerPlugin(ScrollTrigger);

/* Global styles + theme tokens. Dark is the default; light is the pale-blue
   palette lifted from the reference video. */
const css = `
/* Two palettes × dark/light.
   velvet = golden yellow · dusty purple · charcoal
   acid   = near-black · acid lime · violet   (default) */
:root,[data-theme="dark"]{
  --bg:#15131a; --bg2:#1d1a25; --fg:#f4ecd8; --muted:#a59cb4; --line:rgba(244,236,216,.14);
  --card:rgba(157,139,199,.07); --accent:#f6b93b; --accent2:#9a87cc; --accent3:#b9a8e6; --ink:#f4ecd8;
  --giant:#f6b93b; --alt:#7d6ba6; --pill:transparent; --pillpad:0em;
  --grad:linear-gradient(100deg,#f6b93b 0%,#ffd98a 100%); --glow1:rgba(246,185,59,.10); --glow2:rgba(125,107,166,.20);
  --grain:.06; color-scheme:dark;
}
[data-theme="light"]{
  --bg:#e5e0ea; --bg2:#d9d2e2; --fg:#17141c; --muted:#5b5069; --line:rgba(23,20,28,.2);
  --card:rgba(255,255,255,.5); --accent:#b87500; --accent2:#6a55a0; --accent3:#5a4690; --ink:#17141c;
  --giant:#f2b01e; --alt:#6f5f97;
  --grad:linear-gradient(100deg,#e09a00 0%,#a85d00 100%); --glow1:rgba(242,176,30,.20); --glow2:rgba(106,85,160,.14);
  --grain:.09; color-scheme:light;
}
[data-palette="acid"][data-theme="dark"]{
  --bg:#111111; --bg2:#181818; --fg:#f5f5ef; --muted:#9b9b92; --line:rgba(255,255,255,.14);
  --card:rgba(255,255,255,.045); --accent:#d4f94e; --accent2:#a85cf2; --accent3:#cfa4f7; --ink:#d4f94e;
  --giant:#f5f5ef; --alt:#d4f94e; --pill:#d4f94e; --pillpad:.35em;
  --grad:linear-gradient(100deg,#d4f94e 0%,#f2ffa8 100%); --glow1:rgba(168,92,242,.22); --glow2:rgba(212,249,78,.07);
}
[data-palette="acid"][data-theme="light"]{
  --bg:#f1f2ea; --bg2:#e4e6d8; --fg:#111111; --muted:#55594a; --line:rgba(17,17,17,.2);
  --card:rgba(255,255,255,.6); --accent:#5a1fa8; --accent2:#7c2fd0; --accent3:#5a1fa8; --ink:#111111;
  --giant:#111111; --alt:#b6e027; --pill:#111111; --pillpad:.35em;
  --grad:linear-gradient(100deg,#5a1fa8 0%,#b04df0 100%); --glow1:rgba(182,224,39,.30); --glow2:rgba(124,47,208,.14);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{background:var(--bg);-webkit-text-size-adjust:100%}
body::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;
  background:radial-gradient(60vw 50vh at 8% 12%,var(--glow1),transparent 70%),radial-gradient(55vw 45vh at 95% 85%,var(--glow2),transparent 70%)}
body{background:var(--bg);color:var(--fg);font-family:'DM Mono',ui-monospace,Menlo,Consolas,monospace;
  font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;
  transition:background .6s ease,color .6s ease}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
img{display:block;max-width:100%}
::selection{background:var(--accent2);color:#000}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}

/* Lenis */
html.lenis,html.lenis body{height:auto}
.lenis.lenis-smooth{scroll-behavior:auto!important}
.lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}
.lenis.lenis-stopped{overflow:hidden}
.lenis.lenis-smooth iframe{pointer-events:none}

/* film grain */
body::after{content:"";position:fixed;inset:-50%;z-index:90;pointer-events:none;opacity:var(--grain);
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.55'/></svg>");
  animation:grain 1.2s steps(6) infinite}
@keyframes grain{0%{transform:translate(0,0)}20%{transform:translate(-3%,2%)}40%{transform:translate(2%,-3%)}60%{transform:translate(-2%,-1%)}80%{transform:translate(3%,3%)}100%{transform:translate(0,0)}}

/* shared section atoms */
.grad,.grad em,em.grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;padding-right:.07em}
.sec-rule{font-size:clamp(9px,1.35vw,13px);color:var(--muted);line-height:1.2;overflow:hidden;white-space:pre}
.serif{font-family:'Space Mono',ui-monospace,Menlo,Consolas,monospace;letter-spacing:-.045em}
.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 1.3rem;border:1px solid var(--fg);border-radius:999px;
  font-size:13px;letter-spacing:.06em;text-transform:uppercase;transition:background .3s,color .3s,transform .3s}
.btn:hover{background:var(--fg);color:var(--bg);transform:translateY(-2px)}
.btn-solid{background:var(--fg);color:var(--bg)}
.btn-solid:hover{background:var(--accent2);border-color:var(--accent2);color:#000}

html{-webkit-tap-highlight-color:transparent}
@media (hover:none){.ev-img,.tm-photo img,.gl-item img{filter:none!important}}
@media (max-width:760px){
  body{font-size:14px}
  .btn{min-height:46px;padding:.8rem 1.2rem}
}
@media (prefers-reduced-motion:reduce){body::after{animation:none}}
`;

const readTheme = () => {
  try {
    return localStorage.getItem("foss-theme") || "dark";
  } catch {
    return "dark";
  }
};

const readPalette = () => {
  try {
    return localStorage.getItem("foss-palette") || "acid";
  } catch {
    return "acid";
  }
};
const META_BG = { velvet: { dark: "#15131a", light: "#e5e0ea" }, acid: { dark: "#111111", light: "#f1f2ea" } };

export default function App() {
  const [theme, setTheme] = useState(readTheme);
  const [palette, setPalette] = useState(readPalette);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.palette = palette;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", META_BG[palette][theme]);
    try {
      localStorage.setItem("foss-theme", theme);
      localStorage.setItem("foss-palette", palette);
    } catch {
      /* storage can be unavailable (private mode) — theme just won't persist */
    }
  }, [theme, palette]);

  /* Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      lerp: reduce ? 1 : 0.085,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      smoothWheel: !reduce,
    });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return (
    <>
      <style>{css}</style>
      <ReactBitsStyles />
      <Navbar
        theme={theme}
        palette={palette}
        onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onPalette={() => setPalette((p) => (p === "velvet" ? "acid" : "velvet"))}
      />
      <main>
        <Hero theme={theme} palette={palette} />
        <Events />
        <About />
        <Team />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
