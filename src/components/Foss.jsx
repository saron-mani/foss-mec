import React, { useState, useEffect, useRef } from "react";

const STYLES = `
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;800&display=swap");

:root{--ease:cubic-bezier(.22,1,.36,1);--mono:"JetBrains Mono",ui-monospace,"Cascadia Mono",Consolas,Menlo,monospace;box-sizing:border-box;color-scheme:dark light}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;background:#0b0c0f}
*,*::before,*::after{box-sizing:inherit}
body{margin:0;font-family:var(--mono);overflow-x:clip;-webkit-font-smoothing:antialiased;background:#0b0c0f}
a{color:inherit;text-decoration:none}
h1,h2,h3,p,ul{margin:0;padding:0}
.d{--bg:#0b0c0f;--fg:#ece9e2;--mut:#8c8f98;--line:#2b2e35;--acc:#ff6a2b;background:var(--bg);color:var(--fg)}
.l{--bg:#ece8df;--fg:#14151a;--mut:#5b5e66;--line:#c9c4b8;--acc:#d1400b;background:var(--bg);color:var(--fg)}
.w{width:min(1120px,100% - 40px);margin:0 auto;position:relative;z-index:2}
.fx>*{position:absolute;pointer-events:none;will-change:transform}
.ring{border:1px solid var(--line);border-radius:50%;aspect-ratio:1;width:var(--s)}
.sun{border-radius:50%;background:var(--acc);aspect-ratio:1;width:var(--s)}
.sh{display:flex;align-items:center;gap:16px;margin-bottom:clamp(28px,5vw,56px)}
.sh span{color:var(--acc);font-size:13px}
.sh h2{font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-.04em;line-height:1}
.sh i{flex:1;height:1px;background:var(--line)}
.lead{color:var(--mut);font-size:15px;line-height:1.8;max-width:54ch}
.btn{display:inline-block;padding:14px 22px;border:1px solid var(--fg);font:500 14px var(--mono);transition:background .5s var(--ease),color .5s var(--ease),transform .7s var(--ease)}
.btn:hover{background:var(--fg);color:var(--bg);transform:translateX(6px)}

.nav{position:fixed;z-index:50;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:center;padding:calc(env(safe-area-inset-top,0px) + 16px) 20px 0;color:#fff;mix-blend-mode:difference;font-size:13px;pointer-events:none}
.nav>*{pointer-events:auto}
.nav nav{display:flex;gap:6px;align-items:center}
.nav nav a{padding:6px 10px;opacity:.8;transition:opacity .4s}
.nav nav a:hover{opacity:1}
.nav .j{border:1px solid #fff;border-radius:99px;padding:6px 16px;opacity:1}

/* zoom stage */
.zoom{height:440svh;position:relative}
.stage{position:sticky;top:0;height:100svh;overflow:hidden}
.layer{position:absolute;inset:0}
#hero{background:none;will-change:opacity,transform}
.hbg{position:absolute;inset:0;background:var(--bg)}
.fw{position:absolute;inset:0;display:grid;place-items:center}
#field,#kw,#acc{position:absolute;left:0;top:0;margin:0;font-family:var(--mono);line-height:1;white-space:pre;letter-spacing:0;pointer-events:none}
#field{color:var(--mut);opacity:.3}#kw{color:var(--fg);opacity:.38}#acc{color:var(--acc)}
#word,#wo{position:absolute;margin:0;font-family:var(--mono);font-weight:400;line-height:1;white-space:pre;letter-spacing:0;color:var(--fg);pointer-events:none}
#word{opacity:.38}
#wo{left:0;top:0;transform-origin:0 0;opacity:0;will-change:transform}
.lg{position:relative;z-index:2}
#asc{margin:0;font:400 clamp(7px,1.5vw,12px)/1.1 var(--mono);white-space:pre;color:var(--fg);text-align:left;letter-spacing:0}
#asc s{text-decoration:none;color:var(--acc)}
.info{position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 6%);transform:translateX(-50%);width:min(520px,90vw);text-align:center;z-index:3}
.info .tg{font-size:clamp(12px,1.6vw,14px);color:var(--mut);line-height:1.8}
.info .sc{margin-top:16px;font-size:13px;color:var(--fg)}
.cur{display:inline-block;width:8px;height:1.05em;background:var(--acc);vertical-align:-2px;margin-left:4px;animation:bl 1s steps(1) infinite}
@keyframes bl{50%{opacity:0}}

/* events */
.evl{display:flex;flex-direction:column;justify-content:center;padding:calc(env(safe-area-inset-top,0px) + 64px) 0 24px;pointer-events:none}
.vp{overflow:hidden;touch-action:pan-y;width:100vw;margin-left:calc(50% - 50vw);cursor:grab}
.track{display:flex;gap:20px;transition:transform 1.4s var(--ease);will-change:transform}
.ev{flex:0 0 min(80vw,440px);border:1px solid var(--line);background:var(--bg);opacity:.35;transform:scale(.95);transition:opacity 1.3s var(--ease),transform 1.3s var(--ease),border-color 1s;user-select:none;cursor:pointer}
.ev.on{opacity:1;transform:none;border-color:var(--fg)}
.ph{position:relative;height:clamp(130px,27svh,240px);overflow:hidden;background:#222}
.ph img{width:100%;height:100%;object-fit:cover;display:block;-webkit-user-drag:none}
.nb{position:absolute;left:12px;top:12px;width:40px;aspect-ratio:1;border-radius:50%;display:grid;place-items:center;background:var(--acc);color:#0b0c0f;font-size:13px;font-weight:800}
.bd{padding:16px 18px 18px}
.ev .m{font-size:11.5px;color:var(--mut)}
.ev h3{font-size:clamp(18px,2.4vw,23px);letter-spacing:-.03em;margin:8px 0 8px}
.ev p{color:var(--mut);font-size:13px;line-height:1.65}
.ev .lk{display:inline-block;margin-top:10px;color:var(--acc);font-size:12.5px}
.ctl{display:flex;align-items:center;gap:14px;margin-top:22px}
.pr{position:relative;width:56px;height:56px;display:grid;place-items:center;font-size:12px}
.pr svg{position:absolute;inset:0;transform:rotate(-90deg)}
.pr circle{fill:none;stroke-width:1.5}
.pr .b{stroke:var(--line)}.pr .v{stroke:var(--acc);stroke-dasharray:151;stroke-dashoffset:151}
.pr.run .v{animation:fill 4.8s linear forwards}.pr.pz .v{animation-play-state:paused}
@keyframes fill{to{stroke-dashoffset:0}}
.ctl button{width:48px;aspect-ratio:1;border-radius:50%;border:1px solid var(--line);background:none;color:var(--fg);font:16px var(--mono);cursor:pointer;transition:background .5s,color .5s,border-color .5s}
.ctl button:hover{background:var(--acc);border-color:var(--acc);color:#0b0c0f}
.ctl small{color:var(--mut);font-size:12px;margin-left:6px}

/* team */
.s{position:relative;overflow:hidden;padding:clamp(90px,12vw,150px) 0}
.tier{display:flex;flex-wrap:wrap;justify-content:center;gap:34px 22px;margin-bottom:84px}
.tier.core{--a:min(150px,38vw);gap:44px 40px}.tier.lds{--a:min(112px,27vw)}.tier.exec{--a:min(88px,25vw);gap:30px 14px;margin-bottom:0}
.tl{display:flex;align-items:center;gap:14px;margin-bottom:38px;color:var(--mut);font-size:12.5px}.tl i{flex:1;height:1px;background:var(--line)}
.tm{width:calc(var(--a) + 34px);text-align:center}
.tm:nth-child(even){margin-top:30px}
.avw{position:relative;width:var(--a);margin:0 auto 16px}
.avw::before{content:"";position:absolute;inset:-9px;border-radius:50%;border:1px dashed var(--line);animation:spin 28s linear infinite;transition:border-color .8s}
.tm.live .avw::before{border-color:var(--acc);animation-duration:7s}
@keyframes spin{to{transform:rotate(360deg)}}
.av{position:relative;width:100%;aspect-ratio:1;border-radius:50%;overflow:hidden;border:1px solid var(--line);background:rgba(255,255,255,.025);transition:border-color .8s}
.tm.live .av{border-color:var(--acc)}
.av pre{position:absolute;inset:0;margin:0;font:400 calc(var(--a) / 13.2)/calc(var(--a) / 13) var(--mono);letter-spacing:0;white-space:pre;color:var(--fg);opacity:.8;overflow:hidden;transition:opacity 1.1s var(--ease)}
.av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 20%;opacity:0;transform:scale(1.14);transition:opacity 1.1s var(--ease),transform 1.6s var(--ease)}
.tm.live .av img,.tm:hover .av img{opacity:1;transform:none}
.tm.live .av pre,.tm:hover .av pre{opacity:0}
.tm h3{font-size:13px;line-height:1.4;font-weight:500}
.tm small{display:block;margin-top:3px;color:var(--acc);font-size:11.5px;line-height:1.4}
.core .tm h3{font-size:15px}

/* footer */
.sun.c{--s:min(70vw,560px);right:-16vw;bottom:-8%}
.ghost{position:absolute;left:-1vw;top:6%;font-size:clamp(130px,30vw,430px);font-weight:800;letter-spacing:-.08em;line-height:.8;color:transparent;-webkit-text-stroke:1px var(--line);white-space:nowrap}
.fk{position:absolute;font-size:12.5px;color:var(--mut)}
.dot{width:var(--s);aspect-ratio:1;border-radius:50%;background:var(--acc)}
.yi{font-size:clamp(64px,15vw,200px);font-weight:800;letter-spacing:-.075em;line-height:.85;margin:6px 0 36px}
.soc{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));max-width:560px;margin-top:44px;border-top:1px solid var(--line)}
.soc a{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--line);font-size:14px;margin-right:24px;transition:padding .7s var(--ease),color .5s}
.soc a:hover{padding-left:12px;color:var(--acc)}
.mail{display:block;margin-top:22px;color:var(--mut);font-size:14px}.mail b{color:var(--fg);font-weight:500}
.copy{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:80px;border-top:1px solid var(--line);padding:22px 0 calc(34px + env(safe-area-inset-bottom,0px));color:var(--mut);font-size:12.5px}
.copy a{color:var(--fg)}

.rv{opacity:0;transform:translateY(34px);transition:opacity 1.2s var(--ease) var(--d,0s),transform 1.2s var(--ease) var(--d,0s)}
.rv.in{opacity:1;transform:none}

@media(max-width:520px){.soc{grid-template-columns:1fr}.nav nav a:not(.j){padding:6px 7px}.ctl small{display:none}.tier{gap:30px 8px}.tier.core{gap:34px 10px}.tm{width:calc(var(--a) + 14px)}}
@media(prefers-reduced-motion:reduce){
 html{scroll-behavior:auto}
 *,*::before,*::after{animation:none!important;transition-duration:.01s!important}
 .zoom{height:auto}.stage{position:static;height:auto}
 .layer{position:relative}.hero{min-height:100svh}.hbg,#wo{display:none}
 .evl{pointer-events:auto;padding-top:90px;padding-bottom:90px}
 .rv{opacity:1;transform:none}
 .av img{opacity:1;transform:none}.av pre{display:none}
}
`;

