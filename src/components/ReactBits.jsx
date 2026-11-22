/*
 * React Bits–style building blocks (https://reactbits.dev), re-implemented
 * here so the whole site stays dependency-light and CSS stays in-component.
 *
 *  - DecryptedText   hover / on-view text scramble
 *  - SpotlightCard   cursor-following spotlight on a card
 *  - ScrollVelocity  marquee that speeds up / reverses with Lenis scroll velocity
 *  - AsciiReveal     scramble-in for ASCII art (line sweep)
 *
 * Render <ReactBitsStyles /> once (App.jsx does it).
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCRAMBLE = "!<>-_\\/[]{}=+*^?#%&01";

/* ---------------------------------------------------------- DecryptedText */
export function DecryptedText({ text, className = "", speed = 28, onView = false, as: Tag = "span" }) {
  const [out, setOut] = useState(text);
  const ref = useRef(null);
  const timer = useRef(null);

  const run = useCallback(() => {
    clearInterval(timer.current);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      setOut(
        text
          .split("")
          .map((c, k) => (c === " " || k < i ? c : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0]))
          .join("")
      );
      if (i >= text.length) {
        clearInterval(timer.current);
        setOut(text);
      }
    }, speed);
  }, [text, speed]);

  useEffect(() => setOut(text), [text]);

  useEffect(() => {
    if (!onView || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [onView, run]);

  useEffect(() => () => clearInterval(timer.current), []);

  return (
    <Tag ref={ref} className={`rb-decrypt ${className}`} onMouseEnter={run} onFocus={run} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </Tag>
  );
}

/* ---------------------------------------------------------- SpotlightCard */
export function SpotlightCard({ children, className = "", as: Tag = "div", ...rest }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Tag className={`rb-spot ${className}`} onPointerMove={onMove} {...rest}>
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------- ScrollVelocity */
export function ScrollVelocity({ rows }) {
  const root = useRef(null);

  useEffect(() => {
    const tracks = [...root.current.querySelectorAll(".rb-sv-track")];
    const st = tracks.map(() => ({ x: 0, w: 1, flip: 1 }));
    const measure = () =>
      tracks.forEach((t, i) => {
        st[i].w = t.firstElementChild.getBoundingClientRect().width || 1;
      });
    measure();
    window.addEventListener("resize", measure);
    if (document.fonts) document.fonts.ready.then(measure);

    let skew = 0;
    const tick = (_time, dt) => {
      const v = (window.__lenis && window.__lenis.velocity) || 0;
      const f = dt / 16.67;
      skew += (gsap.utils.clamp(-10, 10, -v * 0.4) - skew) * 0.1;
      tracks.forEach((t, i) => {
        const s = st[i];
        const row = rows[i];
        if (v > 0.15) s.flip += (1 - s.flip) * 0.08;
        else if (v < -0.15) s.flip += (-1 - s.flip) * 0.08;
        s.x += (row.dir || 1) * s.flip * ((row.base ?? 0.8) + Math.abs(v) * 0.55) * f;
        const m = ((s.x % s.w) + s.w) % s.w;
        t.style.transform = `translate3d(${-m}px,0,0) skewX(${skew}deg)`;
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", measure);
    };
  }, [rows]);

  return (
    <div className="rb-sv" ref={root} aria-hidden="true">
      {rows.map((row, i) => (
        <div className={`rb-sv-row ${row.outline ? "outline" : ""}`} key={i}>
          <div className="rb-sv-track">
            {Array.from({ length: 4 }).map((_, k) => (
              <span key={k}>{row.text}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- AsciiReveal */
const RAMP = "@#%&0o*+=~:;,.";

export function AsciiReveal({ lines, className = "", trigger = "load", duration = 2.2, delay = 0.3 }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const rows = lines.length;
    const noise = lines.map((l) => Array.from(l, () => Math.random()));
    const final = lines.join("\n");
    const obj = { p: 0 };

    const render = () => {
      el.textContent = lines
        .map((l, r) =>
          Array.from(l, (c, q) => {
            if (c === " ") return " ";
            const th = (r / rows) * 0.7 + noise[r][q] * 0.3;
            if (obj.p >= th + 0.1) return c;
            if (obj.p >= th) return RAMP[(Math.random() * RAMP.length) | 0];
            return " ";
          }).join("")
        )
        .join("\n");
    };

    render();
    let tw, st;
    const play = () =>
      gsap.to(obj, {
        p: 1.2,
        duration,
        delay,
        ease: "power1.inOut",
        onUpdate: render,
        onComplete: () => (el.textContent = final),
      });

    if (trigger === "view") {
      st = ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => (tw = play()) });
    } else {
      tw = play();
    }
    return () => {
      tw && tw.kill();
      st && st.kill();
      el.textContent = final;
    };
  }, [lines, trigger, duration, delay]);

  return (
    <pre ref={ref} className={`rb-ascii ${className}`} aria-hidden="true">
      {lines.join("\n")}
    </pre>
  );
}

/* ---------------------------------------------------------- styles */
const css = `
.rb-decrypt{display:inline-block;white-space:pre;cursor:default}

.rb-spot{position:relative;overflow:hidden;isolation:isolate}
.rb-spot::before{content:"";position:absolute;inset:0;z-index:-1;opacity:0;transition:opacity .35s;
  background:radial-gradient(360px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%)}
.rb-spot:hover::before{opacity:1}

.rb-ascii{font-family:'DM Mono',ui-monospace,Menlo,Consolas,monospace;white-space:pre;margin:0}

.rb-sv{overflow:hidden;padding:clamp(1.2rem,3vw,2.4rem) 0;border-block:1px solid var(--line);position:relative;z-index:2}
.rb-sv-row{overflow:hidden;font-family:'Anton',Impact,sans-serif;text-transform:uppercase;
  font-size:clamp(2.6rem,9vw,8rem);line-height:1.02;letter-spacing:.01em}
.rb-sv-track{display:flex;white-space:nowrap;will-change:transform}
.rb-sv-track span{padding-right:.6em;flex:none}
.rb-sv-row.outline{color:transparent;-webkit-text-stroke:1.5px var(--fg)}
`;

export function ReactBitsStyles() {
  return <style>{css}</style>;
}
