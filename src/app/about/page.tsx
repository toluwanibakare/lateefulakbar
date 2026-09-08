import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarDays, HeartHandshake, MapPin, Moon, Shirt, Users } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Eyebrow, Reveal } from "@/components/ui";
import { EVENT } from "@/lib/site";

export const metadata = {
  title: "About the Event — Lateef ul-il-Akbar-Il-A’azam 2027",
  description:
    "What Lateef ul-il-Akbar-Il-A’azam is, who hosts it, when and where it holds, who should come, and what the day feels like.",
};

const FACTS = [
  { icon: CalendarDays, k: "Date", v: EVENT.dateLong },
  { icon: MapPin, k: "Venue", v: EVENT.venue },
  { icon: Shirt, k: "Dress code", v: EVENT.dressCode },
  { icon: Users, k: "Entry", v: "Free — registration required for accreditation" },
];

const PILLARS = [
  {
    icon: Moon,
    t: "Dhikr",
    d: "The long collective recitation of Yaa Lateef — led from the stage, answered by the whole Square as one sound.",
  },
  {
    icon: HeartHandshake,
    t: "Du‘ā",
    d: "One grand supplication in the afternoon — tens of thousands asking together. The peak of the day.",
  },
  {
    icon: BookOpenText,
    t: "Reflection",
    d: "Short, weighty reminders from the convener and guest scholars between recitations. Every word placed with care.",
  },
  {
    icon: Users,
    t: "Unity",
    d: "Brothers and sisters in ordered canopies; elders, youth and first-time guests side by side, all in white.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={<>About the event</>}
        arabic="لَطِيفُ الْخَبِير"
        intro="Lateef ul-il-Akbar-Il-A’azam is Nadwat Global Assembly's grand seating of dhikr and du‘ā — one day, one square, tens of thousands in white, gathered under the Name Yaa Lateef, The Most Kind."
        image="/assets/crowd-49.jpg"
      />

      {/* What it is */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
          <div>
            <Reveal>
              <Eyebrow>What it is</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display text-balance mt-4 text-4xl leading-tight font-light tracking-tight sm:text-5xl">
                A single act of worship in a day, from different locations before the Lord of all angles
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-5 max-w-xl space-y-5 text-[15px] leading-relaxed text-faded">
                <p>
                  There are no headline acts and no sideshows. The crowd is the event: its
                  recitation, its stillness, its asking. Guests dress alike in all white, sit
                  together in ordered canopies, and spend the day in dhikr, reflection and
                  one grand du‘ā.
                </p>
                <p>
                  It is hosted by{" "}
                  <strong className="font-semibold text-ink">Nadwat Global Assembly</strong> — an
                  Islamic society for spiritual growth, collective du‘ā, dhikr and community
                  unity upon the Qur’an and Sunnah — and convened by its Chief Missioner,{" "}
                  <Link href="/founder" className="font-semibold text-pine underline underline-offset-4 hover:text-fern">
                    Shaikh Dr. Abdur Rahman Ade Lawal
                  </Link>
                  .
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="font-script mt-6 text-3xl text-fern">Yaa Lateef, The Most Kind</p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden bg-mist">
              <Image
                src="/assets/crowd-67.jpg"
                alt="Thousands in white gathered at the Square"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="img-true object-cover"
              />
            </div>
            <p className="mt-2 text-xs text-faded italic">Previous seating — the Square in white.</p>
          </Reveal>
        </div>
      </section>

      {/* Facts */}
      <section className="border-y border-ink/10 bg-mist">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px px-5 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <Reveal key={f.k} delay={i * 0.05} className="bg-mist">
              <div className="flex gap-4 p-5">
                <f.icon className="h-5 w-5 shrink-0 text-fern" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faded">{f.k}</p>
                  <p className="mt-1 text-[15px] font-medium text-ink">{f.v}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
          <Reveal>
            <Eyebrow>What the day is built on</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display mt-4 max-w-2xl text-4xl font-light tracking-tight sm:text-5xl">
              Four movements of the morning
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.t} delay={(i % 2) * 0.08} className={i % 2 === 1 ? "md:mt-10" : ""}>
                <article className="border border-ink/10 bg-white p-6 sm:p-8">
                  <p.icon className="h-6 w-6 text-fern" />
                  <h3 className="font-display mt-4 text-2xl tracking-tight">{p.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-faded">{p.d}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="mt-10">
              <Link href="/gathering" className="group inline-flex items-center gap-2 text-sm font-semibold text-pine">
                <span className="border-b border-pine/40 pb-0.5 group-hover:border-pine">
                  See the full order of the day
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who should come + founder strip */}
      <section className="border-t border-ink/10 bg-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="font-display text-3xl font-light tracking-tight sm:text-4xl">
              Who should come?
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-faded">
              <p>
                Everyone -- Elders, youth, perpetual guests, first-timers, physical (national and international), and virtual attendees. The seating is classified by demarcation of canopies for males and females “Islam abhors the free mixing of the opposite sex”
              </p>
              <p>
                Come in clean, modest, all-white attire, with ablution and one private need
                held lightly through the recitation. That is the whole preparation the
                convener asks of newcomers.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="bg-vivid px-7 py-3.5 text-sm font-semibold text-white hover:bg-vivid-deep">
                Register free
              </Link>
              <Link href="/venue" className="border border-ink/20 px-7 py-3.5 text-sm font-semibold text-ink hover:border-pine hover:text-pine">
                Plan your visit
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <Link href="/founder" className="group block border border-ink/15 bg-white">
              <span className="relative block aspect-[16/10] overflow-hidden bg-mist">
                <Image
                  src="/assets/founder-portrait.jpg"
                  alt="Shaikh Dr. Abdur Rahman Ade Lawal"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="img-true object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </span>
              <span className="flex items-center justify-between p-5">
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-fern">The convener</span>
                  <span className="font-display mt-1 block text-xl tracking-tight">Shaikh Dr. Abdur Rahman Ade Lawal</span>
                </span>
                <ArrowRight className="h-5 w-5 text-fern transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
