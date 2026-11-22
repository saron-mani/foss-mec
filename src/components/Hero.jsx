/*
 * Hero + About.
 *  - Vanta.js NET background (theme aware)
 *  - Ink-trail canvas that follows the cursor (from the reference video)
 *  - Giant condensed type layered BEHIND an ASCII Tux (from the Mustang reference)
 *  - GSAP ScrollTrigger parallax + scrubbed word reveal, Lenis drives the scroll
 */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { TUX, rule } from "./AsciiArt.jsx";
import { AsciiReveal, DecryptedText, ScrollVelocity } from "./ReactBits.jsx";
import { EVENTS_STATIC } from "./Events.jsx";
import { TEAM_STATIC } from "./Team.jsx";

gsap.registerPlugin(ScrollTrigger);

const JOIN = "https://t.me/joinchat/_wHtSpuMBQxhODhl";
const ABOUT =
  "FOSS Cell of Government Model Engineering College is a student-led community promoting free and open source software. We bring the college's technical initiatives onto one platform — building projects, contributing to global open source communities, learning real-world tools, and running workshops, hands-on sessions and events.";

const PALETTE = {
  velvet: {
    dark: { ink: "#f4ecd8", vanta: 0x7d6ba6, bg: 0x15131a },
    light: { ink: "#17141c", vanta: 0x6f5f97, bg: 0xe5e0ea },
  },
  acid: {
    dark: { ink: "#d4f94e", vanta: 0x8a3fd0, bg: 0x111111 },
    light: { ink: "#111111", vanta: 0x7a35c0, bg: 0xf1f2ea },
  },
};

/* Solid silhouette of the Tux (one rect per row, first → last glyph) so the giant
   letters are occluded behind it, like the car in the Mustang shot. SVG rather
   than block glyphs so there are no seams between rows in any font. */
const TUX_COLS = Math.max(...TUX.map((l) => l.length));
const TUX_RECTS = TUX.map((l, r) => {
  const a = l.search(/\S/);
  return a < 0 ? null : { y: r, x: a, w: l.trimEnd().length - a };
}).filter(Boolean);

const MARQUEE = [
  { text: "Free · Open Source · Forever ·", base: 0.9, dir: 1 },
  { text: "Learn · Build · Contribute · Share ·", base: 0.9, dir: -1, outline: true },
];

/* ------------------------------------------------------------ ink trail */
function useInk(canvasRef, heroRef, colors) {
  const colorsRef = useRef(colors);
  colorsRef.current = colors;

  useEffect(() => {
    const cv = canvasRef.current;
    const hero = heroRef.current;
    const ctx = cv.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0,
      h = 0,
      raf = 0,
      visible = true,
      lastMove = 0;
    const pts = [];
    const LIFE = 1300;

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);

    let curW = 14;
    const add = (x, y, now) => {
      const p = pts[pts.length - 1];
      const dist = p ? Math.hypot(x - p.x, y - p.y) : 0;
      // slow = pooled blob, fast = thin whip (like a brush on wet paper)
      const target = gsap.utils.clamp(7, 34, 34 - dist * 0.55);
      curW += (target - curW) * 0.22;
      if (p && dist > 10) {
        const n = Math.floor(dist / 8);
        for (let i = 1; i <= n; i++) {
          const k = i / (n + 1);
          pts.push({ x: p.x + (x - p.x) * k, y: p.y + (y - p.y) * k, w: curW, t: now });
        }
      }
      pts.push({ x, y, w: curW, t: now });
    };

    const onMove = (e) => {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      lastMove = performance.now();
      add(x, y, lastMove);
    };
    hero.addEventListener("pointermove", onMove);
    // pointer left the hero: let the ink retract quickly
    const onLeave = () => pts.forEach((p) => (p.t -= LIFE * 0.6));
    hero.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(hero);

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      if (pts.length < 2) return;
      ctx.strokeStyle = ctx.fillStyle = colorsRef.current.ink;
      ctx.lineCap = ctx.lineJoin = "round";
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const k = 1 - (now - b.t) / LIFE;
        ctx.lineWidth = Math.max(0.4, b.w * Math.pow(k, 0.75));
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      const head = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(head.x, head.y, head.w * 0.62, 0, Math.PI * 2);
      ctx.fill();
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      io.disconnect();
    };
  }, [canvasRef, heroRef]);
}