// Replace `i` with your full base64 strings or local image paths from public/
const EVENTS = [
  {
    t: "Code-A-Pookalam ’25",
    m: "contest · 1–7 Sep 2025",
    x: "Code a pookalam. A week-long event with a 3K prize pool, run by FOSS MEC.",
    i: "/images/pookalam.jpg",
    o: "50% 40%",
    a: ["cdpklm.vercel.app", "https://cdpklm.vercel.app"],
  },
  {
    t: "Introduction to DevOps",
    m: "talk · on stage",
    x: "How development and operations work together, with a student panel on stage.",
    i: "/images/devops.jpg",
    o: "50% 74%",
  },
  {
    t: "Hands-on workshop",
    m: "workshop · computer lab",
    x: "Live coding in the lab, with the speaker’s screen mirrored on the big display.",
    i: "/images/workshop.jpg",
    o: "50% 58%",
  },
  {
    t: "Community meetup",
    m: "meetup · auditorium",
    x: "A packed auditorium and one big group photo.",
    i: "/images/meetup.jpg",
    o: "50% 50%",
  },
];

// Populate with your team members from the original script
const TEAM_DATA = {
  core: [
    // { name: "Member Name", role: "Chairperson", img: "/images/member.jpg", ascii: "..." }
  ],
  leads: [],
  executives: [],
};

