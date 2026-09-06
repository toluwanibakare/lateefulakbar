"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Droplets, Moon, Users, Volume2 } from "lucide-react";
import { EVENT, PHOTOS } from "@/lib/site";
import { Eyebrow, Reveal } from "./ui";

function Ticker() {
  const words = ["Yā Lateef", "•", "Dhikr", "•", "Du‘ā", "•", "TBS Lagos", "•", EVENT.dateShort, "•"];
  const row = [...words, ...words, ...words];
  return (
    <div className="overflow-hidden bg-vivid py-3" aria-hidden>
      <div className="animate-ticker flex w-max items-center gap-6 whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-6">
            {row.map((w, i) => (
              <span
                key={`${half}-${i}`}
                className={
                  w === "•"
                    ? "text-white/60"
                    : "font-display text-sm tracking-wide text-white uppercase"
                }
              >
                {w}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const STATS = [
  { n: "40k+", l: "Worshippers in white at TBS" },
  { n: "01", l: "Morning - one collective du‘ā" },
  { n: "2", l: "Canopies - brothers & sisters" },
  { n: "∞", l: "Online hearts on the live tasbīh" },
];

const EXPECT = [
  {
    icon: Volume2,
    t: "Collective dhikr",
    d: "The Yā Lateef recitation rises as one sound - led from the stage, answered by the whole Square.",
    img: "/assets/crowd-48.jpg",
  },
  {
    icon: Moon,
    t: "Qur’anic reflection",
    d: "Short, weighty reminders between recitations. No noise - every word placed with care.",
    img: "/assets/crowd-54.jpg",
  },
  {
    icon: Users,
    t: "One ummah, seated together",
    d: "Brothers and sisters in ordered canopies; elders, youth and first-time guests side by side.",
    img: "/assets/lateefulakbar-88.jpg",
  },
  {
    icon: Droplets,
    t: "Water & shade, cared for",
    d: "Sadaqah-funded water, mats and cooling fans - so the body can stay while the heart works.",
    img: "/assets/crowd-58.jpg",
  },
];

const ORDER = [
  { time: "08:00", title: "Gates & settling", note: "Accreditation, seating by canopy, quiet recitation." },
  { time: "09:30", title: "Opening & Bismillah", note: "Welcome from Nadwat, intentions set together." },
  { time: "10:30", title: "Yā Lateef - first sitting", note: "The long collective dhikr. Water moves through rows." },
  { time: "12:30", title: "Reflection & scholars", note: "Reminders from the founder and guest scholars." },
  { time: "14:00", title: "The grand du‘ā", note: "Tens of thousands asking as one. The day’s peak." },
  { time: "15:00", title: "Closing & dispersal", note: "Orderly exit by section, lost-and-found at the gates." },
];

export default function Story() {
  const fullRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: fullRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <>
      <Ticker />

      {/* 01 - Introduction: typography dominant, image aside */}
      <section id="gathering" className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>01 - The gathering</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display text-balance mt-5 text-4xl leading-[1.05] font-light tracking-tight text-ink sm:text-6xl">
                Not a programme.
                <br />
                A <em className="font-normal text-fern">single act</em> of worship, by a city.
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-7 max-w-xl space-y-5 text-[15px] leading-relaxed text-faded sm:text-base">
                <p>
                  Lateeful-Ul-Akbar Li-A’azam is Nadwat Global Assembly’s grand sitting of dhikr -
                  thousands of men and women in all white, gathered under the name{" "}
                  <strong className="font-semibold text-ink">Yā Lateef</strong>, the Most Gentle,
                  the Most Subtle.
                </p>
                <p>
                  There are no headline acts and no sideshows. The crowd is the event: its
                  recitation, its stillness, its asking. Photographs from the last sitting say it
                  better than paragraphs - so this page shows more than it tells.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.22}>
              <a
                href="/register"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-pine"
              >
                <span className="border-b border-pine/40 pb-0.5 group-hover:border-pine">
                  Join the next sitting
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>

          {/* overlapping imagery - portrait over landscape */}
          <div className="relative lg:col-span-5">
            <Reveal className="relative" delay={0.1}>
              <div className="relative aspect-[4/5] overflow-hidden bg-mist">
                <Image
                  src="/assets/crowd-30.jpg"
                  alt="Brothers seated in white at the gathering"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="img-true object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-4 hidden w-56 overflow-hidden border-4 border-paper shadow-xl sm:block md:-left-10">
                <div className="relative aspect-square">
                  <Image
                    src="/assets/crowd-18.jpg"
                    alt="Hands raised in supplication"
                    fill
                    sizes="240px"
                    className="img-true object-cover"
                  />
                </div>
              </div>
              <p className="mt-3 text-xs tracking-wide text-faded italic md:ml-0">
                Brothers in quiet reflection - previous sitting.
              </p>
            </Reveal>
          </div>
        </div>

        {/* numbers band - large type, light green flow */}
        <div className="border-y border-ink/10 bg-mist">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-ink/10 px-5 sm:px-6 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.l} delay={i * 0.06} className="px-5 py-8 sm:px-8 sm:py-10">
                <p className="font-display text-5xl font-light text-pine sm:text-6xl">{s.n}</p>
                <p className="mt-2 text-[13px] leading-snug text-faded">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 02 - Atmosphere: full-screen media moment */}
      <section ref={fullRef} className="relative overflow-hidden bg-ink text-white">
        <motion.div style={{ y }} className="absolute inset-0 scale-110" aria-hidden>
          <Image
            src={PHOTOS.cannonCrowd}
            alt=""
            fill
            sizes="100vw"
            className="img-true object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-ink/45" />
        </motion.div>
        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-5 py-20 sm:px-6 md:py-28">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage">
              02 - The atmosphere
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-balance mt-4 max-w-4xl text-4xl leading-[1.02] font-light sm:text-6xl">
              The sound of forty thousand people whispering one Name.
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/80">
              Sisters under the great canopy, brothers filling the hall, water lifted mid-du‘ā -
              this is what the Square looks like when a city decides to ask together.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 03 - What to expect: staggered editorial, images lead */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
          <Reveal>
            <Eyebrow>03 - What to expect</Eyebrow>
          </Reveal>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <Reveal delay={0.06}>
              <h2 className="font-display text-balance max-w-xl text-4xl leading-tight font-light tracking-tight sm:text-5xl">
                Four movements of the morning
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="max-w-sm text-sm leading-relaxed text-faded">
                Come hungry to ask. Volunteers, water points and shaded seating carry the rest.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {EXPECT.map((e, i) => (
              <Reveal key={e.t} delay={(i % 2) * 0.08} className={i % 2 === 1 ? "md:mt-16" : ""}>
                <article className="group">
                  <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                    <Image
                      src={e.img}
                      alt={e.t}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="img-true object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="font-display absolute bottom-3 left-4 text-5xl font-light text-white/90 drop-shadow">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex gap-4 pt-5">
                    <e.icon className="mt-0.5 h-5 w-5 shrink-0 text-fern" />
                    <div>
                      <h3 className="font-display text-2xl tracking-tight text-ink">{e.t}</h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-faded">{e.d}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04 - Order of the day: white, green ink, asymmetrical */}
      <section className="border-t border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-fern">
                <span className="inline-block h-px w-10 bg-vivid/70" aria-hidden />
                04 - Order of the day
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display text-balance mt-5 text-4xl leading-tight font-light text-ink sm:text-5xl">
                A slow morning, held in order
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-faded">
                Times are approximate - the dhikr sets the pace, not the clock. Stewards guide
                each section in and out.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="relative mt-8 hidden aspect-[4/3] overflow-hidden lg:block">
                <Image
                  src="/assets/crowd-63.jpg"
                  alt="Scholars seated on the stage"
                  fill
                  sizes="40vw"
                  className="img-true object-cover"
                />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <ol>
              {ORDER.map((o, i) => (
                <Reveal key={o.time} delay={i * 0.05}>
                  <li className="group flex gap-6 border-t border-ink/12 py-6 last:border-b">
                    <span className="w-14 shrink-0 pt-1 font-mono text-sm text-fern">{o.time}</span>
                    <div>
                      <h3 className="font-display text-2xl tracking-tight text-ink transition-colors group-hover:text-fern">
                        {o.title}
                      </h3>
                      <p className="mt-1 max-w-lg text-sm leading-relaxed text-faded">{o.note}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
