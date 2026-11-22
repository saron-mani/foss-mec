/*
 * About Us.
 *  - "what we do" pillars as sticky stacking cards (each one covers the last)
 *  - milestones timeline whose line draws itself as you scroll
 * Every fact here comes from the events scraped from foss.mec.ac.in.
 */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rule } from "./AsciiArt.jsx";
import { DecryptedText, SpotlightCard } from "./ReactBits.jsx";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    n: "01",
    title: "Workshops",
    text: "Laptop-open, learn-by-doing sessions — from your first commit to deploying a full-stack app.",
    tags: ["Let's Git It", "GNU/Linux Workshop", "FlutterUp!", "Build It Up"],
  },
  {
    n: "02",
    title: "Talks & mentoring",
    text: "People from the community and industry explain how open source actually works and how to get into it.",
    tags: ["GSoC Talk Session", "DevOps Unlocked", "Inboxed"],
  },
  {
    n: "03",
    title: "Contests",
    text: "Friendly competitions that reward clean, collaborative code — bug hunts and creative coding for Onam.",
    tags: ["Codeum Reparo", "Code-A-Pookalam"],
  },
  {
    n: "04",
    title: "Sprints & conferences",
    text: "Contribution sprints on campus and trips to the wider FOSS community, so students ship real patches.",
    tags: ["Devsprint", "DebUtsav", "PravConf", "IndiaFOSS 4.0"],
  },
];

const MILESTONES = [
  ["2020", "The first FOSS MEC core team takes shape under Sharat P Raju, with Aswin G as chairperson."],
  ["Feb 2024", "Let's Git It '24 — 75 students install Git and make their first commits."],
  ["Mar 2024", "PravConf at MEC: talks and sprints on privacy-focused messaging and the Fediverse."],
  ["Sep 2024", "FOSSMEC joins IndiaFOSS 4.0 in Bangalore and runs Code A Pookalam with TinkerHub MEC."],
  ["Oct 2025", "Devsprint 2025 — a one-day open-source sprint where students pair with mentors."],
  ["Feb 2026", "Let's Git It '25: every participant publishes a GitHub Pages portfolio."],
];

const VALUES = ["Learn", "Build", "Contribute", "Share"];

