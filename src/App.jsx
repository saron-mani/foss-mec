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
:root,[data-theme="dark"]{
  --bg:#06080f; --bg2:#0b1020; --fg:#eef1f8; --muted:#8e98b0; --line:rgba(190,205,255,.14);
  --card:rgba(120,150,255,.055); --accent:#5b8cff; --accent2:#ff6a3d; --accent3:#5af0b4; --ink:#eef1f8;
  --grad:linear-gradient(100deg,#ff6a3d 0%,#ffb347 100%); --glow1:rgba(91,140,255,.16); --glow2:rgba(255,106,61,.09);
  --grain:.06; color-scheme:dark;
}
[data-theme="light"]{
  --bg:#b4dbe9; --bg2:#a3cfe0; --fg:#0a0f1f; --muted:#2b4a58; --line:rgba(8,20,50,.22);
  --card:rgba(255,255,255,.42); --accent:#1d44e6; --accent2:#e8431a; --accent3:#007a55; --ink:#050505;
  --grad:linear-gradient(100deg,#e8431a 0%,#ff8a1f 100%); --glow1:rgba(29,68,230,.14); --glow2:rgba(255,255,255,.35);
  --grain:.1; color-scheme:light;
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
.serif{font-family:'Playfair Display',Georgia,serif}
.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 1.3rem;border:1px solid var(--fg);border-radius:999px;
  font-size:13px;letter-spacing:.06em;text-transform:uppercase;transition:background .3s,color .3s,transform .3s}
.btn:hover{background:var(--fg);color:var(--bg);transform:translateY(-2px)}
.btn-solid{background:var(--fg);color:var(--bg)}
.btn-solid:hover{background:var(--accent2);border-color:var(--accent2);color:#000}

@media (prefers-reduced-motion:reduce){body::after{animation:none}}
`;

const readTheme = () => {
  try {
    return localStorage.getItem("foss-theme") || "dark";
  } catch {
    return "dark";
  }
};

export default function App() {
  const [theme, setTheme] = useState(readTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#06080f" : "#b4dbe9");
    try {
      localStorage.setItem("foss-theme", theme);
    } catch {
      /* storage can be unavailable (private mode) — theme just won't persist */
    }
  }, [theme]);

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
      <Navbar theme={theme} onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
      <main>
        <Hero theme={theme} />
        <Events />
        <About />
        <Team />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
