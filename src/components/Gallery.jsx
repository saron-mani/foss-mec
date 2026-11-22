/*
 * Gallery — event photos from the scraped events, in three rows that drift
 * sideways in opposite directions as you scroll. Click a photo for a lightbox.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rule } from "./AsciiArt.jsx";
import { EVENTS_STATIC } from "./Events.jsx";

gsap.registerPlugin(ScrollTrigger);

const sized = (u, w) => (u.includes("cdn.sanity.io") ? `${u}?w=${w}&auto=format&q=75` : u);
const RATIOS = ["4/5", "1/1", "3/4", "16/11", "4/5", "1/1"];

export default function Gallery() {
  const sec = useRef(null);
  const [open, setOpen] = useState(-1);
  const [broken, setBroken] = useState({});

  const photos = useMemo(() => EVENTS_STATIC.filter((e) => e.img), []);
  const rows = useMemo(() => {
    const r = [[], [], []];
    photos.forEach((p, i) => r[i % 3].push({ ...p, idx: i }));
    return r;
  }, [photos]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: sec.current, start: "top bottom", end: "bottom top", scrub: 0.8 };
      gsap.utils.toArray(".gl-row").forEach((row, i) => {
        const dist = () => Math.max(0, row.scrollWidth - window.innerWidth + 80);
        const rev = i % 2 === 1;
        gsap.fromTo(row, { x: () => (rev ? -dist() : 0) }, { x: () => (rev ? 0 : -dist()), ease: "none", scrollTrigger: { ...st, invalidateOnRefresh: true } });
      });
      gsap.from(".gl-head > *", { y: 50, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: ".gl-head", start: "top 85%" } });
      gsap.fromTo(".gl-ghost", { xPercent: 0 }, { xPercent: -35, ease: "none", scrollTrigger: st });
    }, sec);
    return () => ctx.revert();
  }, []);

  /* lightbox: freeze Lenis, keyboard nav */
  const close = useCallback(() => setOpen(-1), []);
  const step = useCallback((d) => setOpen((o) => (o < 0 ? o : (o + d + photos.length) % photos.length)), [photos.length]);
  useEffect(() => {
    if (open < 0) return;
    window.__lenis && window.__lenis.stop();
    const key = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      window.__lenis && window.__lenis.start();
    };
  }, [open, close, step]);

  const cur = open >= 0 ? photos[open] : null;

  return (
    <section id="gallery" className="gl" ref={sec}>
      <style>{css}</style>
      <div className="gl-ghost" aria-hidden="true">GALLERY</div>
      <div className="gl-head">
        <pre className="sec-rule">{rule("05 / GALLERY")}</pre>
        <h2 className="gl-title serif">
          Snapshots from <em>our events</em>
        </h2>
        <p className="gl-sub">Workshops, sprints and contests — click any photo to see it bigger.</p>
      </div>

      <div className="gl-rows">
        {rows.map((row, ri) => (
          <div className="gl-row" key={ri}>
            {row.map((p, k) =>
              broken[p.id] ? null : (
                <button
                  key={p.id}
                  className="gl-item"
                  style={{ aspectRatio: RATIOS[(k + ri * 2) % RATIOS.length] }}
                  onClick={() => setOpen(p.idx)}
                  aria-label={`Open photo: ${p.name}`}
                >
                  <img src={sized(p.img, 700)} alt={`${p.name} — FOSS MEC event photo`} loading="lazy" draggable="false" onError={() => setBroken((b) => ({ ...b, [p.id]: true }))} />
                  <span className="gl-cap">
                    <b>{p.name}</b>
                    <i>{p.year}</i>
                  </span>
                </button>
              )
            )}
          </div>
        ))}
      </div>

      {cur && (
        <div className="lb" role="dialog" aria-modal="true" aria-label={cur.name} onClick={close}>
          <button className="lb-x" onClick={close} aria-label="Close">✕</button>
          <button className="lb-nav lb-prev" onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Previous photo">←</button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={sized(cur.img, 1600)} alt={`${cur.name} — FOSS MEC event photo`} />
            <figcaption>
              <b className="serif">{cur.name}</b>
              <span>{cur.when}</span>
            </figcaption>
          </figure>
          <button className="lb-nav lb-next" onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Next photo">→</button>
        </div>
      )}
    </section>
  );
}

