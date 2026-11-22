/*
 * Team.
 * Static data is scraped from foss.mec.ac.in (Sanity CMS: "teamYear" docs).
 * On mount we try the CMS live and replace the static copy if it answers.
 * Members without a photo get an ASCII avatar.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AVATAR, rule } from "./AsciiArt.jsx";
import { DecryptedText, SpotlightCard } from "./ReactBits.jsx";

gsap.registerPlugin(ScrollTrigger);

const SANITY = "https://n3rhrsv8.apicdn.sanity.io/v2026-02-21/data/query/production";
const QUERY = `*[_type=="teamYear"]|order(year desc){year,title,members[]{name,position,linkedin,github,"ref":image.asset._ref}}`;
const CDN = "https://cdn.sanity.io/images/n3rhrsv8/production/";
const LI = "https://www.linkedin.com/in/";
const GH = "https://github.com/";

/* "image-<hash>-<w>x<h>-<ext>"  →  CDN url */
const refToUrl = (ref) => {
  const m = /^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/.exec(ref || "");
  return m ? `${CDN}${m[1]}-${m[2]}.${m[3]}?w=640&auto=format&q=78` : null;
};
const full = (base, s) => (!s ? null : /^https?:/.test(s) ? s.split("?")[0].replace(/^http:/, "https:") : base + s);
// m(name, position, linkedinHandle, githubHandle, sanityImageRef)
const m = (name, position, li, gh, ref) => ({ name, position, linkedin: full(LI, li), github: full(GH, gh), img: refToUrl(ref) });
const initials = (n) => n.replace(/^Dr\.?\s*/i, "").split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export const TEAM_STATIC = [
  {
    year: 2026,
    title: "Core 2026",
    members: [
      m("Dr. Sony P", "Staff Advisor", "dr-sony-p-76332245", null, "image-de9ff4b2b005440c8f8b427d5658a04b1d0623f0-300x400-webp"),
      m("Midhun Unni", "Chairperson", "midhun-unni", "midhununni457", "image-a5ca5411a060c71238e5f6b91fda4175242cbfe3-388x493-jpg"),
      m("Aditeya J Frankur", "Vice Chairperson", "aditeya-j-frankur", "aditeya24", "image-8afe2342314e398559d9ad1da38ef90fa666f00e-677x800-webp"),
      m("Abhin Krishna", "Secretary", "abhin-krishna", "dearabhin", "image-150f1316e76dfe958c811392733ac8ab28b69775-741x800-webp"),
      m("Dijith Dinesh", "Tech Lead", "dijith481", "dijith-481", "image-aad42067b204c296397a46cbc7fa436a40fd194f-800x800-webp"),
      m("Ewan John Dennis", "Content Lead", "ewanjohndennis", "ewanjohndennis", "image-130e4065e42a574c9420a4c71ec9486ef0c0c199-779x800-webp"),
      m("Niranjana A", "Design Lead", "niranjana-a-b74238334", "Niranjana-A2006", "image-f61b4db32f7774c82a671d2b859538b8a9700204-307x338-webp"),
      m("Devasangeethi S", "Design Sub-Lead", null, null, "image-e2f766bc2c97d6fb8fc0b0957e6856d62215db88-632x800-webp"),
      m("Nimah Zayn", "Events Lead", "nimah-zayn", "nimahzayn", "image-accec7cbe960896fb4ac8b30717987a8acef7b69-600x800-webp"),
      m("Fidha Fathima T J", "Events Sub-Lead", "fidha-fathima-t-j-a18436272", "fidhatj-hash", "image-cdbb8e2169a222a1829bfd72320f60283dfa0c8f-450x800-webp"),
      m("Linsa Vinod", "Marketing Lead", "linsa-vinod", "Linsavinod", "image-d9378c762f75a6273a77c63adf6ef792c83d51c8-600x800-webp"),
      m("Nehal Susan Peter", "Marketing Sub-Lead", "nehal-susan-peter-493334327", "susannehal", "image-b344c82e66f113fbaa8943297556a1559e4c2749-324x350-png"),
      m("Anan K M", "Media Lead", "anankm-67b540307", null, "image-3dfddc7ef1ca0eb135cb938676cd99bfe3448010-618x800-webp"),
      m("Akash Ashok", "Executive", "akash-ashok-dev", "Akash-Ashok-Dev", "image-00ed896854d347bef223e02ff0f91de77bae80ca-533x800-webp"),
      m("Amy Ann Jims", "Executive", "amy-ann-jims-97272537b", "Amy-code658", "image-72c89c699909ea8e9af855e07ba1c67d2f46f017-600x800-webp"),
      m("Aniketh Prashant", "Executive", "aniketh-prashant-a10b49379", "APinPower1", "image-1f975068f2b94baca63fdf481d42df5d3be7db4b-783x800-webp"),
      m("Poornendhu P Kumar", "Executive", "poornendhu-p-kumar-89aab137b", "poornendhupkumar-afk", "image-0836fc556f5b0f6e454531a994f460ab4370deb2-600x800-webp"),
      m("Aswin Ashok", "Executive", "aswin-ashok-dev", "ASWIN-ASHOK-dev", "image-28bb7b2f00b4d4857033992a96ece4256250a7ce-533x800-webp"),
      m("Rudra Raj", "Executive", "rudra-raj-60b8a537a", "rudramecraj-cloud", "image-ceeb6896002eb0538f6833e5e26681988fdde47a-359x800-webp"),
      m("Gautham Chandra E A", "Executive", null, null, "image-d073278291aac22b358c48c315056489c4d871d1-450x800-webp"),
      m("Srihari D", "Executive", "srihari-d-2426aa375", null, "image-364760822ad5fd5faa0080b28899d9ebf09d6d18-600x800-webp"),
      m("Neha Anand", "Executive", "nehaanand9106", "nehaanand9106", "image-d25c214d1f555b223179c03162e73a745b175696-442x800-webp"),
    ],
  },
  {
    year: 2025,
    title: "Core 2025",
    members: [
      m("Dr. Sony P", "Staff In-Charge", "dr-sony-p-76332245"),
      m("Yasir", "Chairperson", "mohammed-yasir-k-n", "mohdyasirkn"),
      m("Vasanth", "Vice Chairperson", "vasanth1337", "1337kid"),
      m("Sreepriya", "Secretary", "sreepriya-km", "sreepriyakmo4"),
      m("Allan", "Treasurer", "allan-thomas-530970285"),
      m("Varun", "Community Lead"),
      m("Nikesh", "Open Hardware Advocate", "nikesh-tv", "Nikesh-tv"),
      m("Pranav", "AI/ML Lead", "pranav-p-s-12a503295"),
      m("Ben Franklin", "Marketing Lead", "benfranklinms", "Benfranklinms"),
      m("Mary", "Marketing Sub-Lead", "mary-john-056a00292"),
      m("Khushi", "Content Lead", "khushi-nilesh-ved"),
      m("Anagha", "Content Sub-Lead", "anagha-d-aa6a95292"),
      m("Janeeta", "Design Lead", "janeeta-jolly", "JaneetaJolly"),
      m("Steffi", "Design Sub-Lead", "steffi-lazar", "steffilazar01"),
      m("Midhun", "Tech Lead", "midhun-unni", "midhununni457"),
      m("Joel", "Web Lead", "joel-roshan-1b1a307a", "joel-roshan"),
      m("Aaron", "Web Sub-Lead", "aarongeorgeabraham", "Aaron-53"),
      m("Asil", "Events Lead", "asilmehaboob", "AsilMehaboob"),
      m("Gowri", "Events Sub-Lead", "gowrikrishna-k-u", "Gowriku"),
      m("Abhay", "UI/UX Lead", "abhaybalakrishnan", "ABHAY-100"),
      m("Dijith", "Executive", "dijith481", "dijith-481"),
      m("Aditeya", "Executive", "aditeya-j-frankur", "aditeya24"),
      m("Anan", "Executive", "anankm-67b540307"),
      m("Amith", "Executive", "amith-sreekumar-401a58329"),
      m("Abhin", "Executive", "abhin-krishna", "dearabhin"),
      m("Ewan", "Executive", "ewanjohndennis", "Ewanjohndennis"),
      m("Nimah", "Executive", "nimah-zayn", "nimahzayn"),
    ],
  },
  {
    year: 2024,
    title: "Core 2024",
    members: [
      m("Dr. Sony P", "Staff In-Charge", null, null, "image-ead2780777d77be2f12c45f57567dfbf08312241-500x500-png"),
      m("Nikhil", "Chair", null, null, "image-fcb64066a97ad5a663dc3911740dbfa8085a6724-1024x1024-png"),
      m("Varun", "Vice Chair", null, null, "image-4ca8caa3c303ea146794ad54037b916bc098435f-1024x1024-png"),
      m("Theertha", "Secretary", null, null, "image-a9157092f1ff0764ea0f9167463a45bc46a7ae5f-1024x1024-png"),
      m("Roshin", "Joint Secretary", null, null, "image-20196784f6f99c9759296759bd9b51431d5ea705-1024x1024-png"),
      m("Alan", "Open Hardware Advocate", null, null, "image-5bffcfe4367ddbf06c85b36bef48212a02935e8e-1024x1024-png"),
      m("Khushi", "Tech Lead", null, null, "image-13ad6a5c7b48a8aa50e56bd9ef5c4597833b2065-1024x1024-png"),
      m("Jeswin", "Treasurer", null, null, "image-a5a5c3a296a50971e551a23c7c71b5ae29cd3d55-1024x1024-png"),
      m("Pranav", "Operations Lead", null, null, "image-db61a0ccb3dd2fa376f7171fb91c6709b9dc4cb4-1024x1024-png"),
      m("Karthik", "AI/ML Lead", null, null, "image-0b09144bce987ee56e9015b30259bd9cc9a6291e-1024x1024-png"),
      m("Nikesh", "Events Lead", null, null, "image-0fea887a0b23ab8233d36efd5c7574db4e4934d1-1024x1024-png"),
      m("Sheril", "Events Sub-Lead", null, null, "image-7d049b2c1f493a0945517a2824476b02b53ddd9c-1024x1024-png"),
      m("Jaimy", "Design Lead", null, null, "image-1d8cfddbf75013b42b613ded28e2e556bbd5475f-1024x1024-png"),
      m("Anavadya", "Design Sub-Lead", null, null, "image-cef00aa47de75d7567ed680955f1a745bf0d6e8d-1024x1024-png"),
      m("Arjun", "Marketing Lead", null, null, "image-17011f271ad2f9dc595c71e9573add56d48d13aa-1024x1024-png"),
      m("Adhish", "Marketing Sub-Lead", null, null, "image-8940a9b046bdc5c7df983bee33c44c8da906bc81-1024x1024-png"),
      m("Srilakshmi", "Content Lead", null, null, "image-aeaf8a74a51c48a02f042b880130ac31050f1f2d-1024x1024-png"),
      m("Deepak", "Content Sub-Lead", null, null, "image-cccd7c9895737feaf4b7ebf65b3e918269ce1ef3-1024x1024-png"),
      m("Joel", "Web Lead", null, null, "image-9788a8e7748784123049b8f67fb5c69ed1fb4e35-1024x1024-png"),
      m("Aadithya", "Executive", null, null, "image-b80c702789916e66015baae980b24ee96fd2bb3c-1024x1024-png"),
      m("Yasir", "Executive", null, null, "image-c460ccfb514e60db96ae00eabf5fcd35e9c3bc7a-1024x1024-png"),
      m("Sreepria", "Executive", null, null, "image-7bd244b6632e42cbe682db7db74dcf207f71feee-1024x1024-png"),
      m("Vasanth", "Executive", null, null, "image-30f9ca7c0af827eca65adb70ade35cb43c2b2a1e-1024x1024-png"),
    ],
  },
  {
    year: 2023,
    title: "Core 2023",
    members: [
      m("Dr. Sony P", "Staff In-Charge"), m("Jithin", "Chair"), m("Vishnu", "Vice Chair"), m("Karthik", "Secretary"),
      m("Lisa", "GitHub Campus Expert"), m("Rahul", "Treasurer"), m("Srilakshmi", "Events Head"), m("Annu", "Design Head"),
      m("Anakha", "Content Head"), m("Mekha", "Marketing Head"), m("Theertha", "GSOC Committee Lead"), m("Jozef", "Tech Head"),
      m("Alan", "AI/ML Head"), m("Alaka", "UI/UX Head"), m("Niya", "Web Head"), m("Alfred", "App Head"),
      m("Khushi", "Executive"), m("Arjun", "Executive"), m("Roshin", "Executive"), m("Nikhil", "Executive"), m("Nikesh", "Executive"),
    ],
  },
  {
    year: 2022,
    title: "Core 2022",
    members: [
      m("Dr. Sony P", "Staff In-Charge"), m("Aneeta", "Chair"), m("Elizabeth", "Vice Chair"), m("John", "Inclusivity Lead"),
      m("Alfred", "Community Lead"), m("Mayon", "Secretary"), m("Jithin", "Joint Secretary"), m("Adam", "Tech Lead"),
      m("Salman", "Tech Sub-Lead"), m("Jeswin", "Design Lead"), m("Sony", "Content Lead"),
      m("Parvathy", "Second Year Representative"), m("Karthik", "Second Year Representative"),
      m("Sreearvathy", "Second Year Representative"), m("Subramani", "Second Year Representative"),
    ],
  },
  {
    year: 2021,
    title: "Core 2021",
    members: [
      m("Dr. Sony P", "Staff In-Charge"), m("Mohita Bipin", "Chairperson"), m("Malavika R Vikraman", "General Manager"),
      m("Prithvi Chandra", "Inclusivity Lead"), m("Pranav Shridhar", "Tech Lead"), m("Varun Krishna S", "Advocacy Lead"),
      m("Emmanuel Antony", "Community Lead"), m("Aneetta Mary Sajan", "Joint Secretary"), m("T Megha", "Joint Secretary"),
      m("Alfred Pius", "Outreach Lead"), m("Jessica Jolly", "Design Lead"), m("Sreejaya V S", "Content Lead"),
      m("Durga Santhosh", "Second Year Representative"), m("Mayon Francis", "Second Year Representative"),
      m("Hanna Salam", "Second Year Representative"), m("Adam Oommen Jacob", "Second Year Representative"),
    ],
  },
  {
    year: 2020,
    title: "Core 2020",
    members: [
      m("Sharat P Raju", "Staff In-charge"), m("Aswin G", "Chairperson"), m("Priyanga P", "Vice Chair"), m("Aswin M", "General Secretary"),
      m("Sneha Saj", "Initiatives Head"), m("Arun H", "Treasurer"), m("Varun Krishna S", "Joint Secretary"), m("Lakshmi Sunil", "Joint Secretary"),
      m("Emmanuel Antony", "Second Year Core"), m("Ameen Azeez", "Second Year Core"), m("Pranav Shridhar", "Second Year Core"),
      m("Nikita Menon", "First Year Core"), m("Aditiya Anilkumar", "First Year Core"), m("Zailesh A R", "First Year Core"),
    ],
  },
];