/* ------------------------------------------------------------ component */
export default function Hero({ theme, palette }) {
  const colors = PALETTE[palette][theme];
  const wrap = useRef(null);
  const hero = useRef(null);
  const vantaEl = useRef(null);
  const vantaFx = useRef(null);
  const ink = useRef(null);
  const giantS = useRef(null);
  const giantP = useRef(null);
  const tuxS = useRef(null);
  const tuxP = useRef(null);

  useInk(ink, hero, colors);

  /* Vanta.js — three + vanta are loaded lazily so they never block first paint */
  const colorsNow = useRef(colors);
  colorsNow.current = colors;
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 760;
    let dead = false;
    Promise.all([import("three"), import("vanta/dist/vanta.net.min")])
      .then(([THREE, mod]) => {
        if (dead || !vantaEl.current) return;
        window.THREE = THREE;
        const NET = mod.default || mod;
        const c = colorsNow.current;
        vantaFx.current = NET({
          el: vantaEl.current,
          THREE,
          mouseControls: !reduce,
          touchControls: !reduce,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          color: c.vanta,
          backgroundColor: c.bg,
          points: small ? 6 : 9,
          maxDistance: small ? 16 : 22,
          spacing: small ? 20 : 17,
          showDots: true,
          mouseEase: true,
        });
      })
      .catch((err) => console.warn("Vanta could not start (WebGL unavailable?)", err));
    return () => {
      dead = true;
      if (vantaFx.current) vantaFx.current.destroy();
      vantaFx.current = null;
    };
  }, []);

  useEffect(() => {
    const fx = vantaFx.current;
    if (!fx) return;
    fx.setOptions({ color: colors.vanta, backgroundColor: colors.bg });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, palette]);

  /* Vanta's net tilts toward the pointer and stays tilted — ease it back to rest
     when the pointer stops moving or leaves the hero. */
  useEffect(() => {
    const root = hero.current;
    let last = 0;
    const touch = () => (last = performance.now());
    root.addEventListener("pointermove", touch);
    const tick = () => {
      const fx = vantaFx.current;
      if (!fx || fx.mouseX == null) return;
      if (performance.now() - last < 900) return;
      const cx = fx.width / 2;
      const cy = fx.height / 2;
      fx.mouseX += (cx - fx.mouseX) * 0.05;
      fx.mouseY += (cy - fx.mouseY) * 0.05;
    };
    gsap.ticker.add(tick);
    return () => {
      root.removeEventListener("pointermove", touch);
      gsap.ticker.remove(tick);
    };
  }, []);

  /* GSAP: intro, pointer parallax, scroll parallax, about reveal */
  useEffect(() => {
    const root = hero.current;
    const ctx = gsap.context(() => {
      // intro
      gsap.from(".gch-in", { yPercent: 115, duration: 1.4, ease: "power4.out", stagger: 0.07, delay: 0.15 });
      gsap.from(".hc-left > *, .hc-right > *", { y: 46, opacity: 0, duration: 1.2, ease: "power3.out", stagger: 0.1, delay: 0.9 });
      gsap.from(".blob", { scale: 0, duration: 1.1, ease: "back.out(2.4)", stagger: 0.25, delay: 1.3 });
      gsap.to(".blob-blue", { y: -18, x: 8, rotate: 14, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".blob-red", { y: 16, x: -10, rotate: -18, duration: 2.7, ease: "sine.inOut", repeat: -1, yoyo: true });

      // pointer parallax (inner wrappers so it never fights the scroll tweens)
      const gx = gsap.quickTo(giantP.current, "x", { duration: 1.4, ease: "power3" });
      const gy = gsap.quickTo(giantP.current, "y", { duration: 1.4, ease: "power3" });
      const tx = gsap.quickTo(tuxP.current, "x", { duration: 1.1, ease: "power3" });
      const ty = gsap.quickTo(tuxP.current, "y", { duration: 1.1, ease: "power3" });
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        gx(nx * -34);
        gy(ny * -18);
        tx(nx * 52);
        ty(ny * 28);
      };
      root.addEventListener("pointermove", onMove);

      // scroll parallax: each layer travels at its own speed → depth
      const st = { trigger: root, start: "top top", end: "bottom top", scrub: 1.4 };
      gsap.to(giantS.current, { yPercent: -34, ease: "none", scrollTrigger: st });
      gsap.to(tuxS.current, { yPercent: -9, ease: "none", scrollTrigger: st });
      gsap.to(".hero-copy", { y: -140, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "70% top" } });
      gsap.to(vantaEl.current, { yPercent: 14, scale: 1.14, ease: "none", scrollTrigger: st });

      // about: word-by-word scrubbed reveal
      gsap.fromTo(
        ".ab-w",
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: ".ab-text", start: "top 82%", end: "bottom 48%", scrub: 1.1 },
        }
      );
      gsap.fromTo(".ab-ghost", { xPercent: 8 }, { xPercent: -28, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: 1.5 } });
      gsap.from(".stat", {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: ".stats", start: "top 88%" },
      });
      gsap.utils.toArray(".stat-n[data-to]").forEach((el) => {
        const o = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () =>
            gsap.to(o, {
              v: +el.dataset.to,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => (el.textContent = String(Math.round(o.v)).padStart(2, "0")),
            }),
        });
      });

      return () => root.removeEventListener("pointermove", onMove);
    }, wrap);
    return () => ctx.revert();
  }, []);

  const members2026 = (TEAM_STATIC.find((t) => t.year === 2026) || TEAM_STATIC[0]).members.length;

  return (
    <div ref={wrap}>
      <style>{css}</style>

      {/* ----------------------------------------------------- HERO */}
      <section id="home" className="hero" ref={hero}>
        <div className="hero-vanta" ref={vantaEl} aria-hidden="true" />
        <div className="hero-fade" aria-hidden="true" />

        <div className="layer giant-wrap" ref={giantS}>
          <div ref={giantP}>
            <h1 className="giant" aria-label="FOSS MEC">
              {"FOSS MEC".split("").map((c, i) => (
                <span key={i} className={`gch${i > 4 ? " alt" : ""}`} aria-hidden="true">
                  <span className="gch-in">{c === " " ? " " : c}</span>
                </span>
              ))}
            </h1>
          </div>
        </div>

        <div className="layer tux-wrap" ref={tuxS}>
          <div ref={tuxP}>
            <div className="tux-box">
              <svg className="tux-sil" viewBox={`0 0 ${TUX_COLS} ${TUX.length}`} preserveAspectRatio="none" aria-hidden="true">
                {TUX_RECTS.map((r) => (
                  <rect key={r.y} x={r.x - 0.5} y={r.y - 0.03} width={r.w + 1} height={1.06} />
                ))}
              </svg>
              <AsciiReveal lines={TUX} className="tux-art" duration={2.6} delay={0.5} />
            </div>
          </div>
        </div>

        <i className="blob blob-blue" aria-hidden="true" />
        <i className="blob blob-red" aria-hidden="true" />

        <div className="hero-copy">
          <div className="hc-left">
            <p className="kicker">
              <DecryptedText text="FOSS CELL · GOVT. MODEL ENGINEERING COLLEGE" onView />
            </p>
            <h2 className="headline serif">
              Big ideas,
              <br />
              cool projects,
              <br />
              <em>great people.</em>
            </h2>
          </div>
          <div className="hc-right">
            <p className="lede">A student-led community promoting free &amp; open source software at MEC. Workshops, sprints, talks — you in?</p>
            <div className="cta">
              <a className="btn btn-solid" href={JOIN} target="_blank" rel="noreferrer">
                Join FOSS →
              </a>
              <a className="btn" href="https://github.com/FOSSMEC" target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            </div>
          </div>
        </div>

        <canvas className="ink" ref={ink} aria-hidden="true" />
      </section>

      {/* ----------------------------------------------------- ABOUT */}
      <section id="intro" className="about">
        <div className="ab-ghost" aria-hidden="true">OPEN SOURCE OPEN SOURCE</div>
        <div className="ab-in">
          <pre className="sec-rule">{rule("01 / INTRO")}</pre>
          <p className="ab-text serif">
            {ABOUT.split(" ").map((w, i) => (
              <span key={i} className="ab-w">
                {w}{" "}
              </span>
            ))}
          </p>
          <div className="stats">
            <div className="stat">
              <b className="stat-n" data-to={EVENTS_STATIC.length}>00</b>
              <span>events &amp; workshops</span>
            </div>
            <div className="stat">
              <b className="stat-n" data-to={TEAM_STATIC.length}>00</b>
              <span>core teams since 2020</span>
            </div>
            <div className="stat">
              <b className="stat-n" data-to={members2026}>00</b>
              <span>people on Core 2026</span>
            </div>
            <div className="stat">
              <b className="stat-n">∞</b>
              <span>free open source forever</span>
            </div>
          </div>
        </div>
        <ScrollVelocity rows={MARQUEE} />
      </section>
    </div>
  );
}