export default function About() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".ab2-ghost", { xPercent: 6 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.2 } });
      gsap.from(".ab2-head > *", { y: 50, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: ".ab2-head", start: "top 85%" } });
      gsap.from(".ab2-val", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: ".ab2-vals", start: "top 90%" } });

      // stacking cards: earlier cards recede as the next one slides over them
      const cards = gsap.utils.toArray(".ab2-slot");
      cards.forEach((slot, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(slot.firstElementChild, {
          scale: 0.92,
          opacity: 0.45,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top 78%", end: "top 24%", scrub: true },
        });
      });

      // timeline: line draws itself, entries slide in
      gsap.fromTo(".tl-line i", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".tl-list", start: "top 70%", end: "bottom 60%", scrub: 0.6 } });
      gsap.utils.toArray(".tl-item").forEach((el) => {
        gsap.from(el, { x: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="ab2" ref={root}>
      <style>{css}</style>
      <div className="ab2-ghost" aria-hidden="true">ABOUT US</div>
      <div className="ab2-in">
        <div className="ab2-head">
          <pre className="sec-rule">{rule("03 / ABOUT US")}</pre>
          <h2 className="ab2-title serif">
            A community that <em>learns in the open</em>
          </h2>
          <p className="ab2-lead">
            FOSS MEC is the Free and Open Source Software cell of Govt. Model Engineering College, Thrikkakara. We're students,
            guided by our staff advisor, who believe software is better when anyone can read it, change it and share it — and
            we organise everything around that idea.
          </p>
          <div className="ab2-vals">
            {VALUES.map((v) => (
              <span className="ab2-val" key={v}>
                <DecryptedText text={v.toUpperCase()} />
              </span>
            ))}
          </div>
        </div>

        <div className="ab2-stack">
          {PILLARS.map((p, i) => (
            <div className="ab2-slot" key={p.n} style={{ "--i": i }}>
              <SpotlightCard as="article" className="ab2-card">
                <span className="ab2-num">{p.n}</span>
                <div className="ab2-body">
                  <h3 className="serif">{p.title}</h3>
                  <p>{p.text}</p>
                  <ul>
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>

        <div className="tl">
          <div className="tl-title">
            <pre className="sec-rule">{rule("MILESTONES", 32)}</pre>
            <h3 className="serif">
              Along <em>the way</em>
            </h3>
          </div>
          <ol className="tl-list">
            <div className="tl-line" aria-hidden="true"><i /></div>
            {MILESTONES.map(([when, what]) => (
              <li className="tl-item" key={when}>
                <span className="tl-dot" aria-hidden="true" />
                <b>{when}</b>
                <p>{what}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const css = `
.ab2{position:relative;overflow:hidden;background:var(--bg2);border-top:1px solid var(--line);padding:clamp(5rem,14vh,9rem) 0 clamp(5rem,12vh,8rem);transition:background .6s}
.ab2-ghost{position:absolute;top:2rem;left:0;white-space:nowrap;font-family:'Anton',Impact,sans-serif;font-size:clamp(10rem,30vw,30rem);line-height:1;
  color:transparent;-webkit-text-stroke:1px var(--line);pointer-events:none;user-select:none;will-change:transform}
.ab2-in{position:relative;max-width:1180px;margin:0 auto;padding:0 clamp(1rem,5vw,3rem)}
.ab2-head{display:flex;flex-direction:column;gap:1.2rem;margin-bottom:clamp(3rem,8vh,5rem)}
.ab2-title{font-weight:700;font-size:clamp(1.6rem,3.6vw,3.5rem);line-height:1.08;letter-spacing:-.05em;max-width:19ch}
.ab2-title em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;padding-right:.07em}
.ab2-lead{max-width:62ch;font-size:14px;line-height:1.85;color:var(--muted)}
.ab2-vals{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:.4rem}
.ab2-val{font-size:12px;letter-spacing:.16em;padding:.55rem 1.1rem;border:1px solid var(--accent3);color:var(--accent3);border-radius:999px}

/* stacking cards */
.ab2-stack{display:flex;flex-direction:column;gap:clamp(1.2rem,3vh,2rem);padding-bottom:2rem}
.ab2-slot{position:sticky;top:calc(88px + var(--i) * 22px)}
.ab2-slot > *{transform-origin:50% 0;will-change:transform}
.ab2-card{display:grid;grid-template-columns:minmax(90px,.22fr) 1fr;gap:clamp(1rem,3vw,3rem);align-items:center;min-height:clamp(240px,36vh,320px);
  padding:clamp(1.4rem,3vw,2.6rem);border:1px solid var(--line);border-radius:22px;background:color-mix(in srgb,var(--bg2) 88%,var(--accent) 12%);box-shadow:0 30px 60px -30px rgba(0,0,0,.55)}
.ab2-num{font-family:'Anton',Impact,sans-serif;font-size:clamp(4rem,10vw,9rem);line-height:1;color:transparent;-webkit-text-stroke:1.5px var(--accent)}
.ab2-body h3{font-weight:700;font-size:clamp(1.25rem,2.2vw,2rem);line-height:1.1;letter-spacing:-.05em;margin-bottom:.7rem}
.ab2-body p{font-size:13.5px;line-height:1.8;color:var(--muted);max-width:56ch}
.ab2-body ul{display:flex;flex-wrap:wrap;gap:.45rem;list-style:none;margin-top:1.1rem}
.ab2-body li{font-size:11px;letter-spacing:.08em;padding:.3rem .7rem;border-radius:999px;background:color-mix(in srgb,var(--accent3) 14%,transparent);color:var(--accent3)}

/* timeline */
.tl{display:grid;grid-template-columns:minmax(200px,.8fr) 1.6fr;gap:clamp(2rem,6vw,5rem);margin-top:clamp(4rem,10vh,7rem)}
.tl-title{position:sticky;top:110px;align-self:start;display:flex;flex-direction:column;gap:1rem}
.tl-title h3{font-weight:700;font-size:clamp(1.4rem,2.6vw,2.4rem);line-height:1.1;letter-spacing:-.05em}
.tl-title em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;padding-right:.07em}
.tl-list{position:relative;list-style:none;padding-left:2.2rem;display:flex;flex-direction:column;gap:clamp(1.8rem,5vh,3rem)}
.tl-line{position:absolute;left:.45rem;top:.4rem;bottom:.4rem;width:2px;background:var(--line)}
.tl-line i{display:block;height:100%;background:linear-gradient(to bottom,var(--accent),var(--accent2));transform-origin:50% 0}
.tl-item{position:relative}
.tl-dot{position:absolute;left:calc(-2.2rem + 1px);top:.35rem;width:11px;height:11px;border-radius:50%;background:var(--bg2);border:2px solid var(--accent2)}
.tl-item b{display:block;font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent3);margin-bottom:.3rem}
.tl-item p{font-size:14px;line-height:1.75;max-width:58ch}

@media (max-width:860px){
  .ab2-card{grid-template-columns:1fr;gap:.4rem}
  .ab2-num{font-size:4rem}
  .ab2-slot{top:calc(76px + var(--i) * 14px)}
  .tl{grid-template-columns:1fr}
  .tl-title{position:static}
}
`;
