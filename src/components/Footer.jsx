import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BANNER, rule } from "./AsciiArt.jsx";
import { AsciiReveal, DecryptedText } from "./ReactBits.jsx";
import { goTo } from "./Navbar.jsx";

gsap.registerPlugin(ScrollTrigger);

const JOIN = "https://t.me/joinchat/_wHtSpuMBQxhODhl";
const SOCIALS = [
  ["Instagram", "https://instagram.com/foss_mec"],
  ["Telegram", JOIN],
  ["LinkedIn", "https://linkedin.com/company/fossmec"],
  ["GitHub", "https://github.com/FOSSMEC"],
  ["X / Twitter", "https://x.com/FossMec"],
  ["Mastodon", "https://mastodon.social/@FOSS_MEC"],
];
const NAV = [
  ["Home", "home"],
  ["Events", "events"],
  ["About us", "about"],
  ["Team", "team"],
  ["Gallery", "gallery"],
];

export default function Footer() {
  const root = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // "uncover" parallax: content slides up out of the page above it
      gsap.fromTo(
        inner.current,
        { yPercent: -30 },
        { yPercent: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 20%", scrub: 1.2 } }
      );
      gsap.from(".ft-col, .ft-cta > *", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer id="contact" className="ft" ref={root}>
      <style>{css}</style>
      <div className="ft-in" ref={inner}>
        <pre className="sec-rule">{rule("06 / JOIN THE COMMUNITY", 72)}</pre>

        <div className="ft-ascii-wrap">
          <AsciiReveal lines={BANNER} className="ft-ascii" trigger="view" duration={2} delay={0.1} />
        </div>

        <div className="ft-cta">
          <h2 className="serif">
            Big ideas, cool projects, <em>and great people.</em> You in?
          </h2>
          <a className="btn btn-solid" href={JOIN} target="_blank" rel="noreferrer">
            Join FOSS →
          </a>
        </div>

        <div className="ft-cols">
          <div className="ft-col">
            <h4>Explore</h4>
            {NAV.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={(e) => (e.preventDefault(), goTo(id))}>
                <DecryptedText text={label} />
              </a>
            ))}
          </div>
          <div className="ft-col">
            <h4>Elsewhere</h4>
            {SOCIALS.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer">
                <DecryptedText text={label + " ↗"} />
              </a>
            ))}
          </div>
          <div className="ft-col">
            <h4>Find us</h4>
            <p>
              FOSS Cell, Govt. Model Engineering College
              <br />
              Thrikkakara, Kochi
              <br />
              Kerala, India
            </p>
            <a href="https://github.com/FossMec/website" target="_blank" rel="noreferrer">
              <DecryptedText text="Original site source ↗" />
            </a>
          </div>
        </div>

        <div className="ft-bar">
          <a href="https://github.com/FossMec/website" target="_blank" rel="noreferrer">
            🄯 {new Date().getFullYear()} FOSS MEC — Free Open Source Forever
          </a>
          <span className="ft-stack">React · GSAP · Lenis · Vanta.js</span>
          <button onClick={() => goTo("home")}>
            <DecryptedText text="BACK TO TOP ↑" />
          </button>
        </div>
      </div>
    </footer>
  );
}

const css = `
.ft{position:relative;z-index:0;overflow:hidden;background:var(--bg);border-top:1px solid var(--line);transition:background .6s}
.ft-in{max-width:1320px;margin:0 auto;padding:clamp(4rem,10vh,7rem) clamp(1rem,5vw,3rem) 1.6rem;will-change:transform}
.ft-ascii-wrap{margin:clamp(2rem,5vh,3.5rem) 0;overflow:hidden}
.ft-ascii{font-size:min(2.28vw,30.5px);line-height:1;color:var(--fg);letter-spacing:0;font-weight:500}
.ft-cta{display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;flex-wrap:wrap;padding-bottom:clamp(2.5rem,6vh,4rem);border-bottom:1px solid var(--line)}
.ft-cta h2{font-weight:700;font-size:clamp(1.3rem,2.7vw,2.5rem);line-height:1.15;letter-spacing:-.05em;max-width:24ch}
.ft-cta em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;padding-right:.07em}
.ft-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;padding:clamp(2rem,5vh,3.2rem) 0}
.ft-col{display:flex;flex-direction:column;gap:.55rem;font-size:13px;align-items:flex-start}
.ft-col h4{font-weight:400;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-bottom:.4rem}
.ft-col a{border-bottom:1px solid transparent;transition:border-color .3s,color .3s}
.ft-col a:hover{border-color:var(--accent2);color:var(--accent2)}
.ft-col p{color:var(--muted);line-height:1.8}
.ft-bar{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;padding-top:1.4rem;border-top:1px solid var(--line);
  font-size:11.5px;letter-spacing:.08em;color:var(--muted)}
.ft-bar a:hover,.ft-bar button:hover{color:var(--accent2)}
.ft-bar button{letter-spacing:.14em;font-size:11.5px}

@media (max-width:760px){
  .ft-ascii{font-size:2.15vw}
  .ft-cols{grid-template-columns:1fr 1fr}
  .ft-cols .ft-col:last-child{grid-column:1/-1}
  .ft-bar{flex-direction:column;align-items:flex-start}
}
`;