const css = `
.gl{position:relative;overflow:hidden;background:var(--bg2);border-top:1px solid var(--line);padding:clamp(5rem,14vh,9rem) 0 clamp(5rem,12vh,8rem);transition:background .6s}
.gl-ghost{position:absolute;top:2rem;left:0;white-space:nowrap;font-family:'Anton',Impact,sans-serif;font-size:clamp(10rem,30vw,30rem);line-height:1;
  color:transparent;-webkit-text-stroke:1px var(--line);pointer-events:none;user-select:none;will-change:transform}
.gl-head{position:relative;display:flex;flex-direction:column;gap:1.1rem;max-width:1320px;margin:0 auto clamp(2.5rem,7vh,4rem);padding:0 clamp(1rem,5vw,3rem)}
.gl-title{font-weight:900;font-size:clamp(2.2rem,5.6vw,5.2rem);line-height:.98;letter-spacing:-.025em;max-width:14ch}
.gl-title em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;padding-right:.07em}
.gl-sub{font-size:12.5px;color:var(--muted)}

.gl-rows{position:relative;display:flex;flex-direction:column;gap:clamp(.8rem,1.6vw,1.4rem)}
.gl-row{display:flex;align-items:center;gap:clamp(.8rem,1.6vw,1.4rem);width:max-content;padding:0 clamp(1rem,5vw,3rem);will-change:transform}
.gl-item{position:relative;flex:none;height:clamp(190px,30vh,320px);border-radius:16px;overflow:hidden;border:1px solid var(--line);background:var(--card);cursor:zoom-in}
.gl-item img{width:100%;height:100%;object-fit:cover;filter:grayscale(.8) contrast(1.05);transform:scale(1.03);transition:filter .6s,transform .9s cubic-bezier(.2,.8,.2,1)}
.gl-item:hover img,.gl-item:focus-visible img{filter:none;transform:scale(1.1)}
.gl-cap{position:absolute;inset:auto 0 0 0;display:flex;justify-content:space-between;align-items:flex-end;gap:.6rem;padding:2.2rem .9rem .8rem;text-align:left;
  background:linear-gradient(to top,rgba(0,0,0,.75),transparent);color:#fff;font-size:11.5px;letter-spacing:.06em;opacity:0;transform:translateY(8px);transition:opacity .4s,transform .4s}
.gl-cap i{font-style:normal;color:var(--accent3)}
.gl-item:hover .gl-cap,.gl-item:focus-visible .gl-cap{opacity:1;transform:none}

/* lightbox */
.lb{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;padding:4rem 4.5rem;background:rgba(3,5,10,.9);backdrop-filter:blur(10px);animation:lbin .35s ease}
@keyframes lbin{from{opacity:0}to{opacity:1}}
.lb figure{max-width:min(1100px,100%);max-height:100%;display:flex;flex-direction:column;gap:.9rem;align-items:center}
.lb img{max-width:100%;max-height:calc(100vh - 11rem);object-fit:contain;border-radius:12px;box-shadow:0 40px 100px -20px rgba(0,0,0,.8)}
.lb figcaption{display:flex;gap:1rem;align-items:baseline;color:#eef1f8}
.lb figcaption b{font-size:1.4rem;font-weight:900}
.lb figcaption span{font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:#5af0b4}
.lb-x,.lb-nav{position:absolute;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.25);color:#fff;font-size:18px;display:grid;place-items:center;transition:background .3s,color .3s}
.lb-x:hover,.lb-nav:hover{background:#fff;color:#000}
.lb-x{top:1.2rem;right:1.2rem}.lb-prev{left:1.2rem}.lb-next{right:1.2rem}

@media (max-width:760px){
  .lb{padding:4rem 1rem}
  .lb-prev,.lb-next{top:auto;bottom:1rem}.lb-prev{left:calc(50% - 54px)}.lb-next{right:calc(50% - 54px)}
  .gl-cap{opacity:1;transform:none;font-size:10.5px}
}
`;
