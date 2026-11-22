import React, { useState, useEffect, useRef } from "react";

// Replace the `i` values with your full base64 strings or imported image paths
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

export default function HeroEvents() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);

  const total = EVENTS.length;

  const go = (nextIndex) => {
    setIndex((nextIndex + total) % total);
  };

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 4800);
    return () => clearInterval(timer);
  }, [paused, total]);

  const formattedCount = String(index + 1).padStart(2, "0");

  return (
    <div className="zoom" id="zoom">
      <div className="stage" id="home">
        <i id="events" />

        {/* Events Layer */}
        <div
          className="layer evl d"
          id="evl"
          aria-label="Events"
          style={{ pointerEvents: "auto" }}
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
                ref={trackRef}
                style={{
                  transform: `translateX(calc(50vw - min(40vw, 220px) - ${index} * (min(80vw, 440px) + 20px)))`,
                }}
              >
                {EVENTS.map((ev, i) => (
                  <article
                    key={ev.t}
                    className={`ev ${i === index ? "on" : ""}`}
                    onClick={() => go(i)}
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
                key={index}
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
                onClick={() => go(index - 1)}
              >
                ←
              </button>
              <button
                id="nx"
                type="button"
                aria-label="Next event"
                onClick={() => go(index + 1)}
              >
                →
              </button>
              <small>{paused ? "paused" : "auto-scrolling"}</small>
            </div>
          </div>
        </div>

        {/* Hero Layer */}
        <div className="layer hero d" id="hero">
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
              <pre id="asc" aria-hidden="true" />
            </div>
            <pre id="word" aria-hidden="true">
              events
            </pre>
          </div>
          <pre id="wo" aria-hidden="true">
            events
          </pre>
          <div className="info" id="info">
            <p className="tg">
              Free and Open Source Software cell of Government Model Engineering
              College, Kochi. Student-led, open to everyone.
            </p>
            <p className="sc">
              $ scroll: one of these words is not like the others
              <span className="cur" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}