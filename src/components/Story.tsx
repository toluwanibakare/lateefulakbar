"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Volume2, Users } from "lucide-react";
import { EVENT, PHOTOS } from "@/lib/site";
import { Eyebrow, Reveal } from "./ui";

function Ticker() {
  const words = [
    "Yaa Lateef", "-", "GRACE", "-", "LENIENCY", "-", "KINDNESS", "-", "DHIKR", "-", "DU‘Ā", "-", "THE GRANDEUR GATHERING OF SUBLIME MINDS", "-", "SEEKING WITH ONE VOICE", "-", "TBS LAGOS", "-", EVENT.dateShort, "-"
  ];
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
                  w === "-"
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
  { n: "90k+", l: "Physical worshippers in white at TBS" },
  { n: "100k+", l: "Online participants joining live" },
  { n: "100% Free", l: "Open to every worshipper without cost" },
  { n: "Billions", l: "Yaa Lateef tasbīh recitations" },
];

const NEEDS = [
  { text: "For the one seeking provision.", detail: "Restoration in livelihood & doors opened" },
  { text: "For the family seeking peace.", detail: "Harmonious homes & tranquility in hearts" },
  { text: "For the business seeking revival.", detail: "Barakah and relief from hardship" },
  { text: "For the heart seeking direction.", detail: "Clarity, guidance and spiritual warmth" },
  { text: "For the nation seeking mercy.", detail: "Protection, grace and collective ease" },
];

const REASONS_TO_ATTEND = [
  { title: "Come with your worries", desc: "Lay down heavy burdens in the presence of Allah." },
  { title: "Come with your dreams", desc: "Ask for what seems impossible — nothing is hard for Al-Lateef." },
  { title: "Come with your unanswered prayers", desc: "Join tens of thousands in collective intercession." },
  { title: "Come with gratitude", desc: "Praise Him for unseen subtle kindnesses received." },
];

const EXPECT = [
  {
    icon: Volume2,
    t: "Collective Dhikr & Salawāt",
    d: "The Yaa Lateef recitation rises as one sound — led from the stage, answered by the whole Square.",
    img: "/assets/crowd-48.jpg",
  },
  {
    icon: Sparkles,
    t: "Qur’anic Reflection & Guidance",
    d: "Short, weighty reminders between recitations. No noise — every word placed with care.",
    img: "/assets/crowd-54.jpg",
  },
  {
    icon: Users,
    t: "One Ummah Seated in White",
    d: "Brothers and sisters in ordered canopies; elders, youth and first-time guests side by side.",
    img: "/assets/lateefulakbar-88.jpg",
  },
  {
    icon: Heart,
    t: "Guided Du‘ā for Life Struggles",
    d: "Sincere supplication, repentance and reliance upon Him — seeking Allah with one voice.",
    img: "/assets/crowd-58.jpg",
  },
];

const ORDER = [
  { time: "08:00", title: "Gates & Settling", note: "Accreditation, seating by canopy, quiet recitation." },
  { time: "09:30", title: "Opening & Bismillah", note: "Welcome from Nadwat, intentions set together." },
  { time: "10:30", title: "Yaa Lateef — First Sitting", note: "The long collective dhikr. Water moves through rows." },
  { time: "12:30", title: "Reflection & Scholars", note: "Reminders from the founder and guest scholars." },
  { time: "14:00", title: "The Grand Du‘ā", note: "Tens of thousands asking as one. The day’s peak." },
  { time: "15:00", title: "Closing & Dispersal", note: "Orderly exit by section, lost-and-found at the gates." },
];

