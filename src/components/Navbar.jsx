import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DecryptedText } from "./ReactBits.jsx";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { id: "home", label: "HOME" },
  { id: "events", label: "EVENTS" },
  { id: "about", label: "ABOUT US" },
  { id: "team", label: "TEAM" },
  { id: "gallery", label: "GALLERY" },
];
const JOIN = "https://t.me/joinchat/_wHtSpuMBQxhODhl";

export const goTo = (id) => {
  const lenis = window.__lenis;
  const target = id === "home" ? 0 : document.getElementById(id);
  if (!target && target !== 0) return;
  if (lenis) lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else if (target === 0) window.scrollTo({ top: 0, behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth" });
};

export default function Navbar({ theme, palette, onToggle, onPalette }) {
  const [open, setOpen] = useState(false);
  const bar = useRef(null);
  const prog = useRef(null);
  const openRef = useRef(false);
  openRef.current = open;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(prog.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const hide = self.direction === 1 && self.scroll() > 160 && !openRef.current;
          gsap.to(bar.current, { yPercent: hide ? -110 : 0, duration: 0.55, ease: "power3.out", overwrite: true });
        },
      });
      gsap.from(bar.current, { yPercent: -120, opacity: 0, duration: 1.1, ease: "power4.out", delay: 0.2 });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  const nav = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    goTo(id);
  };

  return (
    <header className="nv" ref={bar}>
      <style>{css}</style>
      <div className="nv-prog" ref={prog} />
      <div className="nv-in">
        <a href="#home" className="nv-logo" onClick={nav("home")} aria-label="FOSS MEC home">
          <span className="nv-mark">{"{*}"}</span>
          <span>FOSS<b>/</b>MEC</span>
        </a>

        <nav className={`nv-links ${open ? "open" : ""}`} aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={nav(l.id)}>
              <DecryptedText text={l.label} />
            </a>
          ))}
          <a className="nv-join-m" href={JOIN} target="_blank" rel="noreferrer">
            JOIN FOSS →
          </a>
        </nav>

        <div className="nv-right">
          <button
            className="nv-pal"
            onClick={onPalette}
            aria-label={`Colour palette: ${palette === "velvet" ? "After Dark" : "Acid"}. Switch palette`}
            title={`Palette: ${palette === "velvet" ? "After Dark" : "Acid"} — click to switch`}
          >
            <i />
            <i />
          </button>
          <button
            className="nv-theme"
            onClick={onToggle}
            role="switch"
            aria-checked={theme === "dark"}
            aria-label={`Dark theme ${theme === "dark" ? "on" : "off"} — toggle`}
            title="Toggle theme"
          >
            <svg className="ic sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg className="ic moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
            <span className="knob" />
          </button>
          <a className="nv-join" href={JOIN} target="_blank" rel="noreferrer">
            JOIN FOSS
          </a>
          <button className="nv-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

const css = `
.nv{position:fixed;top:0;left:0;right:0;z-index:80;
  background:color-mix(in srgb,var(--bg) 62%,transparent);backdrop-filter:blur(14px) saturate(1.2);
  -webkit-backdrop-filter:blur(14px) saturate(1.2);border-bottom:1px solid var(--line)}
.nv-prog{position:absolute;left:0;bottom:-1px;height:2px;width:100%;background:var(--accent2);transform:scaleX(0);transform-origin:0 50%}
.nv-in{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.8rem clamp(1rem,4vw,3rem)}
.nv-logo{display:flex;align-items:center;gap:.6rem;font-family:'Anton',Impact,sans-serif;font-size:1.35rem;letter-spacing:.04em}
.nv-logo b{color:var(--accent2);font-weight:400;padding:0 .08em}
.nv-mark{font-family:'DM Mono',monospace;font-size:.9rem;color:var(--accent);border:1px solid var(--line);border-radius:6px;padding:.1rem .4rem}
.nv-links{display:flex;gap:clamp(1rem,3vw,2.4rem);font-size:12.5px;letter-spacing:.12em}
.nv-links a{position:relative;padding:.3rem 0}
.nv-links a::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--fg);transform:scaleX(0);transform-origin:0 50%;transition:transform .4s cubic-bezier(.2,.8,.2,1)}
.nv-links a:hover::after{transform:scaleX(1)}
.nv-right{display:flex;align-items:center;gap:.8rem}
.nv-join{font-size:12px;letter-spacing:.12em;padding:.55rem 1rem;border-radius:999px;background:var(--fg);color:var(--bg);transition:background .3s,color .3s}
.nv-join:hover{background:var(--accent2);color:#000}

/* theme switch */
.nv-pal{position:relative;flex:none;width:38px;height:38px;border-radius:50%;border:1px solid var(--line);background:var(--card);transition:transform .4s cubic-bezier(.2,.8,.2,1)}
.nv-pal:hover{transform:rotate(180deg)}
.nv-pal i{position:absolute;top:50%;width:13px;height:13px;border-radius:50%;transform:translateY(-50%)}
.nv-pal i:first-child{left:7px;background:var(--accent)}
.nv-pal i:last-child{right:7px;background:var(--accent2)}
.nv-join-m{display:none}
.nv-theme{position:relative;display:flex;align-items:center;justify-content:space-between;width:62px;height:32px;padding:0 8px;
  border:1px solid var(--line);border-radius:999px;background:var(--card)}
.nv-theme .ic{width:14px;height:14px;position:relative;z-index:2;opacity:.75}
.nv-theme .knob{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:var(--fg);z-index:1;
  transition:transform .5s cubic-bezier(.65,0,.15,1)}
[data-theme="dark"] .nv-theme .knob{transform:translateX(30px)}
[data-theme="dark"] .nv-theme .moon{color:var(--bg);opacity:1}
[data-theme="light"] .nv-theme .sun{color:var(--bg);opacity:1}

.nv-burger{display:none;width:34px;height:32px;position:relative}
.nv-burger span{position:absolute;left:6px;right:6px;height:1.5px;background:var(--fg);transition:transform .35s}
.nv-burger span:first-child{top:11px}.nv-burger span:last-child{top:19px}
.nv-burger[aria-expanded="true"] span:first-child{transform:translateY(4px) rotate(45deg)}
.nv-burger[aria-expanded="true"] span:last-child{transform:translateY(-4px) rotate(-45deg)}

@media (max-width:760px){
  .nv-in{padding:.55rem 1rem;gap:.6rem}
  .nv-right{gap:.5rem}
  .nv-burger{display:block;width:44px;height:44px}
  .nv-burger span{left:11px;right:11px}
  .nv-burger span:first-child{top:16px}.nv-burger span:last-child{top:26px}
  .nv-join{display:none}
  .nv-theme{width:68px;height:40px}
  .nv-theme .knob{width:32px;height:32px;top:3px;left:3px}
  [data-theme="dark"] .nv-theme .knob{transform:translateX(28px)}
  .nv-pal{width:40px;height:40px}
  .nv-links{position:absolute;top:100%;left:0;right:0;flex-direction:column;gap:0;background:var(--bg);border-bottom:1px solid var(--line);
    max-height:0;overflow:hidden;transition:max-height .5s cubic-bezier(.65,0,.15,1)}
  .nv-links.open{max-height:420px}
  .nv-links a{padding:1.05rem 1rem;border-top:1px solid var(--line);font-size:14px;min-height:52px;display:flex;align-items:center}
  .nv-links a::after{display:none}
  .nv-links .nv-join-m{display:flex;justify-content:center;margin:.8rem 1rem 1rem;border:1px solid var(--fg);border-radius:999px;background:var(--fg);color:var(--bg);min-height:48px}
}
`;