const css = `
.hero{position:relative;height:100vh;min-height:680px;overflow:hidden;isolation:isolate}
.hero-vanta{position:absolute;inset:0;z-index:0;opacity:.55;will-change:transform}
[data-theme="light"] .hero-vanta{opacity:.7}
.hero-fade{position:absolute;inset:auto 0 0 0;height:30%;z-index:1;pointer-events:none;
  background:linear-gradient(to bottom,transparent,var(--bg))}
.layer{position:absolute;left:0;right:0;z-index:1;pointer-events:none;will-change:transform}

/* giant type — sits behind the ASCII penguin (Mustang-style layering) */
.giant-wrap{top:10vh;display:flex;justify-content:center}
.giant{font-family:'Anton',Impact,'Arial Narrow',sans-serif;font-weight:400;text-transform:uppercase;white-space:nowrap;
  font-size:min(25vw,47vh);line-height:.9;letter-spacing:-.005em;color:var(--giant);user-select:none}
.gch.alt{color:var(--alt)}
.gch{display:inline-block;overflow:hidden;vertical-align:top;padding:.02em .004em 0}
.gch-in{display:inline-block}

/* ascii tux */
.tux-wrap{bottom:3vh;z-index:2;display:flex;justify-content:center}
.tux-box{position:relative;isolation:isolate;font-size:clamp(5.5px,min(1.22vw,1.72vh),17px);line-height:1}
.tux-sil{position:absolute;inset:0;width:100%;height:100%;z-index:-1;overflow:visible;filter:drop-shadow(0 0 .45em var(--bg))}
.tux-sil rect{fill:var(--bg)}
.tux-art{font-family:'DM Mono',ui-monospace,Menlo,Consolas,monospace;font-size:1em;line-height:1;white-space:pre;margin:0;color:var(--fg);font-weight:500}

/* little blobs from the reference video */
.blob{position:absolute;z-index:2;width:clamp(16px,2vw,28px);height:clamp(16px,2vw,28px);border-radius:50% 50% 50% 0;pointer-events:none}
.blob-blue{left:7vw;top:30vh;background:var(--accent);transform:rotate(-40deg)}
.blob-red{right:6vw;top:22vh;background:var(--accent2);transform:rotate(30deg)}

.hero-copy{position:absolute;z-index:3;left:clamp(1rem,4vw,3.5rem);right:clamp(1rem,4vw,3.5rem);bottom:clamp(1.4rem,6vh,3.5rem);
  display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;pointer-events:none}
.hero-copy a{pointer-events:auto}
.kicker{font-size:11px;letter-spacing:.16em;color:var(--muted);margin-bottom:1rem}
.headline{font-weight:700;font-size:clamp(1.5rem,3vw,3rem);line-height:1.12;letter-spacing:-.05em;text-shadow:0 0 24px var(--bg)}
.headline em{display:inline-block;padding:.02em var(--pillpad) .08em;margin-left:calc(var(--pillpad) * -1);border-radius:999px;box-shadow:inset 0 0 0 1.5px var(--pill);font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;padding-right:.07em}
.hc-right{max-width:330px;text-align:left}
.lede{font-size:12.5px;line-height:1.75;color:var(--muted);margin-bottom:1.2rem;text-shadow:0 0 14px var(--bg)}
.cta{display:flex;flex-wrap:wrap;gap:.7rem}

.ink{position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none}
[data-theme="dark"] .ink{mix-blend-mode:difference}

/* about */
.about{position:relative;padding:clamp(5rem,14vh,10rem) 0 0;overflow:hidden}
.ab-ghost{position:absolute;top:2rem;left:0;white-space:nowrap;font-family:'Anton',Impact,sans-serif;font-size:clamp(9rem,26vw,26rem);line-height:1;
  color:transparent;-webkit-text-stroke:1px var(--line);pointer-events:none;user-select:none;will-change:transform}
.ab-in{position:relative;max-width:1200px;margin:0 auto;padding:0 clamp(1rem,5vw,3rem) clamp(4rem,10vh,7rem)}
.ab-text{margin-top:2.4rem;font-weight:700;font-size:clamp(1.1rem,2.35vw,2.3rem);line-height:1.4;letter-spacing:-.04em}
.ab-w{display:inline-block;white-space:pre}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:clamp(3rem,8vh,5rem);background:var(--line);border:1px solid var(--line)}
.stat{background:var(--bg);padding:clamp(1.2rem,3vw,2rem);display:flex;flex-direction:column;gap:.5rem;transition:background .6s}
.stat b{font-family:'Anton',Impact,sans-serif;font-weight:400;font-size:clamp(2.6rem,6vw,5rem);line-height:1;color:var(--accent)}
.stat span{font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}

@media (max-width:860px){
  .lede{font-size:13px}
  .kicker{font-size:11.5px}
  .hero{height:auto;min-height:100svh;display:flex;flex-direction:column;padding-top:76px}
  .giant-wrap{position:relative;top:auto;margin-top:3vh}
  .giant{font-size:25.5vw}
  .tux-wrap{position:relative;bottom:auto;margin-top:-9vw}
  .tux-box{font-size:clamp(4.4px,1.55vw,9px)}
  .hero-copy{position:relative;left:auto;right:auto;bottom:auto;flex-direction:column;align-items:flex-start;padding:1.4rem 1.2rem 4.5rem;gap:1.4rem}
  .stats{grid-template-columns:repeat(2,1fr)}
  .blob-blue{top:14vh}
}
`;
