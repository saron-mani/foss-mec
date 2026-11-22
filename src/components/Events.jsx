/*
 * Events.
 * Data is scraped from foss.mec.ac.in (its Sanity CMS) and embedded as a static
 * fallback; on mount we also ask the CMS for anything newer and merge it in.
 *
 * Desktop: pinned horizontal gallery, scrubbed by vertical scroll, with each
 *          photo drifting inside its card (ScrollTrigger containerAnimation).
 * Mobile:  vertical stack with batched reveals.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rule } from "./AsciiArt.jsx";
import { DecryptedText, SpotlightCard } from "./ReactBits.jsx";

gsap.registerPlugin(ScrollTrigger);

const SANITY = "https://n3rhrsv8.apicdn.sanity.io/v2026-02-21/data/query/production";
const QUERY = `*[_type=="event"]{_id,name,year,date_label,event_short_desc,"img":cover_image.asset->url}`;
const CDN = "https://cdn.sanity.io/images/n3rhrsv8/production/";
const SITE = "https://foss.mec.ac.in/events/";

const ev = (id, name, year, when, desc, file) => ({ id, name, year, when, desc, img: CDN + file });

/* newest → oldest */
export const EVENTS_STATIC = [
  ev("0b5d9c85-049f-4c99-8510-8d8edab212ce", "Let's Git It '25", 2025, "Feb 10–11, 2026 · CCF Hall",
    "A Git & GitHub workshop covering local workflows and collaboration. Led by Dijith Dinesh and Abhin Krishna — everyone shipped a GitHub Pages portfolio.",
    "1540936bdbd02215af16be7c48937c7bea3065ef-2094x2094.jpg"),
  ev("379017c3-d77b-4256-bb6f-c508da305ac2", "Inboxed", 2025, "Oct 8, 2025 · SDPK",
    "A workshop on cold emailing and networking, led by K V Varun Krishnan: how to reach out professionally and write emails people answer.",
    "76121dd5793203f2ea8def00340d253bbbe64743-2150x2867.jpg"),
  ev("df95e700-aad0-469d-9afc-e5cdb55d76aa", "Devsprint 2025", 2025, "Oct 4, 2025 · MEC Thrikkakara",
    "A one-day open-source sprint where participants paired with mentors on real contributions to real projects.",
    "b32765a90278206bb946739a8b4177a90cf720f0-1428x803.jpg"),
  ev("5238620f-23d5-48df-9de9-59a2c6c3d151", "Code-A-Pookalam'2025", 2025, "Onam 2025 · Online",
    "An online creative-coding competition for Onam — no registration fee and a ₹3,000 prize pool.",
    "84b27b3e93197cf7065ea5e9f347eccca76f8907-1080x1080.jpg"),
  ev("c87eb8f9-4f2d-4a8a-b42c-03d98b805963", "GNU/Linux Workshop", 2025, "Jul 16 & 21, 2025 · SDPK Hall",
    "Hands-on Linux installation for about 30 students, led by Midhun Unni, Vasanth R and Mohammed Yasir.",
    "70908a3f931336243ea7545c9c0a0d6ff80bd011-3840x2160.jpg"),
  ev("8c4148ed-a0ce-4250-b268-4af50c7037dd", "FlutterUp!", 2025, "2025",
    "A hands-on Flutter workshop led by Akbar C P, Senior Flutter Developer at Lascade, finished off with a quiz.",
    "ed49150c68c9bdd720243e24ae15e17ab06f587c-4032x3024.webp"),
  ev("493207eb-5fb2-471b-a92e-f3dee45b9533", "GSoC Talk Session", 2025, "2025",
    "An introduction to Google Summer of Code by Adarsh S — open-source basics, preparation strategy and personal experience.",
    "c2ad484f3ab2e8b16d9ee87576fd10787a6d31a5-2822x2116.jpg"),
  ev("233a6caf-a970-4ef1-81a9-f7a8f2350fc8", "DevOps Unlocked", 2025, "2025",
    "An introductory DevOps talk by Tiby Verghis, Lead Engineer at Scaleios.",
    "b91d480252f9c44374f7bb717acbd3fc7590f325-2116x2822.jpg"),
  ev("04bac837-fb9d-4c02-839d-0b56baa552d6", "Codeum Reparo '25", 2025, "2025",
    "A bug-fixing contest: teams hunt hidden logic and UI defects in a live web app — a one-hour prelim, then a final focused on clean, FOSS-compliant code.",
    "06a76d216ee5a02542ae3deeac91b190024ca070-8568x8568.jpg"),
  ev("028ed758-2c30-4aa9-8dcf-5f6e4484d6f2", "Build It Up '25", 2025, "2025 · Offline + online",
    "Design, build and deploy a full-stack DBMS project over two offline days and an online follow-up, led by Midhun Unni and Vasanth R.",
    "cc4d3f1f30a4017454038e2e1382c47096a00e6a-2094x2094.jpg"),
  ev("1b471717-5d89-4c4b-a1cd-0be2dbb9378f", "Code A Pookalam'2024", 2024, "Sep 16–21, 2024",
    "An Onam-themed coding contest by FOSSMEC and TinkerHub MEC, open to every college, with a ₹6K prize pool.",
    "b42d305cb9acd3734594d6aef2a6843e2ccdb70e-1080x1080.jpg"),
  ev("eb8951fd-7639-4e94-9451-d648ad4684a6", "IndiaFOSS 4.0", 2024, "Sep 7–8, 2024 · Bangalore",
    "FOSSMEC took the community's initiatives to IndiaFOSS 4.0, India's FOSS conference in Bangalore.",
    "5aba5b9e24fc4fc1cba0555b1720950f74c0be2b-3024x4032.jpg"),
  ev("98f65906-5091-413d-8919-8de810a86097", "Build It Up", 2024, "Aug 21–22, 2024 · CCF Hall",
    "75 participants built a full-stack web app with Next.js and Supabase, led by Joel K George.",
    "2ad43c31ec3cb98d7cd6eb4d0824ecee45347131-566x304.jpg"),
  ev("216c0eea-98b6-4e10-a59e-4dca820fef8b", "DebUtsav 2024", 2024, "2024",
    "An unconference-style Debian event: a packaging workshop and contribution sprints, with groups of five working alongside experienced Debian contributors.",
    "45f2ca83e13a80306d8731dddbd0bc5ebffe2e16-4032x3024.jpg"),
  ev("9c76930a-b376-4f3e-a085-b65cc7a725c3", "Codeum Reparo", 2024, "2024 · with Excel 2024",
    "A two-round competition where participants debug and optimise web-based solutions.",
    "dc36b8cdc997f4dc034aaed1b6325a53b5a00bef-1080x806.jpg"),
  ev("828acc5f-0bf5-4723-9dd3-382123711905", "PravConf", 2024, "Mar 1–2, 2024 · MEC",
    "The genesis conference for PravApp: talks and contribution sprints on privacy-focused messaging, the Fediverse and the project's origins.",
    "74dc1b00824a0ec9a189ec5be50f1d007dbd3a16-1920x1280.jpg"),
  ev("02298ecf-ad37-4e45-b555-803b41be96e0", "Let's Git It '24", 2024, "Feb 5–6, 2024 · CCF Hall",
    "A beginner-friendly Git & GitHub session — 75 attendees, from installing Git to creating accounts and first commits.",
    "3b64d26d1d543c8927a19250aaef637d6b494a68-4032x3024.jpg"),
];

