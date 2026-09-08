import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import EventDashboard from "@/components/EventDashboard";
import PrayerBookViewer from "@/components/PrayerBookViewer";
import { CountdownStrip, Eyebrow, Reveal } from "@/components/ui";
import { EVENT } from "@/lib/site";

export const metadata = {
  title: "Live — Majilis Mubāshir",
  description:
    "The live dashboard for Lateef ul-il-Akbar-Il-A’azam 2027: YouTube livestream from TBS, the worldwide Yaa Lateef tasbīh, order of the day and live updates.",
};

const ORDER = [
  { time: "08:00", title: "Gates & settling", note: "Accreditation, seating by canopy." },
  { time: "09:30", title: "Opening & Bismillah", note: "Welcome from Nadwat, intentions set." },
  { time: "10:30", title: "Yaa Lateef — first sitting", note: "The long collective dhikr." },
  { time: "12:30", title: "Reflection & scholars", note: "Reminders from the convener and guests." },
  { time: "14:00", title: "The grand du‘ā", note: "Tens of thousands asking as one." },
  { time: "15:00", title: "Closing & dispersal", note: "Orderly exit by section." },
];

const UPDATES = [
  {
    time: "Until the day",
    title: "Broadcast opens 08:00 WAT, 24 January 2027",
    text: "The Nadwat TV feed appears at the top of this page. Keep it open for real-time broadcast and announcements.",
  },
  {
    time: "On the day",
    title: "Stewards post gate & seating notes here",
    text: "Canopy changes, water points, lost-and-found and dispersal order will be announced here first.",
  },
  {
    time: "After",
    title: "Final tasbīh & closing du‘ā replay",
    text: "The worldwide Yaa Lateef total is announced at closing and kept on this page.",
  },
];

export default function LivePage() {
  return (
    <>
      <PageHeader
        eyebrow="Majilis Mubāshir"
        title={<>Majlis Yaa Lateef, live from the Square</>}
        arabic="مجلس مباشر"
        intro="The live dashboard — Majlis Yaa Lateef as it happens. Watch the Nadwat TV broadcast from the Main Bowl, add your own recitations to the worldwide tasbīh, and follow the order of the day."
        image="/assets/crowd-11.jpg"
      />

      {/* Live status + event details band */}
      <section className="border-b border-ink/10 bg-pine text-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Reveal>
              <p className="inline-flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.22em]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
                Broadcast goes live {EVENT.dateLong} — 08:00 WAT
              </p>
              <p className="mt-2 text-sm text-white/70">
                {EVENT.venue} · {EVENT.dressCode} · Entry free with registration
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <CountdownStrip dark />
            </Reveal>
          </div>
        </div>
      </section>

      <EventDashboard />

      <PrayerBookViewer />

      {/* Order of the day + live updates */}
      <section className="border-t border-ink/10 bg-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
          <div>
            <Reveal>
              <Eyebrow>Order of the day</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-4 text-3xl font-light tracking-tight sm:text-4xl">
                Follow the Majlis hour by hour
              </h2>
            </Reveal>
            <ol className="mt-8">
              {ORDER.map((o, i) => (
                <Reveal key={o.time} delay={Math.min(i * 0.04, 0.15)}>
                  <li className="flex gap-5 border-t border-ink/10 py-4 last:border-b">
                    <span className="w-14 shrink-0 pt-0.5 font-mono text-sm text-fern">{o.time}</span>
                    <div>
                      <h3 className="text-[15px] font-semibold text-ink">{o.title}</h3>
                      <p className="mt-0.5 text-[13px] text-faded">{o.note}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <div>
            <Reveal>
              <Eyebrow>Live updates</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-4 text-3xl font-light tracking-tight sm:text-4xl">
                Announcements from the stewards
              </h2>
            </Reveal>
            <div className="mt-8 space-y-4">
              {UPDATES.map((u, i) => (
                <Reveal key={u.title} delay={Math.min(i * 0.05, 0.15)}>
                  <article className="border border-ink/15 bg-white p-5 sm:p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fern">
                      {u.time}
                    </p>
                    <h3 className="mt-1.5 text-[15px] font-semibold text-ink">{u.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-faded">{u.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/register" className="bg-vivid px-6 py-3 text-sm font-semibold text-white hover:bg-vivid-deep">
                  Register free
                </Link>
                <Link href="/prayer-book" className="border border-ink/20 px-6 py-3 text-sm font-semibold text-ink hover:border-pine hover:text-pine">
                  Open the prayer book
                </Link>
                <Link href="/venue" className="border border-ink/20 px-6 py-3 text-sm font-semibold text-ink hover:border-pine hover:text-pine">
                  Plan your route
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Open Giving Banner */}
      <section className="border-t border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-5 border border-ink/15 bg-cream p-6 sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">
                  Prefer open giving?
                </p>
                <h2 className="font-display mt-2 text-2xl tracking-tight text-ink sm:text-3xl">
                  Sadaqah is kept simple, but its reward with Allah is immeasurable.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-faded max-w-xl">
                  May Allah accept every contribution, multiply its reward, and make it a means of mercy, protection and endless blessings for you and your household. Āmīn.
                </p>
              </div>
              <Link
                href="/sadaqah"
                className="shrink-0 bg-vivid px-7 py-3.5 text-sm font-semibold text-white hover:bg-vivid-deep"
              >
                Go to Sadaqah
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