export default function Story() {
  const fullRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: fullRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <>
      <Ticker />

      {/* Hero Card Banner: Thousands of Hearts */}
      <section id="gathering" className="bg-paper border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <Eyebrow>The Grandeur Gathering Of Sublime Minds</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="font-display text-balance mt-4 text-4xl leading-[1.05] font-light tracking-tight text-ink sm:text-6xl">
                  Thousands of hearts.
                  <br />
                  Countless prayer points.
                  <br />
                  <span className="text-fern font-normal">One Merciful Lord. YAA LATEEF.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-faded sm:text-lg">
                  What a Gathering is Lateef ul Akbar! Tens of thousands gathered under one banner:{" "}
                  <strong className="font-semibold text-ink">Yaa Lateef — Intercede for us with Your Grace and Kindness.</strong>
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="/register"
                    className="bg-vivid px-7 py-3.5 text-sm font-semibold text-white hover:bg-vivid-deep transition-colors inline-flex items-center gap-2"
                  >
                    <span>Reserve your place — Free</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <div className="font-mono text-xs text-faded bg-mist px-4 py-3 border border-ink/10">
                    <span className="font-semibold text-pine">Sunday, 24 January 2027</span> · #LateefulAkbar2027
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="relative lg:col-span-5">
              <Reveal className="relative" delay={0.1}>
                <div className="relative aspect-[4/5] overflow-hidden bg-mist border border-ink/10 shadow-xl">
                  <Image
                    src="/assets/celebrity.jpg"
                    alt="Celebrity guest seated at Tafawa Balewa Square"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="img-true object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pine/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p lang="ar" className="font-arabic text-2xl text-sage">يَا لَطِيفُ</p>
                    <p className="text-xs uppercase tracking-widest text-white/80 mt-1">TBS Lagos · 24 January 2027</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Cards: What is Lateeful Akbar? & Why Yaa Lateef? */}
      <section className="bg-cream py-16 sm:py-24 border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Card 1: What is Lateeful Akbar? */}
            <Reveal delay={0.05}>
              <div className="h-full border border-ink/15 bg-white p-8 sm:p-10 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-fern font-semibold">01 · Purpose</span>
                  <h2 className="font-display mt-3 text-3xl font-light text-ink sm:text-4xl">
                    What is Lateeful Akbar?
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-faded sm:text-lg">
                    Lateeful Akbar is a large spiritual gathering centred on <strong className="font-semibold text-ink">Du‘ā, Dhikr, Salawāt</strong> and seeking the infinite mercy and subtle kindness of Allah — <strong className="font-semibold text-pine">Al-Lateef</strong>.
                  </p>
                </div>
                <div className="mt-8 border-t border-ink/10 pt-4 flex items-center gap-3 text-xs text-fern font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>Du‘ā · Dhikr · Salawāt · Infinite Mercy</span>
                </div>
              </div>
            </Reveal>

            {/* Card 2: Why Yaa Lateef? */}
            <Reveal delay={0.12}>
              <div className="h-full border border-ink/15 bg-pine p-8 sm:p-10 text-white flex flex-col justify-between shadow-sm">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-sage font-semibold">02 · The Divine Name</span>
                  <h2 className="font-display mt-3 text-3xl font-light text-white sm:text-4xl">
                    Why “Yaa Lateef”?
                  </h2>
                  <p lang="ar" className="font-arabic mt-3 text-3xl text-sage">أللَّطِيفُ</p>
                  <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                    <strong className="font-semibold text-white">Al-Lateef</strong> is one of the Beautiful Names of Allah — <strong className="font-semibold text-sage">The Most Subtle, The Most Kind</strong>. He reaches His servants in ways they may never see coming.
                  </p>
                </div>
                <div className="mt-8 border-t border-white/20 pt-4 text-xs text-sage italic">
                  “He reaches His servants in ways they may never see coming.”
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section: Why Do We Gather? & Its Spiritual Foundation */}
      <section className="bg-paper py-16 sm:py-24 border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <Eyebrow>03 · Unity & Foundation</Eyebrow>
                <h2 className="font-display mt-4 text-3xl font-light text-ink sm:text-5xl leading-tight">
                  Why Do We Gather?
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-faded">
                  Because there are moments when the Ummah must come together with different struggles but <strong className="font-semibold text-ink">one Lord, one hope and one collective Du‘ā.</strong>
                </p>
              </Reveal>

              <Reveal delay={0.12} className="mt-8">
                <div className="border-l-4 border-vivid bg-mist p-6">
                  <p className="text-xs uppercase tracking-widest text-fern font-semibold">Its Spiritual Foundation</p>
                  <p className="mt-3 text-base italic text-ink font-medium">
                    Allah says: “And to Allah belong the Most Beautiful Names, so call upon Him by them.”
                  </p>
                  <p className="mt-1 text-xs font-mono text-faded">— Qur’an 7:180</p>
                  <p className="mt-4 text-sm text-faded leading-relaxed">
                    Lateeful Akbar is built upon remembrance of Allah, sincere supplication, repentance and reliance upon Him.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* A Gathering of Needs */}
            <div className="lg:col-span-6">
              <Reveal delay={0.16}>
                <div className="border border-ink/15 bg-cream p-8 sm:p-10 shadow-sm">
                  <h3 className="font-display text-3xl font-light text-ink">
                    A Gathering of Needs
                  </h3>
                  <p className="mt-2 text-sm text-faded">Every heart comes with a story. We turn them all to Allah.</p>

                  <ul className="mt-6 space-y-4">
                    {NEEDS.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 border-b border-ink/10 pb-3 last:border-0 last:pb-0">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vivid/10 text-xs font-bold text-vivid">
                          ✓
                        </span>
                        <div>
                          <p className="text-base font-medium text-ink">{item.text}</p>
                          <p className="text-xs text-faded">{item.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 bg-pine px-5 py-4 text-center text-white">
                    <p className="font-display text-xl font-light">We turn them all to Allah.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why Should You Attend? */}
      <section className="bg-mist py-16 sm:py-24 border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <Reveal>
              <Eyebrow>04 · An Invitation to All</Eyebrow>
              <h2 className="font-display mt-3 text-4xl font-light text-ink sm:text-5xl">
                Why Should You Attend?
              </h2>
              <p className="mt-3 text-base text-faded">
                No matter where you are in your spiritual journey, the gates of TBS are open to you.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS_TO_ATTEND.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.06}>
                <div className="h-full border border-ink/15 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-xs text-vivid font-bold">0{i + 1}</div>
                    <h3 className="font-display mt-3 text-xl font-medium text-ink">{r.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-faded">{r.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="mt-10 text-center">
            <div className="inline-block bg-vivid text-white px-8 py-5 text-xl sm:text-2xl font-display font-light shadow-md">
              But above all, <strong className="font-normal underline decoration-sage decoration-2 underline-offset-4">come seeking Allah.</strong>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Numbers Band */}
      <div className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-ink/10 px-5 sm:px-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.06} className="px-5 py-8 sm:px-8 sm:py-10">
              <p className="font-display text-5xl font-light text-pine sm:text-6xl">{s.n}</p>
              <p className="mt-2 text-[13px] leading-snug text-faded">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Full-screen Media Moment */}
      <section ref={fullRef} className="relative overflow-hidden bg-ink text-white">
        <motion.div style={{ y }} className="absolute inset-0 scale-110" aria-hidden>
          <Image
            src={PHOTOS.cannonCrowd}
            alt="Crowd at Tafawa Balewa Square"
            fill
            sizes="100vw"
            className="img-true object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-ink/45" />
        </motion.div>
        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-end px-5 py-20 sm:px-6 md:py-28">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage">
              05 — The Atmosphere
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-balance mt-4 max-w-4xl text-4xl leading-[1.02] font-light sm:text-6xl">
              The sound of tens of thousands whispering one Name.
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/80">
              Sisters under the great canopy, brothers filling the hall, water lifted mid-du‘ā —
              this is what Tafawa Balewa Square looks like when a city decides to ask together.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 06 - Four Movements of the Morning */}
      <section className="bg-paper border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
          <Reveal>
            <Eyebrow>06 — What to Expect</Eyebrow>
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

      {/* 07 - Order of the Day */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-fern">
                <span className="inline-block h-px w-10 bg-vivid/70" aria-hidden />
                07 — Order of the Day
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display text-balance mt-5 text-4xl leading-tight font-light text-ink sm:text-5xl">
                A slow morning, held in order
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-faded">
                Times are approximate — the dhikr sets the pace, not the clock. Stewards guide
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