const pad = (n) => String(n).padStart(2, "0");
const thumb = (u, w = 900) => (u && u.includes("cdn.sanity.io") ? `${u}?w=${w}&auto=format&q=75` : u);

export default function Events() {
  const [events, setEvents] = useState(EVENTS_STATIC);
  const [year, setYear] = useState("all");
  const [broken, setBroken] = useState({});
  const sec = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);
  const counter = useRef(null);
  const bar = useRef(null);

  /* pull anything newer from the CMS; keep static data if the request fails */
  useEffect(() => {
    const ctl = new AbortController();
    fetch(`${SANITY}?query=${encodeURIComponent(QUERY)}`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(({ result }) => {
        if (!Array.isArray(result)) return;
        setEvents((prev) => {
          const known = new Set(prev.map((e) => e.id));
          const fresh = result
            .filter((r) => r._id && r.name && !known.has(r._id))
            .map((r) => ({ id: r._id, name: r.name, year: r.year, when: r.date_label || String(r.year || ""), desc: r.event_short_desc || "", img: r.img }));
          return fresh.length ? [...fresh, ...prev] : prev;
        });
      })
      .catch(() => {});
    return () => ctl.abort();
  }, []);

  const years = useMemo(() => ["all", ...[...new Set(events.map((e) => String(e.year)))].sort().reverse()], [events]);
  const list = useMemo(() => (year === "all" ? events : events.filter((e) => String(e.year) === year)), [events, year]);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const n = list.length;

    mm.add("(min-width: 861px)", () => {
      const t = track.current;
      const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);
      const tween = gsap.to(t, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin.current,
          pin: true,
          scrub: 0.5,
          start: "top top",
          end: () => "+=" + (dist() * 0.5 + 150),
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(n, Math.max(1, Math.round(self.progress * (n - 1)) + 1));
            if (counter.current) counter.current.textContent = `${pad(idx)} / ${pad(n)}`;
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      gsap.utils.toArray(".ev-card").forEach((card) => {
        gsap.fromTo(
          card.querySelector(".ev-img"),
          { xPercent: -7 },
          { xPercent: 7, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } }
        );
        gsap.fromTo(
          card,
          { y: 40 },
          { y: -20, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } }
        );
      });
      gsap.to(".ev-ghost", { xPercent: -38, ease: "none", scrollTrigger: { trigger: pin.current, start: "top top", end: () => "+=" + (dist() * 0.5 + 150), scrub: 0.8 } });
    });

    mm.add("(max-width: 860px)", () => {
      gsap.utils.toArray(".ev-card").forEach((card) => {
        gsap.from(card, { y: 70, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 90%" } });
        gsap.fromTo(card.querySelector(".ev-img"), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.to(".ev-ghost", { xPercent: -30, ease: "none", scrollTrigger: { trigger: sec.current, start: "top bottom", end: "bottom top", scrub: 1.4 } });
    });

    return () => mm.revert();
  }, [list]);

  const pickYear = (y) => {
    if (y === year) return;
    // jump back to the start of the section, then rebuild the gallery for the new list
    const lenis = window.__lenis;
    if (lenis && sec.current) lenis.scrollTo(sec.current, { immediate: true, force: true });
    setYear(y);
  };

  return (
    <section id="events" className="ev" ref={sec}>
      <style>{css}</style>
      <div className="ev-pin" ref={pin}>
        <div className="ev-ghost" aria-hidden="true">EVENTS EVENTS</div>

        <div className="ev-head">
          <div>
            <pre className="sec-rule">{rule("02 / EVENTS")}</pre>
            <h2 className="ev-title serif">
              Things we <em>ship</em> &amp; <em>share</em>
            </h2>
            <p className="ev-sub">Expert talks, practical workshops and collaborative spaces — all about FOSS.</p>
          </div>
          <div className="ev-side">
            <div className="ev-filters" role="tablist" aria-label="Filter events by year">
              {years.map((y) => (
                <button key={y} role="tab" aria-selected={y === year} className={y === year ? "on" : ""} onClick={() => pickYear(y)}>
                  {y === "all" ? "ALL" : y}
                </button>
              ))}
            </div>
            <div className="ev-count">
              <span ref={counter}>{`01 / ${pad(list.length)}`}</span>
              <div className="ev-bar"><i ref={bar} /></div>
            </div>
          </div>
        </div>

        <div className="ev-track" ref={track}>
          {list.map((e, i) => (
            <SpotlightCard as="article" className="ev-card" key={e.id}>
              <div className="ev-media">
                {e.img && !broken[e.id] ? (
                  <img
                    className="ev-img"
                    src={thumb(e.img)}
                    alt={`${e.name} — FOSS MEC event`}
                    loading="lazy"
                    draggable="false"
                    onError={() => setBroken((b) => ({ ...b, [e.id]: true }))}
                  />
                ) : (
                  <div className="ev-img ev-noimg">{"</>"}</div>
                )}
                <span className="ev-idx">{pad(i + 1)}</span>
                <span className="ev-year">{e.year}</span>
              </div>
              <div className="ev-body">
                <p className="ev-when">{e.when}</p>
                <h3 className="ev-name serif">{e.name}</h3>
                <p className="ev-desc">{e.desc}</p>
                <a className="ev-link" href={SITE + e.id} target="_blank" rel="noreferrer">
                  <DecryptedText text="READ MORE ↗" />
                </a>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

const css = `
.ev{position:relative;background:var(--bg);transition:background .6s}
.ev-pin{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:center;gap:clamp(1.2rem,3.5vh,2.6rem);
  padding:clamp(5.5rem,11vh,7rem) 0 2.2rem;overflow:hidden}
.ev-ghost{position:absolute;left:0;top:50%;transform:translateY(-50%);white-space:nowrap;font-family:'Anton',Impact,sans-serif;
  font-size:clamp(14rem,44vw,44rem);line-height:1;color:transparent;-webkit-text-stroke:1px var(--line);pointer-events:none;user-select:none;will-change:transform}

.ev-head{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;padding:0 clamp(1rem,5vw,4rem)}
.ev-title{font-weight:900;font-size:clamp(2rem,4.8vw,4.4rem);line-height:1;letter-spacing:-.02em;margin:.9rem 0 .7rem}
.ev-title em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;padding-right:.07em}
.ev-sub{font-size:12.5px;color:var(--muted);max-width:44ch}
.ev-side{display:flex;flex-direction:column;align-items:flex-end;gap:1rem}
.ev-filters{display:flex;gap:.4rem;flex-wrap:wrap;justify-content:flex-end}
.ev-filters button{font-size:11.5px;letter-spacing:.12em;padding:.45rem .9rem;border:1px solid var(--line);border-radius:999px;transition:background .3s,color .3s,border-color .3s}
.ev-filters button:hover{border-color:var(--fg)}
.ev-filters button.on{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.ev-count{display:flex;align-items:center;gap:.9rem;font-size:12px;letter-spacing:.14em;color:var(--muted)}
.ev-bar{width:clamp(80px,14vw,200px);height:2px;background:var(--line);overflow:hidden}
.ev-bar i{display:block;height:100%;background:var(--accent2);transform:scaleX(0);transform-origin:0 50%}

.ev-track{position:relative;z-index:2;display:flex;gap:clamp(1rem,2.2vw,2rem);padding:0 clamp(1rem,5vw,4rem);width:max-content;will-change:transform}
.ev-card{flex:none;width:clamp(290px,27vw,430px);height:clamp(420px,62vh,600px);display:flex;flex-direction:column;
  border:1px solid var(--line);border-radius:18px;background:var(--card);backdrop-filter:blur(6px)}
.ev-media{position:relative;flex:1 1 0;min-height:0;overflow:hidden;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--fg) 8%,transparent)}
.ev-img{position:absolute;top:0;left:-10%;width:120%;height:100%;object-fit:cover;filter:grayscale(.85) contrast(1.05);
  transition:filter .6s,transform .8s cubic-bezier(.2,.8,.2,1)}
.ev-card:hover .ev-img{filter:none}
.ev-noimg{display:grid;place-items:center;font-size:3rem;color:var(--muted)}
.ev-idx,.ev-year{position:absolute;top:.8rem;font-size:11px;letter-spacing:.14em;padding:.25rem .6rem;border-radius:999px;
  background:color-mix(in srgb,var(--bg) 78%,transparent);backdrop-filter:blur(8px)}
.ev-idx{left:.8rem}.ev-year{right:.8rem;color:var(--accent2)}
.ev-body{padding:1.1rem 1.2rem 1.25rem;display:flex;flex-direction:column;gap:.45rem}
.ev-when{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent3)}
.ev-name{font-weight:900;font-size:clamp(1.3rem,1.9vw,1.75rem);line-height:1.08;letter-spacing:-.01em}
.ev-desc{font-size:12px;line-height:1.65;color:var(--muted);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.ev-link{margin-top:.3rem;font-size:11.5px;letter-spacing:.14em;align-self:flex-start;border-bottom:1px solid var(--fg);padding-bottom:2px}

@media (max-width:860px){
  .ev-pin{min-height:0;padding:5rem 0 4rem;justify-content:flex-start}
  .ev-head{flex-direction:column;align-items:flex-start}
  .ev-side{align-items:flex-start}
  .ev-filters{justify-content:flex-start}
  .ev-count{display:none}
  .ev-track{flex-direction:column;width:auto;padding:0 clamp(1rem,5vw,2rem)}
  .ev-card{width:100%;height:auto}
  .ev-media{flex:none;height:min(62vw,340px)}
  .ev-img{left:0;top:-8%;width:100%;height:116%}
  .ev-desc{-webkit-line-clamp:unset}
}
`;