const SOCIALS = [
  { label: "instagram", href: "https://instagram.com/foss_mec" },
  { label: "github", href: "https://github.com/FOSSMEC" },
  { label: "linkedin", href: "https://linkedin.com/company/fossmec" },
  { label: "x / twitter", href: "https://x.com/FossMec" },
  { label: "mastodon", href: "https://mastodon.social/@FOSS_MEC" },
  { label: "telegram", href: "https://t.me/joinchat/_wHtSpuMBQxhODhl" },
];

const ASCII_LOGO = `███████╗ ██████╗ ███████╗███████╗    ███╗   ███╗███████╗ ██████╗
██╔════╝██╔═══██╗██╔════╝██╔════╝    ████╗ ████║██╔════╝██╔════╝
█████╗  ██║   ██║███████╗███████╗    ██╔████╔██║█████╗  ██║     
██╔══╝  ██║   ██║╚════██║╚════██║    ██║╚██╔╝██║██╔══╝  ██║     
██║     ╚██████╔╝███████║███████║    ██║ ╚═╝ ██║███████╗╚██████╗
╚═╝      ╚═════╝ ╚══════╝╚══════╝    ╚═╝     ╚═╝╚══════╝ ╚═════╝`;

function MemberCard({ member }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle("live", entry.isIntersecting);
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="tm" ref={cardRef}>
      <div className="avw">
        <div className="av">
          <pre aria-hidden="true">{member.ascii || ""}</pre>
          <img src={member.img} alt={member.name} loading="lazy" />
        </div>
      </div>
      <h3>{member.name}</h3>
      <small>{member.role}</small>
    </div>
  );
}