/* ------------------------------------------------------------------ */
function Member({ p }) {
  const [bad, setBad] = useState(false);
  const photo = p.img && !bad;
  return (
    <div className="tm-slot">
      <SpotlightCard as="article" className="tm-card">
        <div className="tm-photo">
          {photo ? (
            <img src={p.img} alt={`${p.name}, ${p.position}`} loading="lazy" draggable="false" onError={() => setBad(true)} />
          ) : (
            <div className="tm-ascii" aria-hidden="true">
              <pre>{AVATAR.join("\n")}</pre>
              <b>{initials(p.name)}</b>
            </div>
          )}
        </div>
        <div className="tm-info">
          <p className="tm-role">
            <DecryptedText text={p.position.toUpperCase()} />
          </p>
          <h3 className="tm-name serif">{p.name}</h3>
          {(p.linkedin || p.github) && (
            <div className="tm-links">
              {p.linkedin && (
                <a href={p.linkedin} target="_blank" rel="noreferrer" aria-label={`${p.name} on LinkedIn`}>
                  in ↗
                </a>
              )}
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" aria-label={`${p.name} on GitHub`}>
                  gh ↗
                </a>
              )}
            </div>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
}

export default function Team() {
  const [teams, setTeams] = useState(TEAM_STATIC);
  const [year, setYear] = useState(TEAM_STATIC[0].year);
  const sec = useRef(null);
  const grid = useRef(null);

  /* live refresh from the CMS */
  useEffect(() => {
    const ctl = new AbortController();
    fetch(`${SANITY}?query=${encodeURIComponent(QUERY)}`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(({ result }) => {
        if (!Array.isArray(result) || !result.length) return;
        const next = result
          .filter((t) => t.year && Array.isArray(t.members) && t.members.length)
          .map((t) => ({
            year: t.year,
            title: t.title || `Core ${t.year}`,
            members: t.members
              .filter((x) => x && x.name)
              .map((x) => ({
                name: x.name,
                position: x.position || "Member",
                linkedin: full(LI, x.linkedin),
                github: full(GH, x.github),
                img: refToUrl(x.ref),
              })),
          }))
          .sort((a, b) => b.year - a.year);
        if (next.length) {
          setTeams(next);
          setYear((y) => (next.some((t) => t.year === y) ? y : next[0].year));
        }
      })
      .catch(() => {});
    return () => ctl.abort();
  }, []);

  const current = teams.find((t) => t.year === year) || teams[0];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cols = Math.max(1, getComputedStyle(grid.current).gridTemplateColumns.split(" ").length);
      const lag = [0, 90, 30, 120, 60];
      const slots = gsap.utils.toArray(".tm-slot");

      slots.forEach((slot, i) => {
        const off = cols > 1 ? lag[(i % cols) % lag.length] : 0;
        // column parallax: each column drifts at its own speed
        gsap.fromTo(slot, { y: off }, { y: -off * 0.45, ease: "none", scrollTrigger: { trigger: grid.current, start: "top bottom", end: "bottom top", scrub: 1.3 } });
        // reveal: curtain on the photo + rise of the card
        const card = slot.firstElementChild;
        const photo = card.querySelector(".tm-photo");
        gsap.fromTo(card, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: slot, start: "top 94%" } });
        gsap.fromTo(photo, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: slot, start: "top 94%" } });
      });

      gsap.fromTo(".tm-ghost", { xPercent: 0 }, { xPercent: -42, ease: "none", scrollTrigger: { trigger: sec.current, start: "top bottom", end: "bottom top", scrub: 1.6 } });
      gsap.from(".tm-head > *", { y: 50, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: ".tm-head", start: "top 85%" } });
    }, sec);
    return () => ctx.revert();
  }, [year, teams]);

  const pickYear = (y) => {
    if (y === year) return;
    setYear(y);
    // let the new grid mount, then recompute trigger positions
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <section id="team" className="tm" ref={sec}>
      <style>{css}</style>
      <div className="tm-ghost" aria-hidden="true">TEAM TEAM TEAM</div>
      <div className="tm-in">
        <div className="tm-head">
          <pre className="sec-rule">{rule("04 / TEAM")}</pre>
          <h2 className="tm-title serif">
            The people behind <em>the commits</em>
          </h2>
          <div className="tm-tabs" role="tablist" aria-label="Choose a core team">
            {teams.map((t) => (
              <button key={t.year} role="tab" aria-selected={t.year === year} className={t.year === year ? "on" : ""} onClick={() => pickYear(t.year)}>
                {t.title}
              </button>
            ))}
          </div>
          <p className="tm-meta">
            {current.title} · {current.members.length} members
          </p>
        </div>

        <div className="tm-grid" ref={grid} key={current.year}>
          {current.members.map((p, i) => (
            <Member p={p} key={p.name + i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const css = `
.tm{position:relative;padding:clamp(5rem,14vh,9rem) 0 clamp(8rem,18vh,12rem);overflow:hidden;border-top:1px solid var(--line)}
.tm-ghost{position:absolute;top:3rem;left:0;white-space:nowrap;font-family:'Anton',Impact,sans-serif;font-size:clamp(10rem,30vw,30rem);line-height:1;
  color:transparent;-webkit-text-stroke:1px var(--line);pointer-events:none;user-select:none;will-change:transform}
.tm-in{position:relative;max-width:1320px;margin:0 auto;padding:0 clamp(1rem,5vw,3rem)}
.tm-head{display:flex;flex-direction:column;gap:1.1rem;margin-bottom:clamp(2.5rem,7vh,4.5rem)}
.tm-title{font-weight:900;font-size:clamp(2.2rem,5.6vw,5.4rem);line-height:.98;letter-spacing:-.025em;max-width:14ch}
.tm-title em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;padding-right:.07em}
.tm-tabs{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.6rem}
.tm-tabs button{font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;padding:.5rem 1rem;border:1px solid var(--line);border-radius:999px;transition:background .3s,color .3s,border-color .3s}
.tm-tabs button:hover{border-color:var(--fg)}
.tm-tabs button.on{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.tm-meta{font-size:12px;letter-spacing:.12em;color:var(--muted);text-transform:uppercase}

.tm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(1rem,2vw,1.8rem);padding-bottom:130px}
.tm-slot{will-change:transform}
.tm-card{border:1px solid var(--line);border-radius:16px;background:var(--card);backdrop-filter:blur(6px);transition:transform .5s cubic-bezier(.2,.8,.2,1),border-color .4s}
.tm-card:hover{transform:translateY(-6px);border-color:var(--fg)}
.tm-photo{position:relative;aspect-ratio:3/4;overflow:hidden;background:color-mix(in srgb,var(--fg) 7%,transparent);border-bottom:1px solid var(--line)}
.tm-photo img{width:100%;height:100%;object-fit:cover;object-position:50% 20%;filter:grayscale(1) contrast(1.06);transform:scale(1.04);
  transition:filter .6s,transform .9s cubic-bezier(.2,.8,.2,1)}
.tm-card:hover .tm-photo img{filter:none;transform:scale(1.1)}
.tm-ascii{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;color:var(--muted)}
.tm-ascii pre{font-family:'DM Mono',monospace;font-size:clamp(11px,1.15vw,15px);line-height:1.15;color:var(--accent)}
.tm-ascii b{font-family:'Anton',Impact,sans-serif;font-weight:400;font-size:clamp(2rem,3.4vw,3rem);letter-spacing:.06em;color:var(--fg)}
.tm-info{padding:.95rem 1rem 1.1rem;display:flex;flex-direction:column;gap:.35rem}
.tm-role{font-size:10.5px;letter-spacing:.14em;color:var(--accent3);min-height:1.2em}
.tm-name{font-weight:700;font-size:clamp(1.1rem,1.6vw,1.45rem);line-height:1.1}
.tm-links{display:flex;gap:.9rem;margin-top:.25rem;font-size:11.5px;letter-spacing:.08em}
.tm-links a{border-bottom:1px solid var(--line);transition:border-color .3s,color .3s}
.tm-links a:hover{border-color:var(--accent2);color:var(--accent2)}

@media (max-width:1100px){.tm-grid{grid-template-columns:repeat(3,1fr)}}
@media (max-width:760px){.tm-grid{grid-template-columns:repeat(2,1fr);gap:.8rem;padding-bottom:60px}.tm-info{padding:.7rem .75rem .9rem}}
`;