export default function Foss() {
  const [eventIndex, setEventIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [zoomProgress, setZoomProgress] = useState(0);

  const zoomRef = useRef(null);
  const totalEvents = EVENTS.length;

  const goEvent = (next) => {
    setEventIndex((next + totalEvents) % totalEvents);
  };

  // Auto-scroll events carousel
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setEventIndex((prev) => (prev + 1) % totalEvents);
    }, 4800);
    return () => clearInterval(timer);
  }, [paused, totalEvents]);

  // Global scroll-reveal (.rv), parallax ([data-p]), and zoom stage transition
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealEls = document.querySelectorAll(".rv");
    if (reduced) {
      revealEls.forEach((el) => el.classList.add("in"));
      setZoomProgress(1);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          }
        });
      },
      { threshold: 0.1 }
    );

    revealEls.forEach((el) => observer.observe(el));

    const parallaxEls = document.querySelectorAll("[data-p]");
    let rafId = null;

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const vh = window.innerHeight;

        // Parallax update
        parallaxEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const speed = parseFloat(el.dataset.p || "0");
          const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
          el.style.transform = `translate3d(0, ${offset}px, 0)`;
        });

        // Hero -> Events zoom transition progress (0 to 1)
        if (zoomRef.current) {
          const rect = zoomRef.current.getBoundingClientRect();
          const scrollable = rect.height - vh;
          const p =
            scrollable > 0
              ? Math.min(1, Math.max(0, -rect.top / scrollable))
              : 1;
          setZoomProgress(p);
        }

        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToEvents = (e) => {
    e.preventDefault();
    if (!zoomRef.current) return;
    const scrollable = zoomRef.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: zoomRef.current.offsetTop + scrollable * 0.6,
      behavior: "smooth",
    });
  };

  const heroOpacity = Math.max(0, 1 - zoomProgress * 2.2);
  const heroScale = 1 + zoomProgress * 0.5;
  const eventsInteractive = zoomProgress > 0.35;
  const formattedCount = String(eventIndex + 1).padStart(2, "0");

  return (
    <>
      <style>{STYLES}</style>

      <header className="nav">
        <a href="#home">
          <img
            src="/favicon.svg"
            alt="FOSS MEC"
            style={{
              width: "100px",
              paddingInline: "25px",
              paddingBlock: "5px",
              borderRadius: "3px",
              backgroundColor: "rgba(255,255,255,.25)",
            }}
          />
        </a>
        <nav>
          <a href="#events" id="goev" onClick={scrollToEvents}>
            events
          </a>
          <a href="#team">team</a>
          <a href="#contact">contact</a>
          <a
            className="j"
            href="https://t.me/joinchat/_wHtSpuMBQxhODhl"
            target="_blank"
            rel="noopener noreferrer"
          >
            join
          </a>
        </nav>
      </header>

      <main>
        {/* Hero + Events Zoom Stage */}
        <div className="zoom" id="zoom" ref={zoomRef}>
          <div className="stage" id="home">
            <i id="events" />

            {/* Events Layer */}
            <div
              className="layer evl d"
              id="evl"
              aria-label="Events"
              style={{ pointerEvents: eventsInteractive ? "auto" : "none" }}
            >
              <div className="w">
                <div className="sh" id="evh">
                  <span id="evn">01</span>
                  <h2 id="evt">events</h2>
                  <i id="evr" />
                </div>

                <div
                  className="vp"
                  id="vp"
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                >
                  <div
                    className="track"
                    id="track"
                    style={{
                      transform: `translateX(calc(50vw - min(40vw, 220px) - ${eventIndex} * (min(80vw, 440px) + 20px)))`,
                    }}
                  >
                    {EVENTS.map((ev, i) => (
                      <article
                        key={ev.t}
                        className={`ev ${i === eventIndex ? "on" : ""}`}
                        onClick={() => goEvent(i)}
                      >
                        <div className="ph">
                          <img
                            src={ev.i}
                            alt={ev.t}
                            style={{ objectPosition: ev.o || "50% 50%" }}
                          />
                          <span className="nb">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="bd">
                          <div className="m">{ev.m}</div>
                          <h3>{ev.t}</h3>
                          <p>{ev.x}</p>
                          {ev.a && (
                            <a
                              className="lk"
                              href={ev.a[1]}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {ev.a[0]} ↗
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="ctl" id="ctl">
                  <div
                    key={eventIndex}
                    className={`pr run ${paused ? "pz" : ""}`}
                    id="pr"
                  >
                    <svg viewBox="0 0 56 56">
                      <circle className="b" cx="28" cy="28" r="24" />
                      <circle className="v" cx="28" cy="28" r="24" />
                    </svg>
                    <span id="cnt">{formattedCount}</span>
                  </div>
                  <button
                    id="pv"
                    type="button"
                    aria-label="Previous event"
                    onClick={() => goEvent(eventIndex - 1)}
                  >
                    ←
                  </button>
                  <button
                    id="nx"
                    type="button"
                    aria-label="Next event"
                    onClick={() => goEvent(eventIndex + 1)}
                  >
                    →
                  </button>
                  <small>{paused ? "paused" : "auto-scrolling"}</small>
                </div>
              </div>
            </div>

            {/* Hero Layer */}
            <div
              className="layer hero d"
              id="hero"
              style={{
                opacity: heroOpacity,
                transform: `scale(${heroScale})`,
                pointerEvents: heroOpacity <= 0.05 ? "none" : "auto",
              }}
            >
              <div className="hbg" id="hbg" />
              <div className="fw" id="fw">
                <pre id="field" aria-hidden="true" />
                <pre id="kw" aria-hidden="true" />
                <pre id="acc" aria-hidden="true" />
                <h1
                  style={{
                    position: "absolute",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                    clip: "rect(0 0 0 0)",
                  }}
                >
                  FOSS MEC
                </h1>
                <div className="lg" id="lg">
                  <pre id="asc" aria-hidden="true">
                    {ASCII_LOGO}
                  </pre>
                </div>
              </div>
              <div className="info" id="info">
                <p className="tg">
                  Free and Open Source Software cell of Government Model
                  Engineering College, Kochi. Student-led, open to everyone.
                </p>
                <p className="sc">
                  $ scroll: one of these words is not like the others
                  <span className="cur" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <section id="team" className="s l">
          <div className="fx">
            <div
              className="ring"
              data-p=".2"
              style={{ "--s": "min(92vw,680px)", right: "-28vw", top: "2%" }}
            />
            <div
              className="ring"
              data-p="-.12"
              style={{ "--s": "min(60vw,420px)", left: "-14vw", top: "34%" }}
            />
            <div
              className="dot"
              data-p="-.3"
              style={{ "--s": "12px", left: "12%", top: "22%" }}
            />
          </div>

          <div className="w">
            <div className="sh rv">
              <span>02</span>
              <h2>team</h2>
              <i />
            </div>
            <p className="lead rv" style={{ margin: "-20px 0 56px" }}>
              Student-led and open to anyone at MEC curious about free software.
              Scroll slowly: members flip from ASCII to real as they pass.
            </p>

            <div className="tl rv">
              <span>// core</span>
              <i />
            </div>
            <div className="tier core" id="t1" data-p="-.03">
              {TEAM_DATA.core.map((m) => (
                <MemberCard key={m.name} member={m} />
              ))}
            </div>

            <div className="tl rv">
              <span>// leads</span>
              <i />
            </div>
            <div className="tier lds" id="t2" data-p=".04">
              {TEAM_DATA.leads.map((m) => (
                <MemberCard key={m.name} member={m} />
              ))}
            </div>

            <div className="tl rv">
              <span>// executives</span>
              <i />
            </div>
            <div className="tier exec" id="t3" data-p="-.05">
              {TEAM_DATA.executives.map((m) => (
                <MemberCard key={m.name} member={m} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="s d">
        <div className="fx">
          <div className="ghost" data-p=".3">
            FOSS
            <br />
            MEC
          </div>
          <div className="sun c" data-p=".4" />
          <div
            className="ring"
            data-p="-.18"
            style={{ "--s": "min(54vw,420px)", left: "4%", bottom: "-6%" }}
          />
          <div
            className="ring"
            data-p=".14"
            style={{ "--s": "min(30vw,220px)", left: "46%", top: "8%" }}
          />
          <div
            className="dot"
            data-p="-.4"
            style={{ "--s": "14px", left: "40%", top: "30%" }}
          />
          <div
            className="dot"
            data-p="-.24"
            style={{ "--s": "9px", right: "30%", top: "16%" }}
          />
          <span className="fk" data-p="-.22" style={{ left: "7%", top: "20%" }}>
            $ git push origin main
          </span>
          <span className="fk" data-p=".2" style={{ right: "9%", top: "12%" }}>
            $ sudo apt install friends
          </span>
          <span
            className="fk"
            data-p="-.3"
            style={{ left: "52%", top: "62%" }}
          >
            // fork it. fix it. share it.
          </span>
          <span
            className="fk"
            data-p=".26"
            style={{ left: "12%", top: "74%" }}
          >
            $ make --jobs=everyone
          </span>
        </div>

        <div className="w">
          <div className="sh rv">
            <span>03</span>
            <h2>contact</h2>
            <i />
          </div>
          <div data-p="-.06">
            <div className="yi rv">
              You
              <br />
              in?
            </div>
          </div>
          <a
            className="btn rv"
            href="https://t.me/joinchat/_wHtSpuMBQxhODhl"
            target="_blank"
            rel="noopener noreferrer"
          >
            $ join --telegram →
          </a>
          <a className="mail rv" href="mailto:foss@mec.ac.in">
            mail: <b>foss@mec.ac.in</b>
          </a>

          <div className="soc rv">
            {SOCIALS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label} <span>↗</span>
              </a>
            ))}
          </div>

          <div className="copy">
            <span>🄯 2026 FOSS MEC</span>
            <a
              href="https://github.com/FossMec/website"
              target="_blank"
              rel="noopener noreferrer"
            >
              Free Open Source Forever
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}